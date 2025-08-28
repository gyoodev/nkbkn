'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Facebook, Instagram } from 'lucide-react';

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

export default function ContactPage() {
  const { text } = useLanguage();

  const socialLinks = [
    { icon: <TiktokIcon className="h-6 w-6" />, href: '#' },
    { icon: <Facebook className="h-6 w-6" />, href: '#' },
    { icon: <Instagram className="h-6 w-6" />, href: '#' },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.contactPageTitle}
        description={text.contactPageDescription}
      />
      <div className="mt-8 grid grid-cols-1 gap-12 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{text.sendMessage}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">{text.name}</Label>
                <Input type="text" id="name" placeholder={text.name} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">{text.email}</Label>
                <Input type="email" id="email" placeholder={text.email} />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="message">{text.message}</Label>
                <Textarea id="message" placeholder={text.message} />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {text.submit}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>{text.findUs}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {text.appNameFull}<br/>
                        {text.addressStreet}<br/>
                        {text.addressCity}
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{text.followUs}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-4">
                        {socialLinks.map((social, index) => (
                        <Button key={index} variant="outline" size="icon" asChild>
                            <a href={social.href} target="_blank" rel="noopener noreferrer">
                                {social.icon}
                            </a>
                        </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
