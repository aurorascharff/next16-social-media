import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { PageHeader } from '@/components/ui/page-header';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { TagFeed } from '@/features/tag/components/tag-feed';
import { TagHeader, TagHeaderSkeleton } from '@/features/tag/components/tag-header';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/tag/[tag]'>): Promise<Metadata> {
  const { tag } = await params;
  const title = `#${tag}`;
  const description = `Drops tagged #${tag}`;
  const url = `/tag/${tag}`;
  return {
    alternates: { canonical: url },
    description,
    title,
  };
}

export default function TagPage({ params }: PageProps<'/tag/[tag]'>) {
  return (
    <div>
      <PageHeader back title="Tag" />
      <AnimatedSuspense fallback={<TagHeaderSkeleton />}>
        {params.then(({ tag }) => (
          <TagHeader tag={tag} />
        ))}
      </AnimatedSuspense>
      <AnimatedSuspense fallback={<DropListSkeleton count={4} />}>
        {params.then(({ tag }) => (
          <TagFeed tag={tag} />
        ))}
      </AnimatedSuspense>
    </div>
  );
}
