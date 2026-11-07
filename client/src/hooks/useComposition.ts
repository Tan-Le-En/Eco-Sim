import { useCallback, useRef } from "react";

export interface UseCompositionReturn<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onCompositionStart: React.CompositionEventHandler<T>;
  onCompositionEnd: React.CompositionEventHandler<T>;
  onKeyDown: React.KeyboardEventHandler<T>;
  isComposing: () => boolean;
}

export interface UseCompositionOptions<
  T extends HTMLInputElement | HTMLTextAreaElement,
> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onCompositionStart?: React.CompositionEventHandler<T>;
  onCompositionEnd?: React.CompositionEventHandler<T>;
}

type TimerResponse = ReturnType<typeof setTimeout>;

/**
 * IME-composition guard for text inputs in dialogs (CJK input methods):
 * while the composition is live, Escape/Enter must not bubble to dialog
 * handlers, and Safari's compositionend-before-change quirk is absorbed
 * with a double timeout.
 */
export function useComposition<
  T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement,
>(options: UseCompositionOptions<T> = {}): UseCompositionReturn<T> {
  const {
    onKeyDown: originalOnKeyDown,
    onCompositionStart: originalOnCompositionStart,
    onCompositionEnd: originalOnCompositionEnd,
  } = options;

  const c = useRef(false);
  const timer = useRef<TimerResponse | null>(null);
  const timer2 = useRef<TimerResponse | null>(null);

  const clearTimers = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (timer2.current) {
      clearTimeout(timer2.current);
      timer2.current = null;
    }
  };

  const onCompositionStart = useCallback(
    (e: React.CompositionEvent<T>) => {
      clearTimers();
      c.current = true;
      originalOnCompositionStart?.(e);
    },
    [originalOnCompositionStart],
  );

  const onCompositionEnd = useCallback(
    (e: React.CompositionEvent<T>) => {
      // Two nested timeouts: Safari fires compositionEnd before the final
      // change event, so `composing` must stay true a beat longer.
      timer.current = setTimeout(() => {
        timer2.current = setTimeout(() => {
          c.current = false;
        });
      });
      originalOnCompositionEnd?.(e);
    },
    [originalOnCompositionEnd],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<T>) => {
      // While composing, stop Escape and Enter (without Shift) from bubbling.
      if (
        c.current &&
        (e.key === "Escape" || (e.key === "Enter" && !e.shiftKey))
      ) {
        e.stopPropagation();
        return;
      }
      originalOnKeyDown?.(e);
    },
    [originalOnKeyDown],
  );

  const isComposing = useCallback(() => c.current, []);

  return {
    onCompositionStart,
    onCompositionEnd,
    onKeyDown,
    isComposing,
  };
}
