import EmailTemplate from '@/components/email/EmailTemplate';
import { sendEmail } from './mailer';

export async function sendEventReminder(
  userEmail: string, 
  subject: string, 
  roundDateTime: Date,
  roundVenue: string, 
  roundLink: string
) {
  const emailContent = EmailTemplate({ 
    subject, 
    roundDateTime, 
    roundVenue, 
    roundLink
  });

  await sendEmail({
    to: userEmail,
    subject: `TrackHub : Upcoming Round: ${subject}`,
    htmlContent: emailContent,
  });
}