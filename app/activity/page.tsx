import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { PageHeader } from '@/components/ui/page-header';
import { RefreshButton } from '@/components/ui/refresh-button';
import { MarkNotificationsRead } from '@/features/notifications/components/mark-notifications-read';
import { NotificationList, NotificationListSkeleton } from '@/features/notifications/components/notification-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: '/notifications' },
  description: 'Activity on your drops.',
  robots: { follow: false, index: false },
  title: 'Activity',
};

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader back title="Activity">
        <RefreshButton label="Refresh activity" />
      </PageHeader>
      <MarkNotificationsRead />
      <AnimatedSuspense fallback={<NotificationListSkeleton />}>
        <NotificationList />
      </AnimatedSuspense>
    </div>
  );
}
