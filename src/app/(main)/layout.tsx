'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Shield,
  Users,
  User,
  MapPin,
  Image as ImageIcon,
  Wand2,
  Mail,
  Home,
} from 'lucide-react';
import { HorseLogo } from '@/components/icons/horse-logo';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/language-switcher';
import { motion } from 'framer-motion';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, text } = useLanguage();

  const menuItems = [
    { href: '/', label: text.home, icon: Home },
    { href: '/jockeys', label: text.jockeys, icon: User },
    { href: '/trainers', label: text.trainers, icon: Users },
    { href: '/horses', label: text.horses, icon: Shield },
    { href: '/tracks', label: text.tracks, icon: MapPin },
    { href: '/gallery', label: text.gallery, icon: ImageIcon },
    { href: '/race-preview', label: text.racePreview, icon: Wand2 },
    { href: '/contact', label: text.contact, icon: Mail },
  ];

  const getLocalePath = (path: string) => {
    // This is a simple placeholder. A real app would use next-intl or similar.
    return path;
  };
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <HorseLogo className="size-8 text-primary-foreground" />
            <span className="text-lg font-semibold text-primary-foreground">
              {text.appName}
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={getLocalePath(item.href)} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === getLocalePath(item.href)}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="items-center justify-center group-data-[collapsible=icon]:hidden">
           <p className='text-xs text-sidebar-foreground/50'>© {new Date().getFullYear()} {text.appNameFull}</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden"/>
            <LanguageSwitcher />
        </header>
        <motion.main 
            key={pathname}
            className="flex-1 overflow-y-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
        >
            {children}
        </motion.main>
      </SidebarInset>
    </SidebarProvider>
  );
}
