

'use client';

import { useEffect, useState, useTransition } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/rich-text-editor';
import { updateContent, updateDevBannerStatus } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { getSiteContent } from '@/lib/client/data'; 
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';


function DevBannerSwitch({ initialIsOn }: { initialIsOn: boolean }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleCheckedChange = (checked: boolean) => {
    startTransition(async () => {
      const { error } = await updateDevBannerStatus(checked);
       if (error) {
        toast({
          variant: 'destructive',
          title: 'Грешка!',
          description: error,
        });
      } else {
        toast({
          title: 'Успех!',
          description: `Банерът за разработка е ${checked ? 'включен' : 'изключен'}.`,
        });
      }
    })
  }

  return (
      <div className="flex items-center space-x-2">
        <Switch 
          id="dev-banner-switch" 
          defaultChecked={initialIsOn}
          onCheckedChange={handleCheckedChange}
          disabled={isPending}
        />
        <Label htmlFor="dev-banner-switch">Покажи банер за разработка</Label>
      </div>
  )
}

function ContentCard({
  contentKey,
  title,
  description,
  content,
  onContentChange,
  useRichText = true,
}: {
  contentKey: string;
  title: string;
  description: string;
  content: string;
  onContentChange: (newContent: string) => void;
  useRichText?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
            <RichTextEditor value={content} onChange={onContentChange} />
          ) : (
             <Textarea
                id={`${contentKey}-editor`}
                value={content}
                onChange={(e) => onContentChange(e.target.value)}
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
  const [devBannerVisible, setDevBannerVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      setLoading(true);
      
      const [history, mission, team, bannerVisible] = await Promise.all([
        getSiteContent('about_history'),
        getSiteContent('about_mission'),
        getSiteContent('about_team_text'),
        getSiteContent('dev_banner_visible')
      ]);

      setContent({
        about_history: history,
        about_mission: mission,
        about_team_text: team,
      });

      setDevBannerVisible(bannerVisible === 'true');

      setLoading(false);
    }
    
    fetchContent();
  }, []);

  if (loading) {
      return (
          <div>
            <PageHeader
                title="Управление на съдържанието"
                description="Редактирайте текстовете на различни страници и други общи настройки."
            />
             <div className="mt-8 space-y-4">
                 <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                    <CardContent><Skeleton className="h-10 w-full" /></CardContent>
                </Card>
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
        description="Редактирайте текстовете на различни страници и други общи настройки."
      />
      <div className="mt-8 grid gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Банер за разработка</CardTitle>
                <CardDescription>
                    Включете или изключете банера, който информира потребителите, че сайтът е в процес на разработка.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <DevBannerSwitch initialIsOn={devBannerVisible} />
                </CardContent>
            </Card>

            {content && (
                <>
                    <ContentCard
                    contentKey="about_history"
                    title="История"
                    description="Редактирайте съдържанието на секция 'Нашата история' в страница 'За нас'."
                    content={content.about_history}
                    onContentChange={(newContent) => setContent(c => c ? {...c, about_history: newContent} : null)}
                    />
                    
                    <ContentCard
                    contentKey="about_mission"
                    title="Мисия"
                    description="Редактирайте съдържанието на секция 'Нашата мисия' в страница 'За нас'."
                    content={content.about_mission}
                    onContentChange={(newContent) => setContent(c => c ? {...c, about_mission: newContent} : null)}
                    />

                    <ContentCard
                    contentKey="about_team_text"
                    title="Екип"
                    description="Текстът, който се показва в секция 'Екип' на страница 'За нас'."
                    content={content.about_team_text}
                    onContentChange={(newContent) => setContent(c => c ? {...c, about_team_text: newContent} : null)}
                    useRichText={false}
                    />
                </>
            )}
        </div>
    </div>
  );
}
