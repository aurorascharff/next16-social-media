'use client';

import useSWR from 'swr';
import { fetcher, UNREAD_KEY } from '@/lib/swr';

export function NotificationsBadge() {
  const { data: count = 0 } = useSWR<number>(UNREAD_KEY, fetcher, {
    refreshInterval: 15_000,
    revalidateOnFocus: true,
  });
  if (count === 0) {
    return null;
  }
  return (
    <span
      aria-label={`${count} unread notifications`}
      className="bg-accent ml-auto inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
    >
      {count > 9 ? '9+' : count}
    </span>
  );
}
