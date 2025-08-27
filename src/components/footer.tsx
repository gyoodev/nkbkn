import Link from 'next/link';
import { HorseLogo } from '@/components/icons/horse-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, Facebook, Instagram, Youtube, Code } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export function Footer() {
  const { text } = useLanguage();

  const socialLinks = [
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#' },
    { name: 'Youtube', icon: <Youtube className="h-5 w-5" />, href: '#' },
  ];

  const footerLinks = {
    [text.aboutUs]: [
      { label: text.history, href: '#' },
      { label: text.mission, href: '#' },
      { label: text.team, href: '#' },
    ],
    [text.races]: [
      { label: text.calendar, href: '#' },
      { label: text.results, href: '#' },
      { label: text.news, href: '/#news' },
    ],
    [text.resources]: [
        { label: text.regulations, href: '#' },
        { label: text.forms, href: '#' },
        { label: text.contact, href: '/contact' },
    ],
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <HorseLogo className="h-10 w-auto text-primary" />
              <span className="text-lg font-bold uppercase tracking-wider text-primary">
                {text.appName}
              </span>
            </Link>
            <p className="text-sm">
                {text.appNameFull}. {text.allRightsReserved}.
            </p>
            <div className="flex space-x-4">
                {socialLinks.map((social) => (
                    <a key={social.name} href={social.href} className="text-gray-500 hover:text-primary dark:hover:text-primary-foreground">
                        <span className="sr-only">{social.name}</span>
                        {social.icon}
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
            <div>
                 <h3 className="font-semibold uppercase tracking-wider text-gray-900 dark:text-white">{text.newsletter}</h3>
                 <p className="mt-4 text-sm">{text.newsletterSubscribe}</p>
                 <form className="mt-4 flex items-center gap-2">
                    <Input type="email" placeholder={text.yourEmail} className="flex-1" />
                    <Button type="submit" size="sm">{text.subscribe}</Button>
                 </form>
            </div>
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
