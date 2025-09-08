

'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Code, Share2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import Image from 'next/image';
import type { SocialLink } from '@/lib/types';
import { useEffect, useState } from 'react';
import { getSiteContent } from '@/lib/client/data';

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props} fill="currentColor">
            <path d="M448.5 209.9c-44 .1-87-13.6-122.8-39.2l0 178.7c0 33.1-10.1 65.4-29 92.6s-45.6 48-76.6 59.6-64.8 13.5-96.9 5.3-60.9-25.9-82.7-50.8-35.3-56-39-88.9 2.9-66.1 18.6-95.2 40-52.7 69.6-67.7 62.9-20.5 95.7-16l0 89.9c-15-4.7-31.1-4.6-46 .4s-27.9 14.6-37 27.3-14 28.1-13.9 43.9 5.2 31 14.5 43.7 22.4 22.1 37.4 26.9 31.1 4.8 46-.1 28-14.4 37.2-27.1 14.2-28.1 14.2-43.8l0-349.4 88 0c-.1 7.4 .6 14.9 1.9 22.2 3.1 16.3 9.4 31.9 18.7 45.7s21.3 25.6 35.2 34.6c19.9 13.1 43.2 20.1 67 20.1l0 87.4z"/>
        </svg>
    )
}

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props} fill="currentColor">
            <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"/>
        </svg>
    )
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props} fill="currentColor">
            <path d="M320.3 205C256.8 204.8 205.2 256.2 205 319.7C204.8 383.2 256.2 434.8 319.7 435C383.2 435.2 434.8 383.8 435 320.3C435.2 256.8 383.8 205.2 320.3 205zM319.7 245.4C360.9 245.2 394.4 278.5 394.6 319.7C394.8 360.9 361.5 394.4 320.3 394.6C279.1 394.8 245.6 361.5 245.4 320.3C245.2 279.1 278.5 245.6 319.7 245.4zM413.1 200.3C413.1 185.5 425.1 173.5 439.9 173.5C454.7 173.5 466.7 185.5 466.7 200.3C466.7 215.1 454.7 227.1 439.9 227.1C425.1 227.1 413.1 215.1 413.1 200.3zM542.8 227.5C541.1 191.6 532.9 159.8 506.6 133.6C480.4 107.4 448.6 99.2 412.7 97.4C375.7 95.3 264.8 95.3 227.8 97.4C192 99.1 160.2 107.3 133.9 133.5C107.6 159.7 99.5 191.5 97.7 227.4C95.6 264.4 95.6 375.3 97.7 412.3C99.4 448.2 107.6 480 133.9 506.2C160.2 532.4 191.9 540.6 227.8 542.4C264.8 544.5 375.7 544.5 412.7 542.4C448.6 540.7 480.4 532.5 506.6 506.2C532.8 480 541 448.2 542.8 412.3C544.9 375.3 544.9 264.5 542.8 227.5zM495 452C487.2 471.6 472.1 486.7 452.4 494.6C422.9 506.3 352.9 503.6 320.3 503.6C287.7 503.6 217.6 506.2 188.2 494.6C168.6 486.8 153.5 471.7 145.6 452C133.9 422.5 136.6 352.5 136.6 319.9C136.6 287.3 134 217.2 145.6 187.8C153.4 168.2 168.5 153.1 188.2 145.2C217.7 133.5 287.7 136.2 320.3 136.2C352.9 136.2 423 133.6 452.4 145.2C472 153 487.1 168.1 495 187.8C506.7 217.3 504 287.3 504 319.9C504 352.5 506.7 422.6 495 452z"/>
        </svg>
    )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" {...props} fill="currentColor">
            <path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z"/>
        </svg>
    )
}

function SocialIcon({ name, ...props }: { name: SocialLink['name'] } & React.SVGProps<SVGSVGElement>) {
    switch (name) {
        case 'TikTok': return <TiktokIcon {...props} />;
        case 'Facebook': return <FacebookIcon {...props} />;
        case 'Instagram': return <InstagramIcon {...props} />;
        case 'Youtube': return <YoutubeIcon {...props} />;
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
