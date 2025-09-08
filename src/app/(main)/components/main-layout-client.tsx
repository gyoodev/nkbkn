

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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
  FileText,
  Share2,
} from 'lucide-react';
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
import Image from 'next/image';
import { PartnersSection } from '@/components/partners-section';
import type { Partner, SocialLink } from '@/lib/types';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { createBrowserClient } from '@/lib/supabase/client';

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.28 1.66-1.14 3.1-2.73 3.91-1.61.8-3.39.88-5.04.22-1.63-.65-2.9-1.9-3.48-3.55-.58-1.64-.54-3.43.12-5.02.51-1.29 1.38-2.43 2.48-3.32.79-.65 1.76-1.11 2.78-1.36.01 2.87-.01 5.74.02 8.61.23 1.52 1.04 2.84 2.43 3.58.97.51 2.1.75 3.22.56.83-.13 1.6-.52 2.22-1.11.62-.59.99-1.39 1.12-2.22.12-.82.09-1.68-.08-2.52-.18-1.08-.52-2.11-1.02-3.09-.59-1.16-1.36-2.21-2.3-3.05v-2.88c.01-.13.01-.25.01-.38z" />
        </svg>
    )
}

function SocialIcon({ name, ...props }: { name: SocialLink['name'] } & React.SVGProps<SVGSVGElement>) {
    switch (name) {
        case 'TikTok': return <TiktokIcon {...props} />;
        case 'Facebook': return <Facebook {...props} />;
        case 'Instagram': return <Instagram {...props} />;
        case 'Youtube': return <Youtube {...props} />;
        default: return <Share2 {...props} />;
    }
}

function AuthButton({ user, isAdmin }: { user: SupabaseUser | null, isAdmin: boolean }) {
    const { text } = useLanguage();

    const handleLogout = async () => {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      window.location.href = '/';
    };

    if (user) {
        return (
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
        )
    }
    return (
       <Button asChild variant="ghost" size="sm" className="text-xs uppercase hover:bg-primary/20 p-1 h-auto text-white hover:text-white">
          <Link href="/login">
              <LogIn className="mr-1.5 h-4 w-4" />
              {text.login}
          </Link>
      </Button>
    )
}


export function MainLayoutClient({
  children,
  partners,
  socials,
  session,
  isAdmin,
  siteLogoUrl
}: {
  children: React.ReactNode;
  partners: Partner[];
  socials: SocialLink[];
  session: Session | null;
  isAdmin: boolean;
  siteLogoUrl: string;
}) {
  const pathname = usePathname();
  const { text, language, toggleLanguage } = useLanguage();
  
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
    { href: '/forms', label: text.forms, icon: <FileText /> },
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="bg-primary text-primary-foreground">
          <div className="container mx-auto flex h-10 items-center justify-between px-4">
            <div className="flex-1 flex justify-start items-center gap-4">
                <div className="flex items-center gap-2">
                {socials.map((social) => (
                    <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-opacity hover:opacity-80"
                    >
                        <SocialIcon name={social.name} className="h-4 w-4" />
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
                 <AuthButton user={session?.user ?? null} isAdmin={isAdmin} />
            </div>
          </div>
        </div>

        <nav className="container mx-auto flex h-28 items-center justify-between px-4">
           <div className="flex flex-1 items-center justify-start">
             <Link href="/" className="flex items-center gap-3">
               <Image src={siteLogoUrl || '/logo.png'} alt="НКБКН Лого" width={100} height={100} className="h-24 w-auto" />
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
      <PartnersSection partners={partners} />
      <Footer socials={socials} />
    </div>
  );
}
