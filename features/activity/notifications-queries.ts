import 'server-only';

import { cacheTag } from 'next/cache';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import type { Notification, NotificationKind } from '@/types/notification';

export async function getNotifications(): Promise<Notification[]> {
  return getNotificationsForHandle(await getCurrentUserHandle(), await isSlowEnabled());
}

async function getNotificationsForHandle(handle: string, slow: boolean): Promise<Notification[]> {
  'use cache';
  cacheTag(`notifications:${handle}`);

  await delay(600, slow);

  const rows = await prisma.notification.findMany({
    orderBy: { createdAt: 'desc' },
    take: 30,
    where: { recipientHandle: handle },
  });

  return rows.map(r => ({
    actorHandle: r.actorHandle,
    body: r.body ?? undefined,
    createdAt: r.createdAt,
    dropId: r.dropId ?? undefined,
    id: r.id,
    kind: r.kind as NotificationKind,
    read: r.readAt !== null,
  }));
}

export async function getUnreadNotificationCount(): Promise<number> {
  return getUnreadNotificationCountForHandle(await getCurrentUserHandle());
}

async function getUnreadNotificationCountForHandle(handle: string): Promise<number> {
  'use cache';
  cacheTag(`notifications:${handle}`);

  return prisma.notification.count({
    where: { readAt: null, recipientHandle: handle },
  });
}
