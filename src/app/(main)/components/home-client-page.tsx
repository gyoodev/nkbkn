
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight, Calendar, Newspaper } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { NewsPost } from '@/lib/types';

export function HomeClientPage({ posts }: { posts: NewsPost[] }) {
  const { text, language } = useLanguage();

  if (!posts || posts.length === 0) {
    return <div>Loading...</div>; // Or a proper loading skeleton
  }

  const mainPost = posts[0];
  const otherPosts = posts.slice(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
  };
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full text-white sm:h-[70vh] lg:h-[80vh]">
        <Image
          src="https://ekip7.bg/wp-content/uploads/2022/09/19-09-2022_kusii-3.jpg"
          alt="Close-up of a horse racing"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          data-ai-hint="horse racing action"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 text-center">
          <div className="max-w-4xl space-y-6">
            <h1 className="font-headline text-4xl font-extrabold uppercase leading-tight tracking-wide text-shadow-lg sm:text-5xl md:text-7xl">
              {text.heroTitle}
            </h1>
            <p className="text-lg text-gray-200 sm:text-xl md:text-2xl">
              {text.homeSubtitle}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="#">
                  <Calendar className="mr-2" />
                  {text.raceCalendar}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-primary">
                <Link href="#news">
                  <Newspaper className="mr-2" />
                  {text.latestNews}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="bg-gray-50 dark:bg-gray-950 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {text.latestFromTheTrack}
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                {text.latestFromTheTrackDescription}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-12">
                {/* Main News Post */}
                <div className="lg:col-span-2">
                    <Card className="h-full overflow-hidden shadow-lg transition-shadow hover:shadow-2xl">
                    <Link href={mainPost.href} className="block h-full">
                        <div className="relative h-64 sm:h-80 md:h-96">
                            <Image src={mainPost.image_url} alt={mainPost.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 66vw" data-ai-hint="horse race finish" />
                            <Badge className="absolute top-4 left-4">{mainPost.category}</Badge>
                        </div>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-primary hover:underline sm:text-3xl">
                                {mainPost.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-2 text-sm text-muted-foreground">{formatDate(mainPost.date)}</p>
                            <p className="text-base text-gray-600 dark:text-gray-300">
                                {mainPost.excerpt}
                            </p>
                        </CardContent>
                        <CardFooter>
                             <span className="flex items-center font-semibold text-primary">
                                {text.readMore} <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </CardFooter>
                    </Link>
                    </Card>
                </div>
                
                {/* Other News Posts */}
                <div className="space-y-8">
                    {otherPosts.map((post) => (
                         <Card key={post.id} className="overflow-hidden shadow-lg transition-shadow hover:shadow-xl">
                            <Link href={post.href} className="group block">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="relative col-span-1 h-full min-h-24">
                                        <Image src={post.image_url} alt={post.title} fill className="object-cover rounded-l-lg" sizes="(max-width: 1024px) 33vw, 10vw" data-ai-hint="jockey horse" />
                                    </div>
                                    <div className="col-span-2 p-4">
                                        <Badge variant="secondary" className="mb-2">{post.category}</Badge>
                                        <h3 className="font-semibold text-primary group-hover:underline">{post.title}</h3>
                                        <p className="mt-1 text-xs text-muted-foreground">{formatDate(post.date)}</p>
                                    </div>
                                </div>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
