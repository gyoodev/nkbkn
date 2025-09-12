
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const SocialLinkSchema = z.object({
  id: z.coerce.number(),
  url: z.union([z.string().url('Моля, въведете валиден URL адрес.'), z.literal('')]),
});

const AllSocialsSchema = z.array(SocialLinkSchema);

type State = {
  success: boolean;
  message: string;
};

async function checkAdmin() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Authentication required');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'admin')
    throw new Error('Administrator privileges required');
}

export async function updateSocialLinks(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    await checkAdmin();
  } catch (error: any) {
    return { success: false, message: error.message };
  }

  const supabase = createServerClient();
  const entries = Array.from(formData.entries());

  const linksToUpdate = entries.map(([key, value]) => ({
    id: parseInt(key.replace('social-', '')),
    url: value as string,
  }));
  
  const validatedFields = AllSocialsSchema.safeParse(linksToUpdate);
  
  if (!validatedFields.success) {
      console.error(validatedFields.error);
      return { success: false, message: 'Възникна грешка при валидацията на данните.' };
  }

  const upsertPromises = validatedFields.data.map((link) =>
    supabase.from('social_links').update({ url: link.url || '' }).eq('id', link.id)
  );

  const results = await Promise.all(upsertPromises);
  const hasError = results.some((res) => res.error);

  if (hasError) {
    console.error('Error updating social links:', results.map(r => r.error).filter(Boolean));
    return { success: false, message: 'Възникна грешка при запазването на линковете.' };
  }
  
  revalidatePath('/(main)', 'layout'); // Revalidate all public pages to update footer/header
  revalidatePath('/admin/socials');

  return { success: true, message: 'Социалните мрежи бяха актуализирани успешно!' };
}
