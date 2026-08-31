'use client';

import { useEffect } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { fetcher, UNREAD_KEY } from '@/lib/swr';

export function MarkNotificationsRead() {
  const { data: count = 0 } = useSWR<number>(UNREAD_KEY, fetcher);
  const { mutate } = useSWRConfig();
  useEffect(() => {
    if (count > 0) {
      void mutate(UNREAD_KEY, 0, { revalidate: false });
      void fetch('/api/activity/read', { keepalive: true, method: 'POST' }).catch(() => {});
    }
  }, [count, mutate]);
  return null;
}
