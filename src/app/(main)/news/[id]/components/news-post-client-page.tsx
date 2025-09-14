
'use client';

import Image from 'next/image';
import { useLanguage, useDynamicTranslation } from '@/hooks/use-language';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Heart, Eye, Calendar, Loader2, User, Send } from 'lucide-react';
import type { NewsPost } from '@/lib/types';
import StarterKit from '@tiptap/starter-kit';
import Youtube from '@tiptap/extension-youtube';
import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useTransition, useEffect } from 'react';
import { likePost, incrementViews } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

function TranslatedText({ text: textToTranslate, isHtml = false }: { text: string, isHtml?: boolean }) {
    const translatedText = useDynamicTranslation(textToTranslate, isHtml);
    if (translatedText === 'Loading...') return <Skeleton className="h-6 w-3/4" />;
    if (isHtml) {
        return <div dangerouslySetInnerHTML={{ __html: translatedText }} />;
    }
    return <>{translatedText}</>;
}


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


export function NewsPostClientPage({ post }: { post: NewsPost }) {
  const { language, text } = useLanguage();
  const [viewCount, setViewCount] = useState(post.views);
  
  const translatedTitle = useDynamicTranslation(post.title);
  const translatedCategory = useDynamicTranslation(post.category);
  const translatedContent = useDynamicTranslation(post.content, true);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube.configure({
        controls: false,
        modestBranding: true,
      }),
    ],
    content: '',
    editable: false,
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert max-w-none focus:outline-none"
        }
    }
  });

   useEffect(() => {
    if (editor && translatedContent) {
        // Prevent setting content to 'Loading...'
        if (translatedContent !== 'Loading...') {
             editor.commands.setContent(translatedContent);
        }
    }
  }, [translatedContent, editor]);


  useEffect(() => {
    // This effect runs only on the client after hydration
    // to increment the view count.
    const incrementView = async () => {
        try {
            await incrementViews(post.id);
            // Optimistically update the view count on the client
            setViewCount(prev => prev + 1);
        } catch (error) {
            console.error("Failed to increment views:", error);
        }
    };
    incrementView();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);
  
  const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (!post) {
      return (
          <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
              <p>Зареждане...</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <article>
        <header className="mb-8">
          <Badge className="mb-4">{translatedCategory}</Badge>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-5xl">
            {translatedTitle}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formattedDate(post.date)}</time>
            </div>
            <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{viewCount} {text.views.toLowerCase()}</span>
            </div>
             <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>{post.likes} {text.likes.toLowerCase()}</span>
            </div>
          </div>
        </header>

        <div className="relative mb-8 aspect-video w-full">
          <Image
            src={post.image_url}
            alt={post.title}
            fill
            className="rounded-lg object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1000px"
          />
        </div>

        {translatedContent === 'Loading...' ? <Skeleton className="h-48 w-full" /> : <EditorContent editor={editor} />}
        
        <Separator className="my-8" />

        <div className="flex items-center justify-between">
           <LikeButton postId={post.id} initialLikes={post.likes} />
        </div>
      </article>
    </div>
  );
}
