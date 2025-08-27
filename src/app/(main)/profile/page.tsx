
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { PageHeader } from '@/components/page-header';
import { ProfileForm } from './components/profile-form';

export default async function ProfilePage() {
  const { supabase } = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 means no rows found, which is a valid case for new users.
    // We only want to log other, unexpected errors.
    // console.error('Error fetching profile:', error);
  }
  
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Вашият профил"
        description="Преглеждайте и актуализирайте информацията за вашия профил."
      />
      <div className="mt-8">
        <ProfileForm profile={profile} user={user} />
      </div>
    </div>
  );
}
