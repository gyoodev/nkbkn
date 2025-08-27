import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { ArrowRight, Eye, Heart, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getNewsPosts } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import type { NewsPost } from '@/lib/types';
import { ClientDate } from './components/client-date';


export default async function NewsPage() {
  const newsPosts = await getNewsPosts();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Новини"
        description="Последни новини от пистата"
      />
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {newsPosts.map((post: NewsPost) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg transition-shadow hover:shadow-2xl">
            <Link href={post.href} className="block">
                <div className="relative h-56 w-full">
                    <Image src={post.image_url} alt={post.title} fill className="object-cover" />
                    <Badge className="absolute top-4 left-4">{post.category}</Badge>
                </div>
            </Link>
            <div className="flex flex-1 flex-col p-6">
                <CardHeader className="p-0">
                    <CardTitle className="text-xl font-bold text-primary hover:underline">
                        <Link href={post.href}>
                            {post.title}
                        </Link>
                    </CardTitle>
                    <CardDescription><ClientDate dateString={post.date} /></CardDescription>
                </CardHeader>
                <CardContent className="flex-1 p-0 pt-4">
                    <p className="text-base text-gray-600 dark:text-gray-300">
                        {post.excerpt}
                    </p>
                </CardContent>
                <CardFooter className="mt-4 flex justify-between p-0">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            <span>{post.views}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments_count}</span>
                        </div>
                    </div>
                     <Link href={post.href} className="flex items-center font-semibold text-primary">
                        Прочети повече <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
