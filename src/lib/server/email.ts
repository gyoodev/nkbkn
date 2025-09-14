
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
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 465),
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASS,
        },
        tls: {
            // do not fail on invalid certs
            minVersion: 'TLSv1.2',
        },
    });

    const mailOptions = {
        from: `НКБКН <${process.env.EMAIL_FROM}>`,
        to,
        subject,
        html,
    };

    await transporter.sendMail(mailOptions);
}
