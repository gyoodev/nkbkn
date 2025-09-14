
'use server';

import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import type { SmtpStatus } from '@/lib/types';

dotenv.config();

export async function checkSmtpStatus(): Promise<SmtpStatus> {
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

    try {
        const transporter = nodemailer.createTransport(config);
        await transporter.verify();
        return { success: true, message: `Връзката с SMTP сървъра на порт ${config.port} е успешна.` };
    } catch (error: any) {
        console.error(`SMTP Verification Error on port ${config.port}:`, error.message);
        return { success: false, message: `Грешка при връзка на порт ${config.port}: ${error.message}` };
    }
}
