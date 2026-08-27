'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePrefetchDefault } from '@/components/demo/use-prefetch-default';
import type { Route } from 'next';

type Props<T extends string = string> = Omit<React.ComponentProps<typeof Link>, 'href' | 'prefetch'> & {
  href: Route<T> | URL;
};

// A `<Link>` that defers its prefetch until the user shows intent.
// Until hover/focus it sits at the App Shell (`prefetch={null}`); intent upgrades
// it to a full prefetch so the click lands on warm content. Use for
// low-intent list links (tags) so N of them don't each wake a server on render.
export function HoverPrefetchLink<T extends string>({ href, onMouseEnter, onFocus, ...props }: Props<T>) {
  const [intent, setIntent] = useState(false);
  const enabled = usePrefetchDefault() === true;
  return (
    <Link
      {...props}
      href={href as Route}
      prefetch={enabled && intent ? true : null}
      onMouseEnter={e => {
        setIntent(true);
        onMouseEnter?.(e);
      }}
      onFocus={e => {
        setIntent(true);
        onFocus?.(e);
      }}
    />
  );
}
