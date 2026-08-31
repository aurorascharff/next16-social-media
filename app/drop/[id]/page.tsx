import { Suspense } from 'react';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { PageHeader } from '@/components/ui/page-header';
import { Section, SectionHeader } from '@/components/ui/section';
import { DropDetail, DropDetailSkeleton } from '@/features/drop/components/drop-detail';
import { Replies, RepliesSkeleton } from '@/features/drop/components/replies';
import { ReplyComposerForm } from '@/features/drop/components/reply-form';
import { getDrop } from '@/features/drop/drop-queries';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { getUserByHandle } from '@/features/user/user-queries';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps<'/drop/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const drop = await getDrop(id);
  const author = await getUserByHandle(drop.authorHandle);
  const snippet = drop.body.length > 60 ? `${drop.body.slice(0, 57).trimEnd()}…` : drop.body;
  const title = `${author.displayName}: ${snippet}`;
  const description = drop.body.length > 160 ? `${drop.body.slice(0, 157)}…` : drop.body;
  return {
    alternates: { canonical: `/drop/${id}` },
    description,
    openGraph: { authors: [author.displayName], type: 'article' },
    title,
  };
}

export default function DropPage({ params }: PageProps<'/drop/[id]'>) {
  return (
    <div>
      <PageHeader back title="Drop" />
      <AnimatedSuspense fallback={<DropDetailSkeleton />}>
        {params.then(({ id }) => (
          <>
            <DropDetail id={id} />
            <Section className="p-4 sm:p-5">
              <ReplyComposerForm
                dropId={id}
                avatar={
                  <Suspense fallback={<UserAvatarSkeleton size="md" />}>
                    <CurrentUserAvatar />
                  </Suspense>
                }
              />
            </Section>
            <section>
              <SectionHeader>Replies</SectionHeader>
              <ErrorBoundary title="Replies didn’t load">
                <AnimatedSuspense fallback={<RepliesSkeleton />}>
                  <Replies id={id} />
                </AnimatedSuspense>
              </ErrorBoundary>
            </section>
          </>
        ))}
      </AnimatedSuspense>
    </div>
  );
}
