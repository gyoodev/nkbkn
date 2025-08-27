'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, User, Users, Image as ImageIcon, Wand2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

export default function HomePage() {
  const { text } = useLanguage();

  const features = [
    {
      title: text.jockeys,
      description: text.jockeysPageDescription,
      href: '/jockeys',
      icon: <User className="size-8 text-primary" />,
      cta: text.exploreJockeys,
    },
    {
      title: text.trainers,
      description: text.trainersPageDescription,
      href: '/trainers',
      icon: <Users className="size-8 text-primary" />,
      cta: text.exploreTrainers,
    },
    {
      title: text.gallery,
      description: text.galleryPageDescription,
      href: '/gallery',
      icon: <ImageIcon className="size-8 text-primary" />,
      cta: text.viewGallery,
    },
    {
      title: text.racePreview,
      description: text.racePreviewPageDescription,
      href: '/race-preview',
      icon: <Wand2 className="size-8 text-primary" />,
      cta: text.generatePreview,
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://picsum.photos/1920/1080?random=hero"
          alt="Horse racing"
          fill
          className="object-cover"
          priority
          data-ai-hint="horse racing"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white p-4">
          <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            {text.homeTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-primary-foreground/80 md:text-xl">
            {text.homeSubtitle}
          </p>
          <p className="mt-2 max-w-2xl text-base text-primary-foreground/60">
            {text.homeDescription}
          </p>
          <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/horses">{text.horses} <ArrowRight className="ml-2 size-5" /></Link>
          </Button>
        </div>
      </section>
      
      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col bg-card hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-4">
                  <div className="rounded-full bg-primary/10 p-3">{feature.icon}</div>
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <CardContent>
                   <Button asChild variant="link" className="p-0 text-primary">
                      <Link href={feature.href}>{feature.cta}<ArrowRight className="ml-2 size-4" /></Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
