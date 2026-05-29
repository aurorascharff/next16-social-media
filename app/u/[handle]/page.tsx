import { Suspense } from 'react';
import { Crossfade } from '@/components/ui/crossfade';
import { PageHeader } from '@/components/ui/page-header';
import { TabsSkeleton } from '@/components/ui/tabs';
import { DropListSkeleton } from '@/features/drop/components/drop';
import { ProfileFeed } from '@/features/user/components/profile-feed';
import { ProfileHeader, ProfileHeaderSkeleton } from '@/features/user/components/profile-header';
import { ProfileTabs, type ProfileTab } from '@/features/user/components/profile-tabs';
import { getUserByHandle } from '@/features/user/user-queries';
import type { Metadata } from 'next';

function parseTab(value: string | string[] | undefined): ProfileTab {
  return value === 'replies' ? 'replies' : 'drops';
}

export async function generateMetadata({ params }: PageProps<'/u/[handle]'>): Promise<Metadata> {
  const { handle } = await params;
  const user = await getUserByHandle(handle);
  const title = `${user.displayName} (@${user.handle})`;
  const url = `/u/${user.handle}`;
  return {
    alternates: { canonical: url },
    description: user.bio,
    openGraph: { type: 'profile', username: user.handle },
    title,
  };
}

export const unstable_prefetch = 'force-runtime';

export default function ProfilePage({ params, searchParams }: PageProps<'/u/[handle]'>) {
  return (
    <div>
      <PageHeader title="Profile" />
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <Crossfade>
          {params.then(({ handle }) => (
            <ProfileHeader handle={handle} />
          ))}
        </Crossfade>
      </Suspense>
      <Suspense fallback={<TabsSkeleton />}>
        <Crossfade>
          {Promise.all([params, searchParams]).then(([{ handle }, sp]) => (
            <ProfileTabs handle={handle} active={parseTab(sp.tab)} />
          ))}
        </Crossfade>
      </Suspense>
      <Suspense fallback={<DropListSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ handle }, sp]) => {
          const tab = parseTab(sp.tab);
          return (
            <Suspense key={tab} fallback={<DropListSkeleton />}>
              <Crossfade>
                <ProfileFeed handle={handle} tab={tab} />
              </Crossfade>
            </Suspense>
          )
        })}
      </Suspense>
    </div>
  );
}
