
'use server';

import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    const port = Number(process.env.SMTP_SERVER_PORT || 465);
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER_HOST,
        port: port,
        secure: port === 465, // true for 465, false for other ports
        ignoreTLS: true,
        auth: {
            user: process.env.SMTP_SERVER_USER,
            pass: process.env.SMTP_SERVER_PASS,
        },
        tls: {
            rejectUnauthorized: false
        },
    });

    const mailOptions = {
        from: `НКБКН <${process.env.SMTP_SENDER_EMAIL}>`,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}
