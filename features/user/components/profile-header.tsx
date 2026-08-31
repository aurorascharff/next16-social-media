import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from '@/features/user/components/follow-button';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { getCurrentUserHandle, getUserByHandle, isFollowing } from '@/features/user/user-queries';
import { cn, formatCount } from '@/lib/utils';

export async function ProfileHeader({ handle }: { handle: string }) {
  const user = await getUserByHandle(handle);
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 border-b">
      <div
        className={cn('h-32 w-full bg-gradient-to-br opacity-30 sm:h-40 dark:opacity-40', user.avatarColor)}
        aria-hidden
      />
      <div className="px-5 pb-4">
        <div className="-mt-10 flex items-start justify-between sm:-mt-12">
          <div className="rounded-full bg-white p-1 dark:bg-black">
            <UserAvatar handle={user.handle} size="lg" />
          </div>
          <div className="flex h-20 items-end sm:h-24">
            <AnimatedSuspense fallback={<Skeleton className="h-8 w-28 rounded-full" />}>
              <ProfileFollowButton handle={handle} />
            </AnimatedSuspense>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-xl font-bold tracking-tight">{user.displayName}</h1>
            <div className="text-gray font-mono text-xs">@{user.handle}</div>
          </div>
          <p className="text-sm">{user.bio}</p>
          <div className="text-gray flex gap-4 font-mono text-xs">
            <span>
              <strong className="text-black dark:text-white">{formatCount(user.following)}</strong> Following
            </span>
            <span>
              <strong className="text-black dark:text-white">{formatCount(user.followers)}</strong> Followers
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

async function ProfileFollowButton({ handle }: { handle: string }) {
  const currentHandle = await getCurrentUserHandle();
  if (currentHandle === handle) return null;
  const following = await isFollowing(handle);
  return <FollowButton targetHandle={handle} following={following} />;
}

export function ProfileHeaderSkeleton() {
  return (
    <header className="border-divider/70 dark:border-divider-dark/70 border-b">
      <div className="bg-card dark:bg-card-dark h-32 w-full sm:h-40" aria-hidden />
      <div className="px-5 pb-4">
        <div className="-mt-10 flex items-start justify-between sm:-mt-12">
          <div className="rounded-full bg-white p-1 dark:bg-black">
            <UserAvatarSkeleton size="lg" />
          </div>
          <div className="flex h-20 items-end sm:h-24" />
        </div>
        <div className="mt-5 flex flex-col gap-4 pb-4.5">
          <Skeleton className="h-6 w-28 rounded" />
          <Skeleton className="h-3 w-48 rounded" />
          <Skeleton className="h-3 w-32 rounded" />
        </div>
      </div>
    </header>
  );
}
