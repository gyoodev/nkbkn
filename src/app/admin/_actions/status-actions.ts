
'use server';

import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import type { SmtpStatus } from '@/lib/types';

dotenv.config();

export async function checkSmtpStatus(): Promise<SmtpStatus> {
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

    try {
        await transporter.verify();
        return { success: true, message: 'Връзката с SMTP сървъра е успешна.' };
    } catch (error: any) {
        console.error("SMTP Verification Error:", error);
        return { success: false, message: `Грешка при връзка: ${error.message}` };
    }
}
