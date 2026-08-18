/**
 * ECO//SIM — Skip to content (v7 production layer)
 * Keyboard-only link that jumps focus to the main landmark.
 * Hidden until Tab-pressed, per WCAG practice.
 */
export default function SkipToContent() {
  return (
    <a href="#main" className="skip-link" data-no-print="true">
      Skip to content
    </a>
  );
}
