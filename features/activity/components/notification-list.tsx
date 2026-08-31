import { Heart, MessageCircle, Repeat2, UserPlus } from 'lucide-react';
import { ViewTransition } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { RelativeTime } from '@/components/ui/relative-time';
import { Skeleton } from '@/components/ui/skeleton';
import { getNotifications } from '@/features/activity/notifications-queries';
import { UserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { getUserByHandle } from '@/features/user/user-queries';
import type { Notification, NotificationKind } from '@/types/notification';
import type { Route } from 'next';

const ICONS: Record<NotificationKind, React.ComponentType<{ className?: string }>> = {
  follow: UserPlus,
  like: Heart,
  reply: MessageCircle,
  repost: Repeat2,
};

const COLORS: Record<NotificationKind, string> = {
  follow: 'text-blue-500',
  like: 'text-rose-500',
  reply: 'text-emerald-500',
  repost: 'text-amber-500',
};

export async function NotificationList() {
  const notifications = await getNotifications();
  if (notifications.length === 0) {
    return (
      <EmptyState title="No notifications yet" body="When people interact with your drops, they'll show up here." />
    );
  }
  return (
    <ul>
      {notifications.map(n => (
        <ViewTransition key={n.id}>
          <li>
            <NotificationRow notification={n} />
          </li>
        </ViewTransition>
      ))}
    </ul>
  );
}

async function NotificationRow({ notification }: { notification: Notification }) {
  const actor = await getUserByHandle(notification.actorHandle);
  const Icon = ICONS[notification.kind];
  const href: Route = notification.dropId
    ? (`/drop/${notification.dropId}` as Route)
    : (`/u/${notification.actorHandle}` as Route);

  return (
    <PrefetchLink
      href={href}
      className={`border-divider/70 dark:border-divider-dark/70 hover:bg-card dark:hover:bg-card-dark flex items-start gap-3 border-b px-4 py-4 transition-colors sm:px-5 ${notification.read ? '' : 'flash-in'}`}
    >
      <Icon className={`mt-1 h-5 w-5 shrink-0 ${COLORS[notification.kind]}`} aria-hidden />
      <UserAvatar handle={notification.actorHandle} size="md" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-sm">
          <span className="font-semibold">{actor.displayName}</span>{' '}
          <span className="text-gray">{describe(notification.kind)}</span>
        </p>
        {notification.body ? <p className="text-gray line-clamp-2 text-sm">{notification.body}</p> : null}
        <span className="text-gray font-mono text-[12px]">
          <RelativeTime date={notification.createdAt} />
        </span>
      </div>
    </PrefetchLink>
  );
}

function describe(kind: NotificationKind): string {
  switch (kind) {
    case 'like':
      return 'liked your drop';
    case 'repost':
      return 'reposted your drop';
    case 'follow':
      return 'followed you';
    case 'reply':
      return 'replied to your drop';
  }
}

export function NotificationListSkeleton() {
  return (
    <ul aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="border-divider/70 dark:border-divider-dark/70 flex items-start gap-3 border-b px-4 py-4 sm:px-5"
        >
          <Skeleton className="h-5 w-5 rounded" />
          <UserAvatarSkeleton size="md" />
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-5 w-48 rounded" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
}
