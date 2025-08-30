
'use client';

import Image from 'next/image';
import { useLanguage } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Heart, MessageCircle, Eye, Calendar, Loader2, User, Send } from 'lucide-react';
import type { NewsPost, Comment as CommentType } from '@/lib/types';
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import { useEditor, EditorContent } from '@tiptap/react';
import { useAuth } from '@/hooks/use-auth';
import { useActionState, useEffect, useState, useTransition, useRef } from 'react';
import { likePost, incrementViews } from '../actions';
import { useToast } from '@/hooks/use-toast';


function LikeButton({ postId, initialLikes }: { postId: number, initialLikes: number }) {
    const [isPending, startTransition] = useTransition();
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(false);
    const { text } = useLanguage();
    const { toast } = useToast();

    useEffect(() => {
        const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
        if (likedPosts[postId]) {
            setIsLiked(true);
        }
    }, [postId]);

    const handleLike = () => {
        if (isLiked) {
            toast({ variant: 'default', title: 'Вече сте харесали тази публикация.' });
            return;
        }

        startTransition(async () => {
            const result = await likePost(postId);
            if (result.success) {
                setLikes(result.newLikes ?? likes + 1);
                setIsLiked(true);
                const likedPosts = JSON.parse(localStorage.getItem('liked_posts') || '{}');
                likedPosts[postId] = true;
                localStorage.setItem('liked_posts', JSON.stringify(likedPosts));
                 toast({ title: 'Успех!', description: 'Харесахте публикацията!' });
            } else {
                 toast({ variant: 'destructive', title: 'Грешка', description: result.error });
            }
        });
    }

    return (
        <Button variant="outline" onClick={handleLike} disabled={isPending || isLiked}>
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Heart className={`mr-2 h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            )}
            {text.like} ({likes})
        </Button>
    )
}


export function NewsPostClientPage({ post: initialPost }: { post: NewsPost }) {
  const { language, text } = useLanguage();
  const [viewCount, setViewCount] = useState(initialPost.views);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube.configure({
        controls: false,
        modestBranding: true,
      }),
    ],
    content: initialPost.content,
    editable: false,
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert max-w-none focus:outline-none"
        }
    }
  });
  
  useEffect(() => {
    // This effect runs only on the client after hydration
    // to increment the view count.
    const incrementView = async () => {
        try {
            await incrementViews(initialPost.id);
            // Optimistically update the view count on the client
            setViewCount(prev => prev + 1);
        } catch (error) {
            console.error("Failed to increment views:", error);
        }
    };
    incrementView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPost.id]);

  const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article>
        <header className="mb-8">
          <Badge className="mb-4">{initialPost.category}</Badge>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-5xl">
            {initialPost.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={initialPost.date}>{formattedDate(initialPost.date)}</time>
            </div>
            <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{viewCount} {text.views.toLowerCase()}</span>
            </div>
             <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>{initialPost.likes} {text.likes.toLowerCase()}</span>
            </div>
          </div>
        </header>

        <div className="relative mb-8 aspect-video w-full">
          <Image
            src={initialPost.image_url}
            alt={initialPost.title}
            fill
            className="rounded-lg object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1000px"
          />
        </div>

        <EditorContent editor={editor} />
        
        <Separator className="my-8" />

        <div className="flex items-center justify-end">
            <LikeButton postId={initialPost.id} initialLikes={initialPost.likes} />
        </div>
      </article>

    </div>
  );
}
