import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendEventReminder } from '@/utils/email';

const prisma = new PrismaClient();

function getISTDate(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
}

export async function GET(request: Request) {
  if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const now = getISTDate(new Date());
  
  const targetTime = new Date(now);
  targetTime.setHours(targetTime.getHours() + 24);

  await fetchAndNotify(now, targetTime);

  return NextResponse.json({ message: 'Notifications sent' });
}

async function fetchAndNotify(now: Date, targetTime: Date) {
  const upcomingEvents = await prisma.round.findMany({
    where: {
      roundDateTime: {
        gte: now,
        lte: targetTime,
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
      try {
        const subject = `${round.application.companyName} - ${round.roundTitle}`;
        
        await sendEventReminder(
          round.user.email, 
          subject, 
          round.roundDateTime,  
          round.venue, 
          round.roundLink ?? ''
        );

      } catch (error) {
        console.error(`Failed to send notification for round ${round.id}:`, error);
      }
    }
  }
  console.log(` ${upcomingEvents.length} Notifications sent`);
}