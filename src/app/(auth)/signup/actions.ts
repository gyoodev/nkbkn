
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { EmailTemplate } from '@/lib/email-template';
import * as nodemailer from 'nodemailer';
import { getSiteContent } from '@/lib/server/data';
import dotenv from 'dotenv';

dotenv.config();


async function sendConfirmationEmail(email: string, confirmationLink: string) {
    const siteLogoUrl = await getSiteContent('site_logo_url', 'bg');

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT || 465),
        secure: true,
        auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASS,
        },
        tls: {
            minVersion: 'TLSv1.2',
        }
    });

    const emailHtml = EmailTemplate({
        title: 'Потвърдете вашата регистрация',
        content: `Благодарим ви за регистрацията! Моля, кликнете върху линка по-долу, за да потвърдите вашия имейл адрес: <br/><br/><a href="${confirmationLink}" style="color: #042f2e; text-decoration: underline;">Потвърди имейл</a>`,
        siteName: 'НКБКН',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nkbkn.bg',
        logoUrl: siteLogoUrl
    });

    try {
        await transporter.sendMail({
            from: `НКБКН <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Потвърдете вашата регистрация в НКБКН',
            html: emailHtml,
        });
        return { success: true };
    } catch (error: any) {
        console.error("Failed to send confirmation email:", error);
        return { success: false, error: `Възникна грешка при изпращане на имейла за потвърждение: ${error.message}` };
    }
}


export async function signup(prevState: { error?: string, message?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;
  const username = formData.get('username') as string;
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // First, sign up the user in the auth schema
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
            phone: phone,
            email: email,
            username: username,
        }
    }
  });

  if (authError) {
    return {
        error: authError.message,
    };
  }
  
  // If signUp is successful, authData should contain a user object.
  // We need to handle the case where user might be null, or if the user
  // already exists but is not confirmed.
  if (authData.user) {
    // Case 1: User already exists but is not confirmed. 
    // `identities` will be an empty array.
    if (authData.user.identities && authData.user.identities.length === 0) {
        return {
            message: 'Потребител с този имейл вече съществува, но не е потвърден. Моля, проверете имейла си за линк за потвърждение.',
        };
    }
    
    // Case 2: This is a new user, create their profile.
    const { error: rpcError } = await supabase.rpc('create_user_profile', {
        user_id: authData.user.id,
        email: email,
        phone: phone,
        username: username,
    });
    
    if(rpcError) {
        // Log the error but don't block the user from signing up.
        // The important part is that the auth user is created.
        console.error('Error creating profile via RPC:', rpcError.message);
        // Even with an error, the confirmation email should be sent.
    }
    
    // For a new user, identities will not be empty.
    return {
        message: 'Успешна регистрация! Моля, проверете имейла си за линк за потвърждение.',
    }
  }

  return {
    error: 'Възникна неочаквана грешка по време на регистрацията. Моля, опитайте отново.',
  }
}
