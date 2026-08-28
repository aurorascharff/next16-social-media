import { Repeat2 } from 'lucide-react';
import { Suspense } from 'react';
import { CodeBlock } from '@/components/ui/code-block';
import { HoverPrefetchLink } from '@/components/ui/hover-prefetch-link';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { RelativeTime } from '@/components/ui/relative-time';
import { Skeleton } from '@/components/ui/skeleton';
import { DropActions } from '@/features/drop/components/drop-actions';
import { DropBody } from '@/features/drop/components/drop-body';
import { UserAvatar } from '@/features/user/components/user-avatar';
import { getCurrentUserHandle, getUserByHandle, getUserDropInteractions } from '@/features/user/user-queries';
import type { Drop as DropT } from '@/types/drop';
import type { Route } from 'next';

type Props = {
  drop: DropT;
  compact?: boolean;
  repostedBy?: string;
};

export async function Drop({ drop, compact = false, repostedBy }: Props) {
  const interactions = await getUserDropInteractions();
  const href = `/drop/${drop.parentId ?? drop.id}` as Route;
  const isLong = drop.body.length > 280;
  const isTruncated = isLong && !compact;
  const userState = {
    bookmarked: interactions.bookmarked.has(drop.id),
    liked: interactions.liked.has(drop.id),
    reposted: interactions.reposted.has(drop.id),
  };
  return (
    <article className="group/drop border-divider/70 dark:border-divider-dark/70 hover:bg-card/40 dark:hover:bg-card-dark/40 relative border-b transition-colors">
      <PrefetchLink
        href={href}
        aria-label="Open drop"
        className="absolute inset-0 z-10"
      />
      {repostedBy ? (
        <Suspense fallback={<ReposterSkeleton />}>
          <Reposter handle={repostedBy} />
        </Suspense>
      ) : null}
      <div className="relative flex gap-3 px-4 py-4 sm:px-5">
        <HoverPrefetchLink href={`/u/${drop.authorHandle}` as Route} className="relative z-20 shrink-0">
          <UserAvatar handle={drop.authorHandle} size="md" />
        </HoverPrefetchLink>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <header className="flex flex-wrap items-baseline gap-x-1.5 text-sm">
            <AuthorName handle={drop.authorHandle} />
            <span className="text-gray font-mono text-[12px]">·</span>
            <span className="text-gray font-mono text-[12px]">
              <RelativeTime date={drop.createdAt} />
            </span>
          </header>
          <DropBody body={drop.body} compact={compact} truncate={isTruncated} />
          {isTruncated ? (
            <PrefetchLink href={href} className="text-accent relative z-20 w-fit text-sm hover:underline">
              Show more
            </PrefetchLink>
          ) : null}
          {drop.embeddedCode && !compact ? (
            <div className="relative z-20">
              <CodeBlock lang={drop.embeddedCode.lang} code={drop.embeddedCode.code} />
            </div>
          ) : null}
          <div className="relative z-20 w-fit">
            <DropActions
              dropId={drop.id}
              parentId={drop.parentId}
              replies={drop.replies}
              reposts={drop.reposts}
              likes={drop.likes}
              userState={userState}
              compact={compact}
            />
          </div>
        </div>
      </div>
    </article>
  );
}

export function DropList({
  drops,
  compact,
  repostedBy,
}: {
  drops: DropT[];
  compact?: boolean;
  repostedBy?: (drop: DropT) => string | undefined;
}) {
  return (
    <ul>
      {drops.map((drop, i) => (
        <li key={`${drop.id}-${i}`}>
          <Drop drop={drop} compact={compact} repostedBy={repostedBy?.(drop)} />
        </li>
      ))}
    </ul>
  );
}

async function AuthorName({ handle }: { handle: string }) {
  const author = await getUserByHandle(handle);
  return (
    <>
      <HoverPrefetchLink
        href={`/u/${author.handle}` as Route}
        className="relative z-20 font-semibold tracking-tight text-black hover:underline dark:text-white"
      >
        {author.displayName}
      </HoverPrefetchLink>
      <HoverPrefetchLink
        href={`/u/${author.handle}` as Route}
        className="text-gray relative z-20 font-mono text-[12px]"
      >
        @{author.handle}
      </HoverPrefetchLink>
    </>
  );
}

async function Reposter({ handle }: { handle: string }) {
  const [reposter, currentHandle] = await Promise.all([getUserByHandle(handle), getCurrentUserHandle()]);
  return (
    <HoverPrefetchLink
      href={`/u/${reposter.handle}` as Route}
      className="text-gray hover:text-success relative z-20 flex w-fit items-center gap-2 px-4 pt-3 text-xs sm:px-5"
    >
      <Repeat2 className="h-3 w-3" />
      <span>{reposter.handle === currentHandle ? 'You' : reposter.displayName} reposted</span>
    </HoverPrefetchLink>
  );
}

function ReposterSkeleton() {
  return (
    <div className="relative z-20 flex w-fit items-center gap-2 px-4 pt-3 text-xs sm:px-5" aria-hidden>
      <Repeat2 className="text-gray h-3 w-3" />
      <Skeleton className="h-3 w-20 rounded" />
    </div>
  );
}

function DropSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 min-h-[120px] border-b px-4 py-4 sm:px-5">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      </div>
    </div>
  );
}

export function DropListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ul aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <DropSkeleton />
        </li>
      ))}
    </ul>
  );
}
