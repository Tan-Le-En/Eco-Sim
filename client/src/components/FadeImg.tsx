/**
 * ECO//SIM — FadeImg (v4 loading state)
 * Photos get an honest loading state: warm paper tone (via .photo-plate img
 * background) with a pulse while decoding, then a soft 500ms fade-in once ready.
 * Images already in the browser cache (complete on mount) fade immediately.
 */
import { useEffect, useRef, useState } from "react";

interface FadeImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Above-the-fold images: eager + high fetch priority */
  eager?: boolean;
}

export default function FadeImg({ eager, className, ...rest }: FadeImgProps) {
  const ref = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Cached images never fire onLoad after hydration — check `complete` once.
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      onLoad={() => setLoaded(true)}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding="async"
      className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0 animate-pulse"} ${className ?? ""}`}
      {...rest}
    />
  );
}
