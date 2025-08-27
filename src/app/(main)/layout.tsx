'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Home,
  MapPin,
  Calendar,
  GraduationCap,
  Newspaper,
  BookOpen,
  LineChart,
  Info,
  Menu,
} from 'lucide-react';
import { HorseLogo } from '@/components/icons/horse-logo';
import { useLanguage } from '@/hooks/use-language';
import { LanguageSwitcher } from '@/components/language-switcher';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { text, language, toggleLanguage } = useLanguage();

  const socialLinks = [
    { icon: <Twitter className="h-4 w-4" />, href: '#' },
    { icon: <Facebook className="h-4 w-4" />, href: '#' },
    { icon: <Instagram className="h-4 w-4" />, href: '#' },
    { icon: <Youtube className="h-4 w-4" />, href: '#' },
  ];

  const leftNavItems = [
    { href: '/tracks', label: text.tracks },
    { href: '/events', label: 'Events' },
    { href: '/learn', label: 'Learn' },
  ];

  const rightNavItems = [
    { href: '/news', label: 'News' },
    { href: '/stories', label: 'Stories' },
    { href: '/impact', label: 'Impact' },
    { href: '/about', label: 'About' },
  ];
  
  const allNavItems = [...leftNavItems, ...rightNavItems];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        {/* Top bar */}
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-12 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <div className="hidden h-6 w-px bg-primary-foreground/50 md:block" />
              <div className="hidden items-center gap-4 text-xs font-medium uppercase md:flex">
                <Link href="/contact" className="transition-opacity hover:opacity-80">
                  {text.contactUs}
                </Link>
                <button
                  onClick={toggleLanguage}
                  className="transition-opacity hover:opacity-80"
                >
                  {language === 'bg' ? 'English' : 'Български'}
                </button>
              </div>
            </div>
            <div className="hidden items-center gap-2 text-xs font-medium uppercase lg:flex">
              <Link href="#" className="rounded-sm bg-white/20 px-3 py-1.5 transition-colors hover:bg-white/30">
                Wager Warriors &gt;
              </Link>
              <Link href="#" className="rounded-sm bg-white/20 px-3 py-1.5 transition-colors hover:bg-white/30">
                Hot 2 Trot Podcast &gt;
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation */}
        <nav className="container mx-auto flex h-24 items-center justify-between px-4">
          <div className="hidden items-center gap-2 md:flex">
            {leftNavItems.map((item) => (
              <Button key={item.href} asChild variant={pathname === item.href ? 'default' : 'outline'}>
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
          <div className="flex flex-1 items-center justify-start md:justify-center">
            <Link href="/" className="flex flex-col items-center text-center">
               <HorseLogo className="h-auto w-10 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Pennsylvania
              </span>
              <span className="text-lg font-bold uppercase tracking-widest text-primary">
                Horse Racing
              </span>
                 <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                Association
              </span>
            </Link>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium uppercase text-gray-700 md:flex">
            {rightNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-4">
                  {allNavItems.map((item) => (
                    <Button key={item.href} asChild variant={pathname === item.href ? 'default' : 'ghost'} className="justify-start">
                        <Link href={item.href}>{item.label}</Link>
                    </Button>
                  ))}
                  <hr/>
                   <Button asChild variant='ghost' className="justify-start">
                        <Link href="/contact">{text.contactUs}</Link>
                    </Button>
                     <Button onClick={toggleLanguage} variant='ghost' className="justify-start">
                        {language === 'bg' ? 'Switch to English' : 'Смяна на Български'}
                    </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <motion.main
        key={pathname}
        className="flex-1 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {children}
      </motion.main>
    </div>
  );
}
