
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './_components/admin-layout-client';
import { PrintProvider } from '../print/page';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
      return redirect('/');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
      return redirect('/');
  }

  return (
    <PrintProvider>
        <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
    </PrintProvider>
  );
}
