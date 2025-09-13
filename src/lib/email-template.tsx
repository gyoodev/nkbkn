
import * as React from 'react';

interface EmailTemplateProps {
  title: string;
  content: string;
  siteName: string;
  siteUrl: string;
  logoUrl?: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  title,
  content,
  siteName,
  siteUrl,
  logoUrl,
}) => (
  `<!DOCTYPE html>
<html lang="bg">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; margin: 0; padding: 0; background-color: #f4f4f7; color: #333; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
    .header { background-color: #006837; color: #ffffff; padding: 20px; text-align: center; }
    .header img { max-width: 150px; margin-bottom: 10px; }
    .header h1 { margin: 0; font-size: 24px; color: #ffffff !important; }
    .content { padding: 30px; line-height: 1.6; }
    .content h2 { color: #006837; font-size: 20px; }
    .content p { margin: 0 0 15px; }
    .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
    .footer a { color: #006837; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      ${logoUrl ? `<a href="${siteUrl}"><img src="${logoUrl}" alt="${siteName} Logo"></a>` : ''}
      <h1>${siteName}</h1>
    </div>
    <div class="content">
      <h2>${title}</h2>
      <div>${content}</div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${siteName}. Всички права запазени.<br>
      <a href="${siteUrl}">${siteUrl}</a>
    </div>
  </div>
</body>
</html>`
);
