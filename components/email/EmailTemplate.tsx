interface EmailTemplateProps {
  subject: string;
  roundDateTime: Date;
  roundVenue: string;
  roundLink: string;
}

const EmailTemplate = ({ subject, roundDateTime, roundVenue, roundLink }: EmailTemplateProps) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>TrackHub: Application Round Reminder</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #333;
            font-size: 24px;
            text-align: center;
          }
          p {
            color: #555;
            font-size: 16px;
          }
          .highlight {
            color: #0073e6;
            font-weight: bold;
          }
          .info-section {
            margin-top: 20px;
            padding: 10px;
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            margin-bottom: 20px;
          }
          .info-section p {
            margin: 5px 0;
          }
          .footer {
            font-size: 14px;
            color: #888;
            text-align: center;
          }
          .link {
            color: #0073e6;
            text-decoration: none;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <p>Hi there,</p>
          <p>
            Just a quick reminder that your round <span class="highlight">${subject}</span> is approaching.
          </p>
          <div class="info-section">
            <p><span class="highlight">Date and Time:</span> ${roundDateTime.toLocaleString()}</p>
            <p><span class="highlight">Venue:</span> ${roundVenue}</p>
            <p><span class="highlight">Link:</span> <a href="${roundLink}" class="link">Click here</a></p>
          </div>
          <div class="footer">
            <p>
              Best of Luck<br />
              TrackHub
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export default EmailTemplate;