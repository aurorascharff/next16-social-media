import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/features/user/user-queries';
import { prisma } from '@/lib/db';

export async function POST() {
  const me = await verifyAuth();
  const result = await prisma.notification.updateMany({
    data: { readAt: new Date() },
    where: { readAt: null, recipientHandle: me },
  });
  if (result.count > 0) {
    revalidateTag(`notifications:${me}`, { expire: 0 });
  }
  return new NextResponse(null, { status: 204 });
}
