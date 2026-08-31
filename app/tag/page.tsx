import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { PageHeader } from '@/components/ui/page-header';
import { TagsList, TagsListSkeleton } from '@/features/tag/components/tags-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/tag' },
  description: 'Trending tags on Drop.',
  title: 'Trending Tags',
};

export default function TagsPage() {
  return (
    <div>
      <PageHeader back title="Trending Tags" />
      <AnimatedSuspense fallback={<TagsListSkeleton />}>
        <TagsList />
      </AnimatedSuspense>
    </div>
  );
}
