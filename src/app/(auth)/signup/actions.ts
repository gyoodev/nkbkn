'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { sendEmail } from '@/lib/server/email';
import { EmailTemplate } from '@/lib/email-template';
import { getSiteContent } from '@/lib/server/data';

const SignupSchema = z.object({
  email: z.string().email({ message: 'Моля, въведете валиден имейл.' }),
  password: z.string().min(6, { message: 'Паролата трябва да е поне 6 символа.' }),
  phone: z.string().min(5, { message: 'Моля, въведете валиден телефонен номер.' }),
  username: z.string().min(3, { message: 'Потребителското име трябва да е поне 3 символа.' }),
});

async function sendWelcomeEmail(to: string, name: string) {
    const siteLogoUrl = await getSiteContent('site_logo_url', 'bg');
    
    const emailHtml = EmailTemplate({
        title: 'Добре дошли в НКБКН!',
        content: `Здравейте, ${name}!<br><br>Благодарим ви за регистрацията в сайта на Националната комисия за Български конни надбягвания. Вашият акаунт е успешно създаден и вече можете да използвате всички функционалности на платформата.<br><br>Поздрави,<br>Екипът на НКБКН`,
        siteName: 'НКБКН',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://nkbkn.bg',
        logoUrl: siteLogoUrl
    });

    try {
        await sendEmail({
            to,
            subject: 'Добре дошли в НКБКН!',
            html: emailHtml,
        });
    } catch (error) {
        console.error("Welcome email could not be sent:", error);
        // We don't block the user flow if the welcome email fails.
    }
}


export async function signup(prevState: { error?: string } | undefined, formData: FormData) {
  const supabase = createServerClient();
  
  const validatedFields = SignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    username: formData.get('username'),
  });

  if (!validatedFields.success) {
    const errorMessage = Object.values(validatedFields.error.flatten().fieldErrors).map(e => e.join(' ')).join(' ');
    return {
      error: errorMessage || "Моля, поправете грешките във формата.",
    };
  }

  const { email, password, phone, username } = validatedFields.data;
  
  // Attempt to sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            phone: phone,
            username: username,
            full_name: username,
        }
    }
  });

  if (authError) {
    if (authError.message.includes('User already registered')) {
        return {
            error: 'Потребител с този имейл вече съществува. Моля, опитайте да влезете в системата.',
        };
    }
    return {
        error: authError.message,
    };
  }
  
  if (!authData.user) {
      return { error: 'Неуспешно създаване на потребител. Моля, опитайте отново.' };
  }

  // Create a profile for the new user.
  const { error: rpcError } = await supabase.rpc('create_user_profile', {
      p_user_id: authData.user.id,
      p_email: email,
      p_phone: phone,
      p_username: username,
  });

  if (rpcError) {
      console.error('Error creating profile via RPC after signup:', rpcError.message);
      // Even if profile creation fails, we can still proceed. The user exists.
  }

  // Send a welcome email asynchronously. No need to await it.
  sendWelcomeEmail(email, username);
  
  // Since we are not requiring confirmation, we can redirect directly to the profile page.
  redirect('/profile');
}
