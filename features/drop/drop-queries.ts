import 'server-only';

import { cacheLife, cacheTag, unstable_navigation as navigation } from 'next/cache';
import { notFound } from 'next/navigation';
import { isSlowEnabled } from '@/components/demo/demo-slow';
import { FEED_PAGE_SIZE } from '@/features/drop/drop-constants';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';
import { delay } from '@/lib/utils';
import { toDrop, type Drop } from '@/types/drop';

export type FeedItem =
  | { kind: 'drop'; drop: Drop; pinnedAt: number }
  | { kind: 'repost'; drop: Drop; repostedBy: string; pinnedAt: number };

type FeedPage = { drops: Drop[]; hasMore: boolean };
type FollowingFeedPage = { items: FeedItem[]; hasMore: boolean };

export async function getFeed(page: number = 1): Promise<FollowingFeedPage> {
  return getFeedForHandle(await getCurrentUserHandle(), page, await isSlowEnabled());
}

async function getFeedForHandle(handle: string, page: number, slow: boolean): Promise<FollowingFeedPage> {
  'use cache';
  cacheTag('feed', `feed:${handle}`);
  await delay(800, slow);
  const following = await prisma.follow.findMany({
    select: { targetHandle: true },
    where: { followerHandle: handle },
  });
  const followedHandles = [handle, ...following.map(f => f.targetHandle)];
  const take = page * FEED_PAGE_SIZE + 1;
  const [authored, reposts] = await Promise.all([
    prisma.drop.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      where: { authorHandle: { in: followedHandles }, parentId: null },
    }),
    prisma.repost.findMany({
      include: { drop: true },
      orderBy: { createdAt: 'desc' },
      take,
      where: { drop: { parentId: null }, userHandle: { in: followedHandles } },
    }),
  ]);

  const sorted: FeedItem[] = [
    ...authored.map(d => ({ drop: toDrop(d), kind: 'drop' as const, pinnedAt: d.createdAt.getTime() })),
    ...reposts.map(r => ({
      drop: toDrop(r.drop),
      kind: 'repost' as const,
      pinnedAt: r.createdAt.getTime(),
      repostedBy: r.userHandle,
    })),
  ].sort((a, b) => b.pinnedAt - a.pinnedAt);

  const start = (page - 1) * FEED_PAGE_SIZE;
  const slice = sorted.slice(start, start + FEED_PAGE_SIZE + 1);
  const hasMore = slice.length > FEED_PAGE_SIZE;
  return {
    hasMore,
    items: hasMore ? slice.slice(0, FEED_PAGE_SIZE) : slice,
  };
}

export async function getDiscoverFeed(page: number = 1): Promise<FeedPage> {
  return getDiscoverFeedForHandle(await getCurrentUserHandle(), page, await isSlowEnabled());
}

async function getDiscoverFeedForHandle(handle: string, page: number, slow: boolean): Promise<FeedPage> {
  'use cache';
  cacheTag('feed', `discover:${handle}`);
  await delay(800, slow);
  const following = await prisma.follow.findMany({
    select: { targetHandle: true },
    where: { followerHandle: handle },
  });
  const excludeHandles = [handle, ...following.map(f => f.targetHandle)];
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * FEED_PAGE_SIZE,
    take: FEED_PAGE_SIZE + 1,
    where: {
      authorHandle: { notIn: excludeHandles },
      parentId: null,
    },
  });
  const hasMore = rows.length > FEED_PAGE_SIZE;
  const items = hasMore ? rows.slice(0, FEED_PAGE_SIZE) : rows;
  return {
    drops: items.map(toDrop),
    hasMore,
  };
}

export async function getDrop(id: string) {
  return getDropCached(id, await isSlowEnabled());
}

async function getDropCached(id: string, slow: boolean) {
  'use cache';
  cacheTag('drops', `drop-${id}`);
  await delay(600, slow);
  const row = await prisma.drop.findUnique({ where: { id } });
  if (!row) notFound();
  return toDrop(row);
}

export async function getReplies(dropId: string) {
  await navigation();
  return getRepliesCached(dropId, await isSlowEnabled());
}

async function getRepliesCached(dropId: string, slow: boolean) {
  'use cache';
  cacheTag(`replies:${dropId}`);
  await delay(1800, slow);
  const parent = await prisma.drop.findUnique({
    select: { authorHandle: true },
    where: { id: dropId },
  });
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { parentId: dropId },
  });
  // Twitter-style: pin the original author's replies first in thread order (oldest-first), then
  // newest-first for everyone else.
  const authorHandle = parent?.authorHandle;
  const authorReplies = authorHandle ? rows.filter(r => r.authorHandle === authorHandle).reverse() : [];
  const otherReplies = authorHandle ? rows.filter(r => r.authorHandle !== authorHandle) : rows;
  return [...authorReplies, ...otherReplies].map(toDrop);
}

export async function getDropsByAuthor(handle: string): Promise<FeedItem[]> {
  return getDropsByAuthorCached(handle, await isSlowEnabled());
}

async function getDropsByAuthorCached(handle: string, slow: boolean): Promise<FeedItem[]> {
  'use cache';
  cacheTag('drops', `user-drops-${handle}`);
  await delay(400, slow);
  const [authored, reposts] = await Promise.all([
    prisma.drop.findMany({
      where: { authorHandle: handle, parentId: null },
    }),
    prisma.repost.findMany({
      include: { drop: true },
      where: { drop: { parentId: null }, userHandle: handle },
    }),
  ]);

  const items: FeedItem[] = [
    ...authored.map(d => ({ drop: toDrop(d), kind: 'drop' as const, pinnedAt: d.createdAt.getTime() })),
    ...reposts.map(r => ({
      drop: toDrop(r.drop),
      kind: 'repost' as const,
      pinnedAt: r.createdAt.getTime(),
      repostedBy: handle,
    })),
  ];
  return items.sort((a, b) => b.pinnedAt - a.pinnedAt);
}

export async function getRepliesByAuthor(handle: string) {
  await delay(400, await isSlowEnabled());
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { authorHandle: handle, parentId: { not: null } },
  });
  return rows.map(toDrop);
}

export async function getDropsByTag(tag: string) {
  return getDropsByTagCached(tag, await isSlowEnabled());
}

async function getDropsByTagCached(tag: string, slow: boolean) {
  'use cache';
  cacheTag('drops', `tag-${tag}`);
  await delay(400, slow);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: { parentId: null, tags: { contains: tag } },
  });
  return rows.map(toDrop).filter(d => d.tags.includes(tag));
}

export async function getBookmarkedDrops() {
  return getBookmarkedDropsForHandle(await getCurrentUserHandle(), await isSlowEnabled());
}

async function getBookmarkedDropsForHandle(handle: string, slow: boolean) {
  'use cache';
  cacheTag(`bookmarks:${handle}`);
  await delay(400, slow);
  const rows = await prisma.bookmark.findMany({
    include: { drop: true },
    orderBy: { createdAt: 'desc' },
    where: { userHandle: handle },
  });
  return rows.map(r => toDrop(r.drop));
}

export async function searchDrops(query: string) {
  return searchDropsCached(query, await isSlowEnabled());
}

async function searchDropsCached(query: string, slow: boolean) {
  'use cache';
  cacheTag('drops', `search-${query}`);
  cacheLife('hours');

  await delay(300, slow);
  const rows = await prisma.drop.findMany({
    orderBy: { createdAt: 'desc' },
    where: {
      body: { contains: query, mode: 'insensitive' },
      parentId: null,
    },
  });
  return rows.map(toDrop);
}
