import nodemailer from "nodemailer";

const smtpConfig = {
    host: process.env.MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    logger: true,
    debug: true,
};

type EmailConfig = {
  to: string;
  subject: string;
  htmlContent: string;
};

export async function sendEmail(data: EmailConfig) {
  try {
    const transporter  = nodemailer.createTransport(
      {
        ...smtpConfig
      });

    return await transporter.sendMail(
      {
        from: process.env.EMAIL_USER,
        to: data.to,
        subject: data.subject,
        html: data.htmlContent,
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}