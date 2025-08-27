'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';

export default function HomePage() {
  const { text } = useLanguage();

  return (
    <div className="flex flex-col">
      <section className="relative h-[80vh] w-full text-white">
        <Image
          src="https://picsum.photos/1920/1080?random=hero-2"
          alt="A sprawling horse racing track and stables from an aerial view"
          fill
          className="object-cover"
          priority
          data-ai-hint="horse racing track aerial"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-start justify-end p-8 md:p-16">
          <div className="max-w-3xl space-y-4 text-left">
            <h1 className="font-headline text-5xl font-bold uppercase leading-tight tracking-wide text-shadow-lg md:text-7xl">
              Racing and Breeding Provides a Tremendous Boost to PA's Economy
            </h1>
            <Button
              asChild
              variant="link"
              className="p-0 text-lg font-semibold text-white hover:no-underline"
            >
              <Link href="#">
                Read More <ArrowRight className="ml-2 size-5" />
              </Link>
            </Button>
          </div>
          <div className="absolute bottom-8 right-8 flex items-center gap-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 border-2 border-white ${i === 0 ? 'bg-white' : ''}`} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
