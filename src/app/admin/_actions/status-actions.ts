
'use server';

import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import type { SmtpStatus } from '@/lib/types';

dotenv.config();

export async function checkSmtpStatus(): Promise<SmtpStatus> {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER_HOST,
        port: Number(process.env.SMTP_SERVER_PORT || 465),
        secure: true,
        auth: {
            user: process.env.SMTP_SERVER_USER,
            pass: process.env.SMTP_SERVER_PASS,
        },
        tls: {
            // do not fail on invalid certs
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
