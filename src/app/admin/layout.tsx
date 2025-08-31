
'use server';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Calendar,
  FileText,
  Home,
  Newspaper,
  Users,
  Trophy,
  Image as ImageIcon,
  Building,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Search,
  Bell,
  Share2,
  Contact,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent
} from '@/components/ui/sidebar';
import { HorseLogo } from '@/components/icons/horse-logo';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createServerClient } from '@/lib/supabase/server';
import AdminLayoutClient from './_components/admin-layout-client';
import type { User } from '@supabase/supabase-js';


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
      <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
  );
}
