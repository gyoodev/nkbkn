
'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(2, "Името трябва да е поне 2 символа."),
  email: z.string().email("Моля, въведете валиден имейл."),
  message: z.string().min(10, "Съобщението трябва да е поне 10 символа."),
});

type State = {
    success: boolean;
    message: string;
}

export async function submitContactForm(prevState: State, formData: FormData): Promise<State> {
    const supabase = createServerClient();

    const validatedFields = ContactSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        const errorMessage = Object.values(validatedFields.error.flatten().fieldErrors).map(e => e.join(' ')).join(' ');
        return { success: false, message: errorMessage || "Моля, поправете грешките във формата." };
    }
    
    const { name, email, message } = validatedFields.data;

    const { error } = await supabase
        .from('contact_submissions')
        .insert({ name, email, message, status: 'pending' });

    if (error) {
        console.error("Contact form submission error:", error);
        return { success: false, message: "Възникна грешка при изпращането на съобщението. Моля, опитайте отново." };
    }

    revalidatePath('/admin/contacts');

    return { success: true, message: "Вашето съобщение беше изпратено успешно! Ще се свържем с вас скоро." };
}
