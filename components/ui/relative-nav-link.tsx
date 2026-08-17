'use client';

import Link from 'next/link';
import { unstable_useRelativeHref as useRelativeHref, useSelectedLayoutSegment } from 'next/navigation';
import { Suspense } from 'react';
import type { Route } from 'next';

type Props = {
  href: string;
  segment: string | null;
  className?: string;
  children: React.ReactNode;
};

// Experimental: nav link built on unstable_useRelativeHref (PR #96068).
// `href` is a route pattern like "/u/[handle]/followers"; the rendered href
// comes from the hook, the active state from useSelectedLayoutSegment. The
// Suspense boundary lives inside, so consumers drop links in directly.
export function RelativeNavLink(props: Props) {
  return (
    <Suspense
      fallback={
        <span aria-hidden className={props.className}>
          {props.children}
        </span>
      }
    >
      <RelativeNavLinkInner {...props} />
    </Suspense>
  );
}

function RelativeNavLinkInner({ href, segment, className, children }: Props) {
  const relativeHref = useRelativeHref(href);
  const activeSegment = useSelectedLayoutSegment();
  const isActive = segment === activeSegment;

  return (
    <Link
      href={relativeHref as Route}
      aria-current={isActive ? 'page' : undefined}
      data-relative-href={relativeHref}
      className={className}
    >
      {children}
    </Link>
  );
}
