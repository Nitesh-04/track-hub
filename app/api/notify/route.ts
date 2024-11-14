import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEventReminder } from '@/utils/email';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const targetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); 

  await fetchAndNotify(now,targetTime);

  return NextResponse.json({ message: '24-hour notifications sent' });
}

async function fetchAndNotify(now:Date,targetTime: Date) {
  const upcomingEvents = await prisma.round.findMany({
    where: {
      roundDateTime: {
        gte: new Date(now.getTime()),
        lte: new Date(targetTime.getTime()),
      },
    },
    include: {
      user: {
        select: { email: true },
      },
      application: true,
    },
  });

  for (const round of upcomingEvents) {
    if (round.application.notifications === true) {
      const subject = `${round.application.companyName} - ${round.roundTitle}`;
      await sendEventReminder(round.user.email, subject, round.roundDateTime, round.venue, round.roundLink ?? '');
    }
  }
}
