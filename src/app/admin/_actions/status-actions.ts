
'use server';

import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import type { SmtpStatus } from '@/lib/types';

dotenv.config();

const primaryConfig = {
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

const fallbackConfig = {
    host: process.env.SMTP_SERVER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_SERVER_USER,
        pass: process.env.SMTP_SERVER_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
};


export async function checkSmtpStatus(): Promise<SmtpStatus> {
    
    // Първи опит с основната конфигурация
    try {
        const primaryTransporter = nodemailer.createTransport(primaryConfig);
        await primaryTransporter.verify();
        return { success: true, message: `Връзката с SMTP сървъра на порт ${primaryConfig.port} е успешна.` };
    } catch (primaryError: any) {
        console.error(`SMTP Verification Error on port ${primaryConfig.port}:`, primaryError.message);

        // Ако първият опит е бил с порт 465, опитай с резервния
        if (primaryConfig.port === 465) {
            try {
                const fallbackTransporter = nodemailer.createTransport(fallbackConfig);
                await fallbackTransporter.verify();
                return { success: true, message: `Връзката с SMTP сървъра на порт ${fallbackConfig.port} е успешна (fallback).` };
            } catch (fallbackError: any) {
                console.error(`SMTP Verification Error on fallback port ${fallbackConfig.port}:`, fallbackError.message);
                return { success: false, message: `Основна грешка (465): ${primaryError.message}\nРезервна грешка (587): ${fallbackError.message}` };
            }
        }
        
        // Ако основният порт не е 465, просто върни неговата грешка
        return { success: false, message: `Грешка при връзка на порт ${primaryConfig.port}: ${primaryError.message}` };
    }
}
