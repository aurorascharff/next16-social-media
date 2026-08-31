import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { RefreshButton } from '@/components/ui/refresh-button';
import { TabsSkeleton } from '@/components/ui/tabs';
import { DropComposer } from '@/features/drop/components/composer';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { Feed, DiscoverFeed } from '@/features/drop/components/feed';
import { FeedTabs } from '@/features/drop/components/feed-tabs';
import { MAX_FEED_PAGE } from '@/features/drop/drop-constants';

function parseTab(value: string | string[] | undefined): 'following' | 'discover' {
  return value === 'discover' ? 'discover' : 'following';
}

function parsePage(value: string | string[] | undefined): number {
  const n = Number(value);
  const page = n > 0 && Number.isInteger(n) ? n : 1;
  return Math.min(page, MAX_FEED_PAGE);
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div className="group/tabs">
      <div className="sticky top-0 z-30 bg-white/70 backdrop-blur-md backdrop-saturate-150 dark:bg-black/70">
        <div className="hidden items-center px-4 py-4 sm:flex sm:px-5">
          <h1 className="text-lg font-bold tracking-tight">Home</h1>
          <RefreshButton label="Refresh feed" />
        </div>
        <Suspense fallback={<TabsSkeleton />}>
          <FeedTabs />
        </Suspense>
      </div>
      <DropComposer />
      <div className="transition-opacity group-has-data-pending/tabs:opacity-50">
        <Suspense fallback={<DropListSkeleton />}>
          <Crossfade>
            {searchParams.then(sp => {
              const tab = parseTab(sp.tab);
              const page = parsePage(sp.page);
              return tab === 'discover' ? <DiscoverFeed /> : <Feed page={page} />;
            })}
          </Crossfade>
        </Suspense>
      </div>
    </div>
  );
}
