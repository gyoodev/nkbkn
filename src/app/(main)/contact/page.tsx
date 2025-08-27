'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function ContactPage() {
  const { text } = useLanguage();

  const socialLinks = [
    { icon: <Twitter className="h-6 w-6" />, href: '#' },
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
            <CardTitle>{text.language === 'bg' ? 'Изпратете ни съобщение' : 'Send us a message'}</CardTitle>
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
                    <CardTitle>{text.language === 'bg' ? 'Намерете ни' : 'Find Us'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Национална комисия за Български конни надбягвания<br/>
                        ул. "Състезателна" 1<br/>
                        1000 София, България
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{text.language === 'bg' ? 'Последвайте ни' : 'Follow Us'}</CardTitle>
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
