
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import * as nodemailer from 'nodemailer';
import { EmailTemplate } from '@/lib/email-template';
import { getSiteContent } from '@/lib/server/data';
import dotenv from 'dotenv';

dotenv.config();


async function checkAdmin() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Authentication required');

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error('Administrator privileges required');
    return user;
}


export async function updateUserRole(userId: string, role: 'admin' | 'user'): Promise<{ error: string | null }> {
    try {
        await checkAdmin();
    } catch(e: any) {
        return { error: e.message };
    }

    const supabase = createServerClient();

    const { error } = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', userId);

    if (error) {
        console.error(`Error updating role for user ${userId}:`, error);
        return { error: 'Възникна грешка при промяната на ролята.' };
    }
    
    revalidatePath('/admin/users');
    return { error: null };
}


const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1, "Темата е задължителна."),
  message: z.string().min(1, "Съобщението е задължително."),
});


export async function sendEmailToUser(prevState: any, formData: FormData): Promise<{success: boolean, message: string}> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    const validatedFields = SendEmailSchema.safeParse({
        to: formData.get('to'),
        subject: formData.get('subject'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const errorMessage = Object.values(error).map(e => e.join(' ')).join(' ');
        return { success: false, message: errorMessage || 'Моля, попълнете всички полета.' };
    }

    const { to, subject, message } = validatedFields.data;
    
    const siteLogoUrl = await getSiteContent('site_logo_url', 'bg');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 465),
        secure: true, // true for 465
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASS,
        },
        tls: {
            minVersion: 'TLSv1.2',
        }
    });

    const emailHtml = EmailTemplate({
        title: subject,
        content: message,
        siteName: 'НКБКН',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nkbkn.bg',
        logoUrl: siteLogoUrl
    });

    try {
        await transporter.sendMail({
            from: `НКБКН <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html: emailHtml,
        });

        return { success: true, message: "Съобщението е изпратено успешно!" };
    } catch (error: any) {
        console.error("Failed to send email:", error);
        return { success: false, message: `Възникна грешка при изпращане: ${error.message}` };
    }
}
