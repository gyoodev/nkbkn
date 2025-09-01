

'use client';

import { useEffect, useState, useTransition, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/rich-text-editor';
import { updateContent, updateDevBannerStatus, updateHeroImage, updateSiteLogo } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

type ContentState = {
    about_history: string;
    about_mission: string;
    about_team_text: string;
    terms_content: string;
    privacy_content: string;
}

interface AdminContentClientProps {
    initialContent: ContentState;
    initialDevBannerVisible: boolean;
    initialHeroImageUrl: string;
    initialSiteLogoUrl: string;
}

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

function ImageUploadButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Запази изображението
        </Button>
    )
}

function ImageUploadForm({ 
    title, 
    description, 
    currentImageUrl, 
    action, 
    formId, 
    imageHint
}: { 
    title: string;
    description: string;
    currentImageUrl: string;
    action: (prevState: any, formData: FormData) => Promise<any>;
    formId: string;
    imageHint?: string;
}) {
    const { toast } = useToast();
    const initialState = { message: null, errors: {}, success: false };
    const [state, formAction] = useActionState(action, initialState);
    
    useEffect(() => {
        if (state.message) {
            toast({
                variant: state.success ? 'default' : 'destructive',
                title: state.success ? 'Успех!' : 'Грешка',
                description: state.message,
            });
        }
    }, [state, toast]);


    return (
        <form action={formAction}>
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentImageUrl && (
                        <div>
                            <Label>Текущо изображение</Label>
                            <div className="mt-2 relative aspect-video w-full max-w-md rounded-md overflow-hidden bg-muted">
                                <Image src={currentImageUrl} alt="Текущо изображение" fill className="object-contain" />
                            </div>
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <Label htmlFor={formId}>{imageHint || 'Качи ново изображение'}</Label>
                        <Input id={formId} name="image" type="file" accept="image/*" />
                        {state.errors?.image && <p className="text-sm font-medium text-destructive">{state.errors.image}</p>}
                    </div>
                </CardContent>
                <CardFooter>
                    <ImageUploadButton />
                </CardFooter>
            </Card>
        </form>
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


export function AdminContentClient({
    initialContent,
    initialDevBannerVisible,
    initialHeroImageUrl,
    initialSiteLogoUrl
}: AdminContentClientProps) {
  const [content, setContent] = useState<ContentState>(initialContent);

  return (
      <div className="grid gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Общи настройки</CardTitle>
                <CardDescription>
                    Настройки, които се отразяват на целия сайт.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <DevBannerSwitch initialIsOn={initialDevBannerVisible} />
                </CardContent>
            </Card>
            
            <ImageUploadForm 
                title="Лого на сайта"
                description="Качете ново лого, което да се показва в хедъра на сайта. Препоръчително е да е PNG с прозрачен фон."
                currentImageUrl={initialSiteLogoUrl}
                action={updateSiteLogo}
                formId="site-logo-upload"
                imageHint="Препоръчителен размер: 200x200px"
            />
            
            <ImageUploadForm 
                title="Изображение на началната страница"
                description="Качете ново изображение, което да се показва в хедъра на началната страница."
                currentImageUrl={initialHeroImageUrl}
                action={updateHeroImage}
                formId="hero-image-upload"
            />

            <ContentCard
                contentKey="about_history"
                title="История"
                description="Редактирайте съдържанието на секция 'Нашата история' в страница 'За нас'."
                content={content.about_history}
                onContentChange={(newContent) => setContent(c => ({...c, about_history: newContent}))}
            />
            
            <ContentCard
                contentKey="about_mission"
                title="Мисия"
                description="Редактирайте съдържанието на секция 'Нашата мисия' в страница 'За нас'."
                content={content.about_mission}
                onContentChange={(newContent) => setContent(c => ({...c, about_mission: newContent}))}
            />

            <ContentCard
                contentKey="about_team_text"
                title="Екип"
                description="Текстът, който се показва в секция 'Екип' на страница 'За нас'."
                content={content.about_team_text}
                onContentChange={(newContent) => setContent(c => ({...c, about_team_text: newContent}))}
                useRichText={false}
            />

            <ContentCard
                contentKey="terms_content"
                title="Условия и правила за ползване"
                description="Редактирайте съдържанието на страницата 'Условия и правила за ползване'."
                content={content.terms_content}
                onContentChange={(newContent) => setContent(c => ({...c, terms_content: newContent}))}
            />

            <ContentCard
                contentKey="privacy_content"
                title="Политика за поверителност"
                description="Редактирайте съдържанието на страницата 'Политика за поверителност'."
                content={content.privacy_content}
                onContentChange={(newContent) => setContent(c => ({...c, privacy_content: newContent}))}
            />
        </div>
  );
}
