'use client';

import { use, useState, useTransition, type ReactNode } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';

export type Page = { node: ReactNode; hasMore: boolean };

type Props = {
  initialPage: Promise<Page>;
  renderPage: (index: number) => Promise<Page>;
  skeleton?: ReactNode;
};

export function Paginator({ initialPage, renderPage, skeleton }: Props) {
  const [pages, setPages] = useState([initialPage]);
  const [seed, setSeed] = useState(initialPage);
  const [isPending, startTransition] = useTransition();

  if (seed !== initialPage) {
    setSeed(initialPage);
    setPages([initialPage]);
  }

  function loadMore() {
    const next = renderPage(pages.length + 1);
    startTransition(() => {
      setPages(prev => [...prev, next]);
    });
  }

  return (
    <>
      {pages.map((page, i) => {
        const content = (
          <PageContent page={page} isLast={i === pages.length - 1} isPending={isPending} onLoadMore={loadMore} />
        );
        return i === 0 ? (
          <AnimatedSuspense key={i} fallback={skeleton}>
            {content}
          </AnimatedSuspense>
        ) : (
          <AnimatedSuspense key={i} fallback={skeleton}>
            {content}
          </AnimatedSuspense>
        );
      })}
    </>
  );
}

function PageContent({
  page,
  isLast,
  isPending,
  onLoadMore,
}: {
  page: Promise<Page>;
  isLast: boolean;
  isPending: boolean;
  onLoadMore: () => void;
}) {
  const { node, hasMore } = use(page);
  return (
    <>
      {node}
      {isLast && hasMore ? (
        <div className="flex justify-center p-6">
          <button
            type="button"
            disabled={isPending}
            onClick={onLoadMore}
            className="border-divider dark:border-divider-dark rounded-full border px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
          >
            {isPending ? 'Loading…' : 'Load more'}
          </button>
        </div>
      ) : null}
    </>
  );
}
