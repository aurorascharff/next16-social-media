import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { TabsSkeleton } from '@/components/ui/tabs';
import { DropComposer } from '@/features/drop/components/composer';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { Feed, DiscoverFeed } from '@/features/drop/components/feed';
import { FeedTabs } from '@/features/drop/components/feed-tabs';

export const unstable_prefetch = 'force-runtime';

function parseTab(value: string | string[] | undefined): 'following' | 'discover' {
  return value === 'discover' ? 'discover' : 'following';
}

function parsePage(value: string | string[] | undefined): number {
  const n = Number(value);
  return n > 0 && Number.isInteger(n) ? n : 1;
}

export default function HomePage({ searchParams }: PageProps<'/'>) {
  return (
    <div>
      <PageHeader title="Home" />
      <Suspense fallback={<TabsSkeleton />}>
        <FeedTabs />
      </Suspense>
      <DropComposer />
      <Suspense fallback={<DropListSkeleton />}>
        {searchParams.then(sp => {
          const tab = parseTab(sp.tab);
          const page = parsePage(sp.page);
          return (
            <Suspense key={tab} fallback={<DropListSkeleton />}>
              <Crossfade>
                {tab === 'discover' ? <DiscoverFeed page={page} /> : <Feed page={page} />}
              </Crossfade>
            </Suspense>
          );
        })}
      </Suspense>
    </div >
  );
}
