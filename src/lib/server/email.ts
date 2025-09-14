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
    const config = {
        host: process.env.SMTP_SERVER_HOST,
        port: Number(process.env.SMTP_SERVER_PORT || 465),
        secure: Number(process.env.SMTP_SERVER_PORT || 465) === 465,
        auth: {
            user: process.env.SMTP_SERVER_USER,
            pass: process.env.SMTP_SERVER_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        },
    };

    const transporter = nodemailer.createTransport(config);
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_SENDER_EMAIL;

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error(`❌ Send failed on port ${config.port}:`, error);
        throw error;
    }
}
