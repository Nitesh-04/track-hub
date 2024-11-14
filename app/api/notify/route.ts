import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEventReminder } from '@/utils/email';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await fetchAndNotify(24 * 60); // 24-hour reminders

  return NextResponse.json({ message: '24-hour notifications sent' });
}

async function fetchAndNotify(timeDifferenceMinutes: number) {
  const now = new Date();
  const targetTime = new Date(now.getTime() + timeDifferenceMinutes * 60 * 1000);
  const bufferTime = 5 * 60 * 1000; // 5-minute buffer

  const upcomingEvents = await prisma.round.findMany({
    where: {
      roundDateTime: {
        gte: new Date(targetTime.getTime() - bufferTime),
        lte: new Date(targetTime.getTime() + bufferTime),
      },
    },
    include: {
        user: {
            select: {
            email: true,
            },
        },
        application: true,
        },
  });

  for (const round of upcomingEvents) {
    if(round.application.notifications==true)
      {
        const subject = round.application.companyName + " - " + round.roundTitle;
        await sendEventReminder(round.user.email, subject , round.roundDateTime, round.venue, round.roundLink ?? '');
      }
  }
}