
// This is the SERVER-ONLY layout component for the (main) group.

import { createServerClient } from '@/lib/supabase/server';
import type { Partner, SocialLink } from '@/lib/types';
import type { Session } from '@supabase/supabase-js';
import { MainLayoutClient } from './components/main-layout-client';

// Server Component Wrapper that fetches data and renders the client component
export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  
  // Fetch all data in parallel
  const { data: { session } } = await supabase.auth.getSession();
  
  let isAdmin = false;
  if (session?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    isAdmin = profile?.role === 'admin';
  }

  const { data: socialData } = await supabase.from('social_links').select('*').order('id');
  const { data: partnerData } = await supabase.from('partners').select('*').order('created_at');

  return (
      <MainLayoutClient 
        socials={socialData || []} 
        partners={partnerData || []}
        session={session}
        isAdmin={isAdmin}
      >
          {children}
      </MainLayoutClient>
  )
}
