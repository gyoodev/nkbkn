import Link from 'next/link';
import { HorseLogo } from '@/components/icons/horse-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
    { name: 'Facebook', icon: <Facebook className="h-5 w-5" />, href: '#' },
    { name: 'Instagram', icon: <Instagram className="h-5 w-5" />, href: '#' },
    { name: 'Youtube', icon: <Youtube className="h-5 w-5" />, href: '#' },
  ];

  const footerLinks = {
    'За нас': [
      { label: 'История', href: '#' },
      { label: 'Мисия', href: '#' },
      { label: 'Екип', href: '#' },
    ],
    'Състезания': [
      { label: 'Календар', href: '#' },
      { label: 'Резултати', href: '#' },
      { label: 'Новини', href: '/#news' },
    ],
    'Ресурси': [
        { label: 'Правилници', href: '#' },
        { label: 'Формуляри', href: '#' },
        { label: 'Контакти', href: '/contact' },
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
                НКБКН
              </span>
            </Link>
            <p className="text-sm">
                Национална комисия за Български конни надбягвания. Всички права запазени.
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
                 <h3 className="font-semibold uppercase tracking-wider text-gray-900 dark:text-white">Бюлетин</h3>
                 <p className="mt-4 text-sm">Абонирайте се за нашия бюлетин, за да получавате последните новини.</p>
                 <form className="mt-4 flex items-center gap-2">
                    <Input type="email" placeholder="Вашият имейл" className="flex-1" />
                    <Button type="submit" size="sm">Абонирай се</Button>
                 </form>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} НКБКН. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  );
}
