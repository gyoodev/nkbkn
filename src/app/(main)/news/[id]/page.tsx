'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { newsPosts } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Eye, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NewsPost } from '@/lib/types';

export default function NewsPostPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { text, language } = useLanguage();
  const [post, setPost] = useState<NewsPost | undefined>(undefined);
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedCommentDates, setFormattedCommentDates] = useState<{[key: number]: string}>({});
  
  const comments = [
    {
      id: 1,
      author: 'Иван Петров',
      avatar: 'https://picsum.photos/40/40?random=20',
      text: 'Страхотна статия! Много полезна информация.',
      date: '2024-08-16',
    },
    {
      id: 2,
      author: 'Мария Георгиева',
      avatar: 'https://picsum.photos/40/40?random=21',
      text: 'Напълно съм съгласна. "Вятър" е фаворит, но не трябва да подценяваме и останалите.',
      date: '2024-08-16',
    },
  ];

  useEffect(() => {
    const foundPost = newsPosts.find((p) => p.id.toString() === id);
    setPost(foundPost);

    if (foundPost) {
        setFormattedDate(new Date(foundPost.date).toLocaleDateString(language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }));

        const newFormattedDates: {[key: number]: string} = {};
        comments.forEach(comment => {
            newFormattedDates[comment.id] = new Date(comment.date).toLocaleDateString(language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        });
        setFormattedCommentDates(newFormattedDates);
    } else if (typeof window !== 'undefined') { // only call notFound on client
        notFound();
    }
  }, [id, language]);


  if (!post) {
    // Render a loading state or nothing while the post is being found on the client
    return null; 
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article>
        <header className="mb-8">
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formattedDate}</time>
            </div>
            <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.views} {text.views.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>{post.likes} {text.likes.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentsCount} {text.comments.toLowerCase()}</span>
            </div>
          </div>
        </header>

        <div className="relative mb-8 h-64 w-full sm:h-96">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="rounded-lg object-cover"
            priority
          />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="lead text-xl text-muted-foreground">{post.excerpt}</p>
          <p>{post.content}</p>
        </div>
        
        <Separator className="my-8" />

        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">{text.shareYourThoughts}</h3>
            <Button variant="outline">
                <Heart className="mr-2 h-4 w-4" /> {text.like}
            </Button>
        </div>

      </article>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{text.comments}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form>
              <Textarea placeholder={text.writeCommentPlaceholder} className="mb-4" />
              <Button type="submit">{text.postComment}</Button>
            </form>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <p className="font-semibold">{comment.author}</p>
                        <p className="text-xs text-muted-foreground">{formattedCommentDates[comment.id]}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
