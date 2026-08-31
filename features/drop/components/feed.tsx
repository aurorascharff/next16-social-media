import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadMore } from '@/components/ui/load-more';
import { Paginator } from '@/components/ui/paginator';
import { Drop, DropListSkeleton } from '@/features/drop/components/drop';
import { renderDiscoverPage } from '@/features/drop/discover-page-action';
import { MAX_FEED_PAGE } from '@/features/drop/drop-constants';
import { getFeed } from '@/features/drop/drop-queries';
import type { Route } from 'next';

/*
  Two ways to page the same feed, with different tradeoffs.

  Feed (following) puts the page number in the ?page URL. The URL is shareable and
  survives a reload, but each Load more re-renders pages 1 through N on the server,
  not only the new page.

  DiscoverFeed uses a client Paginator that keeps the server-rendered pages in state
  and appends one per Load more, so each press fetches only the new page. In exchange
  it gives up the shareable URL, loses its pages on reload, and sits outside
  revalidation, so it will not refresh on its own.
*/

export async function Feed({ page = 1 }: { page?: number }) {
  const { items } = await getFeed(1);
  if (items.length === 0) {
    return (
      <EmptyState
        title="Your following feed is quiet"
        body="Follow some people, or head to Discover to find new voices."
      />
    );
  }
  return (
    <ul>
      {Array.from({ length: page }).map((_, i) => {
        const p = i + 1;
        const isLast = p === page;
        return p === 1 ? (
          <FeedPage key={p} page={p} isLast={isLast} />
        ) : (
          <AnimatedSuspense key={p} fallback={<DropListSkeleton count={3} />}>
            <FeedPage page={p} isLast={isLast} />
          </AnimatedSuspense>
        );
      })}
    </ul>
  );
}

async function FeedPage({ page, isLast }: { page: number; isLast: boolean }) {
  const { items, hasMore } = await getFeed(page);
  return (
    <>
      {items.map(item => (
        <li key={item.kind === 'repost' ? `repost:${item.repostedBy}:${item.drop.id}` : `drop:${item.drop.id}`}>
          <Drop drop={item.drop} repostedBy={item.kind === 'repost' ? item.repostedBy : undefined} />
        </li>
      ))}
      {isLast && hasMore && page < MAX_FEED_PAGE ? (
        <li className="flex justify-center p-6">
          <LoadMore href={`/?page=${page + 1}` as Route} />
        </li>
      ) : null}
    </>
  );
}

export function DiscoverFeed() {
  return (
    <Paginator
      initialPage={renderDiscoverPage(1)}
      renderPage={renderDiscoverPage}
      skeleton={<DropListSkeleton count={3} />}
    />
  );
}
