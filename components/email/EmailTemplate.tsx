import React from 'react';

interface EmailTemplateProps {
  subject: string;
  roundDateTime: Date;
  roundVenue: string;
  roundLink: string;
}

const EmailTemplate: React.FC<EmailTemplateProps> = ({ subject, roundDateTime, roundVenue, roundLink }) => {
  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
        <title>TrackHub: Application Round Reminder</title>
        <style>
          {`
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
          `}
        </style>
      </head>
      <body>
        <div className="container">
          <p>Hi there,</p>
          <p>
            Just a quick reminder that the application round <span className="highlight">{subject}</span> is approaching.
          </p>
          <div className="info-section">
            <p><span className="highlight">Date and Time:</span> {roundDateTime.toLocaleString()}</p>
            <p><span className="highlight">Venue:</span> {roundVenue}</p>
            <p><span className="highlight">Link:</span> <a href={roundLink} className="link">Apply Here</a></p>
          </div>
          <div className="footer">
            <p>
              Best of Luck<br />
            </p>
          </div>
        </div>
      </body>
    </html>
  );
};

export default EmailTemplate;
