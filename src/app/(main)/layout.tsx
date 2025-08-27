
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  Languages,
  Calendar,
  LogIn,
  User,
  LayoutGrid,
  LogOut,
  Info,
} from 'lucide-react';
import { HorseLogo } from '@/components/icons/horse-logo';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Footer } from '@/components/footer';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { text, language, toggleLanguage } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        // Fetch profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (profile) {
          setIsAdmin(profile.role === 'admin');
        }
      }
    };
    fetchUser();

     const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        fetchUser();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);


  const socialLinks = [
    { icon: <Twitter className="h-4 w-4" />, href: '#' },
    { icon: <Facebook className="h-4 w-4" />, href: '#' },
    { icon: <Instagram className="h-4 w-4" />, href: '#' },
    { icon: <Youtube className="h-4 w-4" />, href: '#' },
  ];

  const leftNavItems = [
    { href: '/about', label: text.aboutCommissionShort, icon: <Info /> },
    { href: '/jockeys', label: text.jockeys },
    { href: '/trainers', label: text.trainers },
    { href: '/horses', label: text.horses },
  ];

  const rightNavItems = [
    { href: '/tracks', label: text.tracks },
    { href: '/gallery', label: text.gallery },
    { href: '/news', label: text.news },
  ];
  
  const allNavItems = [
      { href: '/', label: text.home, exact: true },
      ...leftNavItems, 
      ...rightNavItems,
      { href: '/contact', label: text.contact },
      { href: '/calendar', label: text.calendar },
    ];

  const LanguageSelector = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-xs font-medium uppercase transition-opacity hover:opacity-80 hover:bg-primary/20 h-auto p-1">
                <Languages className="mr-1.5 h-4 w-4" />
                {language === 'bg' ? (
                    <span className="mr-1 font-bold">BG</span>
                ) : (
                    <span className="mr-1">EN</span>
                )}
                <span className="hidden sm:inline">{language === 'bg' ? 'Български' : 'English'}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40" align="end">
            <DropdownMenuItem onClick={() => language === 'en' && toggleLanguage()}>
                <span className="mr-2">BG</span> Български
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => language === 'bg' && toggleLanguage()}>
                <span className="mr-2 font-bold">EN</span> English
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    window.location.href = '/';
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-10 items-center justify-between px-4">
            <div className="flex-1 flex justify-start items-center gap-4">
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
            </div>
             <div className="flex-1 flex justify-center items-center">
                 <div className="flex flex-col items-center">
                    <span className="text-sm font-bold uppercase tracking-wider text-white">
                        {text.appName}
                    </span>
                    <span className="hidden text-[10px] font-medium text-white/80 sm:block">
                        {text.appNameFull}
                    </span>
                </div>
            </div>
            <div className="flex-1 flex justify-end items-center gap-4">
                <LanguageSelector />
                 {user ? (
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button variant="ghost" size="sm" className="text-xs uppercase hover:bg-primary/20 p-1 h-auto text-white hover:text-white">
                         <User className="mr-1.5 h-4 w-4" />
                         {text.profile}
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem asChild>
                         <Link href="/profile"><User className="mr-2 h-4 w-4" />{text.profile}</Link>
                       </DropdownMenuItem>
                       {isAdmin && (
                         <DropdownMenuItem asChild>
                           <Link href="/admin"><LayoutGrid className="mr-2 h-4 w-4" />{text.adminPanel}</Link>
                         </DropdownMenuItem>
                       )}
                       <DropdownMenuSeparator />
                       <DropdownMenuItem onClick={handleLogout}>
                         <LogOut className="mr-2 h-4 w-4" />
                         {text.logout}
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 ) : (
                   <Button asChild variant="ghost" size="sm" className="text-xs uppercase hover:bg-primary/20 p-1 h-auto text-white hover:text-white">
                     <Link href="/login">
                         <LogIn className="mr-1.5 h-4 w-4" />
                         {text.login}
                     </Link>
                   </Button>
                 )}
            </div>
          </div>
        </div>

        <nav className="container mx-auto flex h-20 items-center justify-between px-4">
           <div className="flex flex-1 items-center justify-start">
             <Link href="/" className="flex items-center gap-3">
               <HorseLogo className="h-12 w-auto text-primary" />
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

          <div className="flex items-center gap-4">
            <Button asChild>
                <Link href="/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  {text.calendar}
                </Link>
            </Button>
            <div className="md:hidden">
                <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                    <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                    <SheetTitle className="sr-only">Menu</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8 flex flex-col gap-4">
                    {allNavItems.map((item) => (
                        <Link key={item.href} href={item.href} passHref>
                            <Button 
                                variant={item.exact ? pathname === item.href ? 'default' : 'ghost' : pathname.startsWith(item.href) ? 'default' : 'ghost'} 
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
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
