'use client';

import { useOptimistic, useTransition, ViewTransition } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Tab<T extends string> = { label: string; value: T; href: Route };

type Props<T extends string> = {
  tabs: Tab<T>[];
  active: T;
  label?: string;
  indicatorName?: string;
};

export function Tabs<T extends string>({
  tabs,
  active,
  label = 'Sections',
  indicatorName = 'tab-indicator',
}: Props<T>) {
  const [optimisticActive, setOptimisticActive] = useOptimistic(active);
  const [isPending, startTransition] = useTransition();

  return (
    <Boundary label="Tabs">
      <nav
        className="border-divider/70 dark:border-divider-dark/70 flex border-b text-sm"
        aria-label={label}
        data-pending={isPending ? '' : undefined}
      >
        {tabs.map(t => {
          const isActive = optimisticActive === t.value;
          const isCommitted = active === t.value;
          return (
            <PrefetchLink
              scroll={false}
              key={t.value}
              href={t.href}
              onNavigate={() => {
                if (t.value === optimisticActive) return;
                startTransition(() => {
                  setOptimisticActive(t.value);
                });
              }}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group/tab relative flex flex-1 items-center justify-center py-3.5 text-center transition-colors',
                isActive
                  ? 'font-semibold text-black dark:text-white'
                  : 'text-gray font-medium hover:text-black dark:hover:text-white',
              )}
            >
              <span
                aria-hidden
                className="absolute inset-x-6 top-2 bottom-0 rounded-t-lg transition-colors group-hover/tab:bg-black/5 dark:group-hover/tab:bg-white/5"
              />
              <span className="relative">{t.label}</span>
              {isCommitted ? (
                <ViewTransition name={indicatorName} share="tab-underline">
                  <span
                    className="absolute inset-x-6 -bottom-px h-1 rounded-t-full bg-black dark:bg-white"
                    aria-hidden
                  />
                </ViewTransition>
              ) : null}
            </PrefetchLink>
          );
        })}
      </nav>
    </Boundary>
  );
}

export function TabsSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 flex border-b text-sm" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="flex flex-1 items-center justify-center py-3.5">
          <Skeleton className="h-5 w-16 rounded" />
        </span>
      ))}
    </div>
  );
}
