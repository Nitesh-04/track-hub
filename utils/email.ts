import { sendEmail } from './mailer';
import EmailTemplate from '@/components/email/EmailTemplate';

export async function sendEventReminder(userEmail: string, subject: string, roundDateTime: Date,roundVenue:string, roundLink:string) {
  const emailContent = await EmailTemplate({ subject, roundDateTime, roundVenue, roundLink}) as string;

  await sendEmail(
    userEmail,
    `TrackHub : Upcoming Round: ${subject}`,
    emailContent
  );
}