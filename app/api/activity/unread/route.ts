import { NextResponse } from 'next/server';
import { getUnreadNotificationCount } from '@/features/activity/notifications-queries';

export async function GET() {
  return NextResponse.json(await getUnreadNotificationCount());
}
