
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ContactSubmission } from '@/lib/types';
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
}

export async function deleteContactSubmission(id: number): Promise<{ success: boolean; message: string }> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }
    const supabase = createServerClient();

    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) {
        console.error('Error deleting contact submission:', error);
        return { success: false, message: error.message };
    }

    revalidatePath('/admin/contacts');
    return { success: true, message: 'Запитването е изтрито успешно.' };
}

export async function updateContactStatus(id: number, status: ContactSubmission['status']) {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { message: error.message };
    }
    const supabase = createServerClient();
    
    const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error(`Error updating contact submission ${id} to status ${status}:`, error);
        return { message: error.message };
    }
    
    revalidatePath('/admin/contacts');
}


const SendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1, "Темата е задължителна."),
  message: z.string().min(1, "Съобщението е задължително."),
  submissionId: z.coerce.number(),
});


export async function sendEmailReply(prevState: any, formData: FormData): Promise<{success: boolean, message: string}> {
    try {
        await checkAdmin();
    } catch (error: any) {
        return { success: false, message: error.message };
    }

    const validatedFields = SendEmailSchema.safeParse({
        to: formData.get('to'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        submissionId: formData.get('submissionId'),
    });

    if (!validatedFields.success) {
        const error = validatedFields.error.flatten().fieldErrors;
        const errorMessage = Object.values(error).map(e => e.join(' ')).join(' ');
        return { success: false, message: errorMessage || 'Моля, попълнете всички полета.' };
    }

    const { to, subject, message, submissionId } = validatedFields.data;
    
    const siteLogoUrl = await getSiteContent('site_logo_url', 'bg'); // get bg version as default

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

        // After successfully sending, update the submission status
        await updateContactStatus(submissionId, 'answered');

        revalidatePath('/admin/contacts');
        return { success: true, message: "Отговорът е изпратен успешно!" };
    } catch (error: any) {
        console.error("Failed to send email:", error);
        return { success: false, message: `Възникна грешка при изпращане: ${error.message}` };
    }
}
