
'use client';

import Link from 'next/link';
import { usePathname, redirect } from 'next/navigation';
import {
  Calendar,
  FileText,
  Home,
  Newspaper,
  Users,
  Trophy,
  Image as ImageIcon,
  Loader2,
  Building,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Separator } from '@/components/ui/separator';
import { HorseIcon } from '@/components/icons/horse-icon';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';
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
    SidebarInset,
    SidebarGroup,
    SidebarGroupLabel
} from '@/components/ui/sidebar';
import { HorseLogo } from '@/components/icons/horse-logo';

function AdminLayoutSkeleton() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg font-semibold text-muted-foreground">Зареждане на панела...</span>
        </div>
    </div>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { text } = useLanguage();
  const { isAdmin, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !isAdmin) {
      redirect('/');
    }
  }, [isAdmin, loading]);

  if (loading) {
    return <AdminLayoutSkeleton />;
  }

  if (!isAdmin) {
      return null;
  }

  const mainNavItems = [
    { href: '/admin', label: 'Табло', icon: <Home /> },
    { href: '/admin/submissions', label: 'Заявки', icon: <Mail /> },
    { href: '/admin/calendar', label: 'Календар', icon: <Calendar /> },
    { href: '/admin/news', label: 'Новини', icon: <Newspaper /> },
    { href: '/admin/results', label: 'Резултати', icon: <Trophy /> },
    { href: '/admin/documents', label: 'Документи', icon: <FileText /> },
    { href: '/admin/gallery', label: 'Галерия', icon: <ImageIcon /> },
  ];

  const managementNavItems = [
     { href: '/admin/jockeys', label: 'Жокеи', icon: <Users /> },
     { href: '/admin/trainers', label: 'Треньори', icon: <Users /> },
     { href: '/admin/horses', label: 'Коне', icon: <HorseIcon /> },
     { href: '/admin/partners', label: 'Партньори', icon: <Building /> },
  ];
  
  const settingsNavItems = [
      { href: '/admin/content', label: 'Съдържание', icon: <Settings /> },
  ];

  const isActive = (href: string) => {
    return href === '/admin' ? pathname === href : pathname.startsWith(href);
  }

  return (
    <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <HorseLogo className="h-8 w-8 text-primary" />
                    <span className="text-lg font-semibold">Админ</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                     <SidebarGroup>
                        <SidebarGroupLabel>Основно</SidebarGroupLabel>
                         <SidebarGroupContent>
                            {mainNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <SidebarMenuButton tooltip={item.label} isActive={isActive(item.href)}>
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                        <SidebarGroupLabel>Управление</SidebarGroupLabel>
                         <SidebarGroupContent>
                            {managementNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <SidebarMenuButton tooltip={item.label} isActive={isActive(item.href)}>
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                     <SidebarGroup>
                        <SidebarGroupLabel>Настройки</SidebarGroupLabel>
                         <SidebarGroupContent>
                            {settingsNavItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <SidebarMenuButton tooltip={item.label} isActive={isActive(item.href)}>
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarMenu>
            </SidebarContent>
             <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                         <Link href="/" legacyBehavior passHref>
                            <SidebarMenuButton tooltip="Към сайта">
                                <ExternalLink />
                                <span>Към сайта</span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
         <SidebarInset>
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
                <SidebarTrigger className="md:hidden" />
                 <h1 className="text-xl font-semibold">
                    {mainNavItems.find(item => isActive(item.href))?.label || 
                     managementNavItems.find(item => isActive(item.href))?.label ||
                     settingsNavItems.find(item => isActive(item.href))?.label ||
                     'Табло'}
                 </h1>
            </header>
            <main className="flex-1 p-4 sm:px-6 sm:py-4">{children}</main>
        </SidebarInset>
    </SidebarProvider>
  );
}
