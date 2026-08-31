import { AnimatedSuspense } from '@/components/ui/animated-suspense';
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

export default function ProfilePage({ params, searchParams }: PageProps<'/u/[handle]'>) {
  return (
    <div className="group/tabs">
      <PageHeader back title="Profile" />
      <AnimatedSuspense fallback={<ProfileHeaderSkeleton />}>
        {params.then(({ handle }) => (
          <ProfileHeader handle={handle} />
        ))}
      </AnimatedSuspense>
      <AnimatedSuspense fallback={<TabsSkeleton />}>
        {Promise.all([params, searchParams]).then(([{ handle }, sp]) => (
          <ProfileTabs handle={handle} active={parseTab(sp.tab)} />
        ))}
      </AnimatedSuspense>
      <div className="transition-opacity group-has-data-pending/tabs:opacity-50">
        <AnimatedSuspense fallback={<DropListSkeleton />}>
          {Promise.all([params, searchParams]).then(([{ handle }, sp]) => (
            <ProfileFeed handle={handle} tab={parseTab(sp.tab)} />
          ))}
        </AnimatedSuspense>
      </div>
    </div>
  );
}
