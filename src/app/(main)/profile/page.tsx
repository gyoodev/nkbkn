
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

  if (error || !profile) {
    // This could happen if the profile wasn't created for some reason.
    // You might want to handle this case more gracefully.
    console.error('Error fetching profile:', error);
    // Maybe redirect to an error page or show a message.
  }
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
