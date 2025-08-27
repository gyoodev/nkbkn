'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Menu,
} from 'lucide-react';
import { HorseLogo } from '@/components/icons/horse-logo';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
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
    { href: '/jockeys', label: text.jockeys },
    { href: '/trainers', label: text.trainers },
    { href: '/horses', label: text.horses },
  ];

  const rightNavItems = [
    { href: '/tracks', label: text.tracks },
    { href: '/gallery', label: text.gallery },
    { href: '/race-preview', label: text.racePreview },
  ];
  
  const allNavItems = [
      { href: '/', label: text.home, exact: true },
      ...leftNavItems, 
      ...rightNavItems,
      { href: '/contact', label: text.contact }
    ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-10 items-center justify-between px-4">
            <div className='flex items-center gap-4'>
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
                </div>
            </div>
            <button
              onClick={toggleLanguage}
              className="text-xs font-medium uppercase transition-opacity hover:opacity-80"
            >
              {language === 'bg' ? 'English' : 'Български'}
            </button>
          </div>
        </div>

        <nav className="container mx-auto flex h-20 items-center justify-between px-4">
           <div className="flex flex-1 items-center justify-start">
             <Link href="/" className="flex items-center gap-3">
               <HorseLogo className="h-12 w-auto text-primary" />
               <div className="flex flex-col">
                <span className="text-lg font-bold uppercase tracking-wider text-primary">
                  {text.appName}
                </span>
                <span className="hidden text-xs font-medium text-gray-600 sm:block">
                  {text.appNameFull}
                </span>
               </div>
            </Link>
           </div>

          <div className="hidden items-center gap-2 text-sm font-medium uppercase text-gray-700 md:flex">
            {leftNavItems.map((item) => (
              <Link key={item.href} href={item.href} passHref>
                <Button variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}>{item.label}</Button>
              </Link>
            ))}
            <div className="w-px self-stretch bg-border mx-2"/>
            {rightNavItems.map((item) => (
               <Link key={item.href} href={item.href} passHref>
                <Button variant={pathname.startsWith(item.href) ? 'default' : 'ghost'}>{item.label}</Button>
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
                <div className="mt-8 flex flex-col gap-4">
                  {allNavItems.map((item) => (
                     <Link key={item.href} href={item.href} passHref>
                        <Button 
                            variant={item.exact ? pathname === item.href : pathname.startsWith(item.href) ? 'default' : 'ghost'} 
                            className="justify-start"
                        >
                            {item.label}
                        </Button>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
