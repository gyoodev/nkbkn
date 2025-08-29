
'use server';

import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ApplicationSchema = z.object({
  type: z.enum(['Жокей', 'Треньор', 'Кон', 'Собственик']),
  // Common fields
  email: z.string().email("Моля, въведете валиден имейл."),
  phone: z.string().min(5, "Моля, въведете валиден телефонен номер."),

  // Jockey/Trainer/Owner fields
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  egn: z.string().optional(),
  address: z.string().optional(),

  // Trainer specific
  horse_count: z.coerce.number().optional(),
  
  // Horse specific
  horse_name: z.string().optional(),
  age: z.coerce.number().optional(),
  sire: z.string().optional(),
  dam: z.string().optional(),
  owner: z.string().optional(),
  mounts: z.coerce.number().optional(),
  wins: z.coerce.number().optional(),
});


type State = {
    success: boolean;
    message: string;
}

export async function submitApplication(prevState: State, formData: FormData): Promise<State> {
    const supabase = createServerClient();

    const formType = formData.get('type');
    let dataToValidate: { [key: string]: any } = {
        type: formType,
        email: formData.get('email'),
        phone: formData.get('phone'),
    };

    switch(formType) {
        case 'Жокей':
            dataToValidate = {
                ...dataToValidate,
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                date_of_birth: formData.get('date_of_birth'),
                egn: formData.get('egn'),
                address: formData.get('address'),
                wins: formData.get('wins'),
            };
            break;
        case 'Собственик':
            dataToValidate = {
                ...dataToValidate,
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                date_of_birth: formData.get('date_of_birth'),
                egn: formData.get('egn'),
                address: formData.get('address'),
            };
            break;
        case 'Треньор':
             dataToValidate = {
                ...dataToValidate,
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                date_of_birth: formData.get('date_of_birth'),
                egn: formData.get('egn'),
                address: formData.get('address'),
                wins: formData.get('wins'),
                horse_count: formData.get('horse_count'),
            };
            break;
        case 'Кон':
             dataToValidate = {
                ...dataToValidate,
                horse_name: formData.get('horse_name'),
                age: formData.get('age'),
                sire: formData.get('sire'),
                dam: formData.get('dam'),
                owner: formData.get('owner'),
                mounts: formData.get('mounts'),
                wins: formData.get('wins'),
            };
            break;
        default:
             return { success: false, message: "Невалиден тип на формуляра." };
    }

    const validatedFields = ApplicationSchema.safeParse(dataToValidate);

    if (!validatedFields.success) {
        const errorMessage = Object.values(validatedFields.error.flatten().fieldErrors).map(e => e.join(' ')).join(' ');
        return { success: false, message: errorMessage || "Моля, поправете грешките във формата." };
    }
    
    const nameForDb = formType === 'Кон' 
        ? validatedFields.data.horse_name 
        : `${validatedFields.data.first_name} ${validatedFields.data.last_name}`;

    const { error } = await supabase
        .from('submissions')
        .insert({
            ...validatedFields.data,
            name: nameForDb,
            status: 'new'
        });


    if (error) {
        console.error("Submission error:", error);
        return { success: false, message: "Възникна грешка при изпращането на заявката. Моля, опитайте отново." };
    }

    revalidatePath('/admin/submissions');

    return { success: true, message: "Вашата заявка беше изпратена успешно! Ще се свържем с вас скоро." };
}
