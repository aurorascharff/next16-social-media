import { ViewTransition } from 'react';

/**
 * Crossfades content on Suspense reveal. Wraps `<ViewTransition enter="auto" default="none">`
 * so the animation only fires when suspended content streams in — not during unrelated transitions.
 */
export function Crossfade({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={{ default: 'auto', tabChange: 'none' }} default="none" >
      {children}
    </ViewTransition>
  );
}
