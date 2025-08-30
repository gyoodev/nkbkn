
'use client';

import { useEffect, useState, useTransition } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/rich-text-editor';
import { updateContent } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getSiteContent } from '@/lib/client/data'; // This should exist if we are to call it client side

function ContentCard({
  contentKey,
  title,
  description,
  initialContent,
  useRichText = true,
}: {
  contentKey: string;
  title: string;
  description: string;
  initialContent: string;
  useRichText?: boolean;
}) {
  const [content, setContent] = useState(initialContent);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    startTransition(async () => {
      const { error } = await updateContent(contentKey, content);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Грешка!',
          description: error,
        });
      } else {
        toast({
          title: 'Успех!',
          description: `Секция "${title}" е запазена успешно.`,
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`${contentKey}-editor`}>Съдържание</Label>
           {useRichText ? (
            <RichTextEditor value={content} onChange={setContent} />
          ) : (
             <Textarea
                id={`${contentKey}-editor`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
             />
          )}
        </div>
        <Button onClick={handleSave} disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Запази промените
        </Button>
      </CardContent>
    </Card>
  );
}

type ContentState = {
    about_history: string;
    about_mission: string;
    about_team_text: string;
}

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      
      // In a real app, you would fetch this from an API route.
      // Since we can't create API routes, we'll call a client-side data fetching function.
      // This assumes getSiteContent can be made to work on the client.
      const [history, mission, team] = await Promise.all([
        getSiteContent('about_history'),
        getSiteContent('about_mission'),
        getSiteContent('about_team_text'),
      ]);

      setContent({
        about_history: history,
        about_mission: mission,
        about_team_text: team,
      });
      setLoading(false);
    }
    
    fetchContent();
  }, []);

  if (loading) {
      return (
          <div>
            <PageHeader
                title="Управление на съдържанието"
                description="Редактирайте текстовете на страница 'За нас'."
            />
             <div className="mt-8 space-y-4">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-32 w-full" /></CardContent>
                </Card>
             </div>
          </div>
      )
  }

  return (
    <div>
      <PageHeader
        title="Управление на съдържанието"
        description="Редактирайте текстовете на страница 'За нас'."
      />
      {content && (
        <div className="mt-8 grid gap-8">
            <ContentCard
            contentKey="about_history"
            title="История"
            description="Редактирайте съдържанието на секция 'Нашата история' в страница 'За нас'."
            initialContent={content.about_history}
            />
            
            <ContentCard
            contentKey="about_mission"
            title="Мисия"
            description="Редактирайте съдържанието на секция 'Нашата мисия' в страница 'За нас'."
            initialContent={content.about_mission}
            />

            <ContentCard
            contentKey="about_team_text"
            title="Екип"
            description="Текстът, който се показва в секция 'Екип' на страница 'За нас'."
            initialContent={content.about_team_text}
            useRichText={false}
            />
        </div>
      )}
    </div>
  );
}
