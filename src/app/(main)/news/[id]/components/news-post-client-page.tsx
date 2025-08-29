
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
import { useActionState, useEffect, useState, useTransition } from 'react';
import { addComment, likePost } from '../actions';
import { useToast } from '@/hooks/use-toast';


function CommentCard({ comment, language }: { comment: CommentType, language: string }) {
    const authorName = comment.profiles?.full_name || comment.profiles?.username || comment.guest_name || 'Анонимен';
    const avatarUrl = comment.profiles?.avatar_url || '';
    const avatarFallback = authorName.charAt(0).toUpperCase();

    return (
        <div className="flex space-x-4">
            <Avatar>
                <AvatarImage src={avatarUrl} alt={authorName} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{authorName}</p>
                    <p className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleDateString(language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
            </div>
        </div>
    )
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


export function NewsPostClientPage({ post: initialPost }: { post: NewsPost }) {
  const { language, text } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [post, setPost] = useState(initialPost);

  // Separate state for comments to avoid re-rendering the whole page
  const [comments, setComments] = useState<CommentType[]>(initialPost.comments || []);

  const [addCommentState, submitAddComment, isAddCommentPending] = useActionState(addComment, { success: false });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Youtube.configure({
        controls: false,
        modestBranding: true,
      }),
    ],
    content: post.content,
    editable: false,
    editorProps: {
        attributes: {
            class: "prose dark:prose-invert max-w-none focus:outline-none"
        }
    }
  });

  useEffect(() => {
      if (addCommentState.success) {
          if (addCommentState.newComment) {
              setComments(prev => [addCommentState.newComment!, ...prev]);
          }
          toast({ title: 'Успех!', description: 'Коментарът е добавен успешно.' });
      } else if (addCommentState.error) {
          toast({ variant: 'destructive', title: 'Грешка', description: addCommentState.error });
      }
  }, [addCommentState, toast]);

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
          <Badge className="mb-4">{post.category}</Badge>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-primary md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
             <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{formattedDate(post.date)}</time>
            </div>
            <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{post.views} {text.views.toLowerCase()}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span>{comments.length} {text.comments.toLowerCase()}</span>
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

        <EditorContent editor={editor} />
        
        <Separator className="my-8" />

        <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">{text.shareYourThoughts}</h3>
            <LikeButton postId={post.id} initialLikes={post.likes} />
        </div>
      </article>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>{text.comments}</CardTitle>
            <CardDescription>Оставете вашия коментар по-долу.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form action={(formData) => {
                submitAddComment(formData);
                const form = document.getElementById('comment-form') as HTMLFormElement;
                form?.reset();
            }} id="comment-form">
                <input type="hidden" name="post_id" value={post.id} />
                <div className="space-y-4">
                    {!user && (
                        <div className="space-y-1.5">
                            <Label htmlFor="guest_name">Име (като гост)</Label>
                            <Input id="guest_name" name="guest_name" required />
                        </div>
                    )}
                    <div className="space-y-1.5">
                         <Label htmlFor="content">Вашият коментар</Label>
                        <Textarea name="content" placeholder={text.writeCommentPlaceholder} className="mb-4" required />
                    </div>
                    <Button type="submit" disabled={isAddCommentPending}>
                         {isAddCommentPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {text.postComment}
                    </Button>
                </div>
            </form>
            <Separator />
            <div className="space-y-4">
              {comments.length > 0 ? comments.map((comment) => (
                <CommentCard key={comment.id} comment={comment} language={language} />
              )) : <p className="text-sm text-muted-foreground">Все още няма коментари. Бъдете първи!</p>}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
