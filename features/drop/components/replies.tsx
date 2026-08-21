import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { DropList } from '@/features/drop/components/drop';
import { getReplies } from '@/features/drop/drop-queries';

export async function Replies({ id }: { id: string }) {
  const replies = await getReplies(id);
  return (
    <div data-testid="replies">
      {replies.length === 0 ? (
        <EmptyState title="No replies yet" body="Be the first to reply." />
      ) : (
        <DropList drops={replies} compact />
      )}
    </div>
  );
}

export function RepliesSkeleton() {
  return (
    <div className="border-divider/70 dark:border-divider-dark/70 border-b px-4 py-4 sm:px-5">
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
  );
}
