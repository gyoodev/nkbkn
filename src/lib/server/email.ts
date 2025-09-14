'use server';

import * as nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

// Конфигурация за основния порт (SSL/TLS)
const primaryConfig = {
    host: process.env.SMTP_SERVER_HOST,
    port: Number(process.env.SMTP_SERVER_PORT || 465),
    secure: Number(process.env.SMTP_SERVER_PORT || 465) === 465,
    auth: {
        user: process.env.SMTP_SERVER_USER,
        pass: process.env.SMTP_SERVER_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
};

// Конфигурация за резервния порт (STARTTLS)
const fallbackConfig = {
    host: process.env.SMTP_SERVER_HOST,
    port: 587,
    secure: false, // false for STARTTLS
    auth: {
        user: process.env.SMTP_SERVER_USER,
        pass: process.env.SMTP_SERVER_PASS,
    },
    tls: {
        rejectUnauthorized: false
    },
};


export async function sendEmail({ to, subject, html }: SendEmailParams) {
    let transporter = nodemailer.createTransport(primaryConfig);
    const fromAddress = process.env.SMTP_FROM || process.env.SMTP_SENDER_EMAIL;

    try {
        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject,
            html,
        });
        console.log("✅ Email sent via primary config:", info.messageId);
        return info;
    } catch (error) {
        console.error(`❌ Send failed on port ${primaryConfig.port}:`, error);

        // Ако първият опит е бил с основния порт (465) и е неуспешен, опитай с резервния
        if (primaryConfig.port === 465) {
            console.log("🔄 Retrying with port 587 (STARTTLS)...");
            transporter = nodemailer.createTransport(fallbackConfig);
            
            try {
                const fallbackInfo = await transporter.sendMail({
                    from: fromAddress,
                    to,
                    subject,
                    html,
                });
                console.log("✅ Email sent via fallback config (port 587):", fallbackInfo.messageId);
                return fallbackInfo;
            } catch (fallbackError) {
                 console.error(`❌ Fallback send failed on port 587:`, fallbackError);
                 throw fallbackError; // Хвърли грешката от втория опит
            }
        }

        throw error; // Хвърли оригиналната грешка, ако основният порт не е 465
    }
}
