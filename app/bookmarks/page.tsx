import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { PageHeader } from '@/components/ui/page-header';
import { BookmarksFeed } from '@/features/drop/components/bookmarks-feed';
import { DropListSkeleton } from '@/features/drop/components/drop';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/bookmarks' },
  description: 'Drops you bookmarked.',
  robots: { follow: false, index: false },
  title: 'Bookmarks',
};

export default function BookmarksPage() {
  return (
    <div>
      <PageHeader back title="Bookmarks" />
      <AnimatedSuspense fallback={<DropListSkeleton count={3} />}>
        <BookmarksFeed />
      </AnimatedSuspense>
    </div>
  );
}
