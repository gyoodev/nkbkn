
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { createBrowserClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';


export default function AdminLayoutClient({ children, user }: { children: React.ReactNode, user: User | null }) {
  const pathname = usePathname();
  
  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const mainNavItems = [
    { href: '/admin', label: 'Табло', icon: <Home /> },
    { href: '/admin/submissions', label: 'Заявки', icon: <Mail /> },
    { href: '/admin/contacts', label: 'Контакти', icon: <Contact /> },
    { href: '/admin/calendar', label: 'Календар', icon: <Calendar /> },
    { href: '/admin/news', label: 'Новини', icon: <Newspaper /> },
    { href: '/admin/results', label: 'Резултати', icon: <Trophy /> },
    { href: '/admin/documents', label: 'Документи', icon: <FileText /> },
    { href: '/admin/gallery', label: 'Галерия', icon: <ImageIcon /> },
  ];

  const managementNavItems = [
     { href: '/admin/jockeys', label: 'Жокеи', icon: <Users /> },
     { href: '/admin/trainers', label: 'Треньори', icon: <Users /> },
     { href: '/admin/horses', label: 'Коне', icon: <HorseLogo /> },
     { href: '/admin/partners', label: 'Партньори', icon: <Building /> },
  ];
  
  const settingsNavItems = [
      { href: '/admin/content', label: 'Съдържание', icon: <Settings /> },
      { href: '/admin/socials', label: 'Социални мрежи', icon: <Share2 /> },
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
                    <span className="text-lg font-semibold">НКБКН Админ</span>
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
         <div className="flex flex-col w-full min-h-screen">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <SidebarTrigger className="md:hidden" />
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Търсене..."
                            className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-muted/50"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                     <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Известия</span>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={user?.user_metadata.avatar_url} alt={user?.email} />
                                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild><Link href="/profile">Профил</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>Изход</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex-1 overflow-x-auto bg-muted/40">
                <div className="p-4 sm:p-6 lg:p-8">
                {children}
                </div>
            </main>
        </div>
      </SidebarProvider>
  )
}
