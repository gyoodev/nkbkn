

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Youtube, Code, Share2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import type { SocialLink } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/client/data';

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


export function Footer({ socials }: { socials: SocialLink[] }) {
  const { text } = useLanguage();
  const [siteLogoUrl, setSiteLogoUrl] = useState('');

   useEffect(() => {
    async function fetchLogo() {
      const url = await getSiteContent('site_logo_url');
      setSiteLogoUrl(url);
    }
    fetchLogo();
  }, []);

  const footerLinks = {
    [text.aboutUs]: [
      { label: text.history, href: '/about' },
      { label: text.mission, href: '/about' },
      { label: text.team, href: '/about' },
    ],
    [text.races]: [
      { label: text.calendar, href: '/calendar' },
      { label: text.results, href: '/results' },
      { label: text.news, href: '/news' },
    ],
    [text.resources]: [
        { label: text.forms, href: '/forms' },
        { label: text.contact, href: '/contact' },
        { label: text.termsShort, href: '/terms' },
        { label: text.privacyShort, href: '/privacy' },
        { label: text.faq, href: '/faq' },
    ],
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image src={siteLogoUrl || "/logo.png"} alt="НКБКН Лого" width={100} height={100} className="h-24 w-auto" />
              <span className="text-lg font-bold uppercase tracking-wider text-primary">
                {text.appName}
              </span>
            </Link>
            <p className="text-sm">
                {text.appNameFull}. {text.allRightsReserved}.
            </p>
            <div className="flex space-x-4">
                {socials.map((social) => (
                    <a key={social.id} href={social.url} className="text-gray-500 hover:text-primary dark:hover:text-primary-foreground">
                        <span className="sr-only">{social.name}</span>
                        <SocialIcon name={social.name} className="h-5 w-5" />
                    </a>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="font-semibold uppercase tracking-wider text-gray-900 dark:text-white">{title}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm hover:text-primary hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {text.appName}. {text.allRightsReserved}.</p>
            <p className="mt-2">
                <a href="https://gkdev.org" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Code className="h-4 w-4" />
                    {text.developedBy}
                </a>
            </p>
        </div>
      </div>
    </footer>
  );
}
