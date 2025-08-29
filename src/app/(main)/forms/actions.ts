
'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ApplicationSchema = z.object({
  type: z.enum(['Жокей', 'Треньор', 'Кон']),
  name: z.string().min(2, "Името трябва да е поне 2 символа."),
  email: z.string().email("Моля, въведете валиден имейл."),
  phone: z.string().min(5, "Моля, въведете валиден телефонен номер."),
  message: z.string().optional(),
});


type State = {
    success: boolean;
    message: string;
}

export async function submitApplication(prevState: State, formData: FormData): Promise<State> {
    const supabase = createServerClient();

    const validatedFields = ApplicationSchema.safeParse({
        type: formData.get('type'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
    });

    if (!validatedFields.success) {
        // Concatenate all errors into a single message
        const errorMessage = validatedFields.error.errors.map(e => e.message).join(' ');
        return { success: false, message: errorMessage || "Моля, поправете грешките във формата." };
    }
    
    const { type, name, email, phone, message } = validatedFields.data;

    const { error } = await supabase
        .from('submissions')
        .insert({
            type,
            name,
            email,
            phone,
            message,
            status: 'new'
        });

    if (error) {
        console.error("Submission error:", error);
        return { success: false, message: "Възникна грешка при изпращането на заявката. Моля, опитайте отново." };
    }

    revalidatePath('/admin/submissions');

    return { success: true, message: "Вашата заявка беше изпратена успешно! Ще се свържем с вас скоро." };
}
