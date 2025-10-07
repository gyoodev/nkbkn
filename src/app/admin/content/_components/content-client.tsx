

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ContentState = {
    about_history: string; about_history_en: string;
    about_mission: string; about_mission_en: string;
    about_team_text: string; about_team_text_en: string;
    terms_content: string; terms_content_en: string;
    privacy_content: string; privacy_content_en: string;
    slider_title: string; slider_title_en: string;
    slider_desc: string; slider_desc_en: string;
    terms_title: string; terms_title_en: string;
    terms_desc: string; terms_desc_en: string;
    privacy_title: string; privacy_title_en: string;
    privacy_desc: string; privacy_desc_en: string;
    calendar_alert_bg: string; calendar_alert_en: string;
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
  content: { bg: string, en: string };
  onContentChange: (lang: 'bg' | 'en', newContent: string) => void;
  useRichText?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = (lang: 'bg' | 'en') => {
    startTransition(async () => {
      const keyForDb = contentKey.includes('_bg') || contentKey.includes('_en') 
          ? contentKey.slice(0, -3) + `_${lang}`
          : `${contentKey}_${lang}`;
      
      const { error } = await updateContent(keyForDb, content[lang]);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Грешка!',
          description: error,
        });
      } else {
        toast({
          title: 'Успех!',
          description: `Секция "${title}" (${lang.toUpperCase()}) е запазена успешно.`,
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
        <Tabs defaultValue="bg" className="w-full">
            <TabsList>
                <TabsTrigger value="bg">Български</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
            </TabsList>
            <TabsContent value="bg" className="mt-4 space-y-4">
                 <div>
                    <Label htmlFor={`${contentKey}-editor-bg`}>Съдържание (BG)</Label>
                    {useRichText ? (
                        <RichTextEditor value={content.bg} onChange={(newContent) => onContentChange('bg', newContent)} />
                    ) : (
                        <Textarea
                            id={`${contentKey}-editor-bg`}
                            value={content.bg}
                            onChange={(e) => onContentChange('bg', e.target.value)}
                            rows={useRichText ? 5 : 3}
                        />
                    )}
                 </div>
                 <Button onClick={() => handleSave('bg')} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Запази Български
                </Button>
            </TabsContent>
            <TabsContent value="en" className="mt-4 space-y-4">
                 <div>
                    <Label htmlFor={`${contentKey}-editor-en`}>Content (EN)</Label>
                    {useRichText ? (
                        <RichTextEditor value={content.en} onChange={(newContent) => onContentChange('en', newContent)} />
                    ) : (
                        <Textarea
                            id={`${contentKey}-editor-en`}
                            value={content.en}
                            onChange={(e) => onContentChange('en', e.target.value)}
                             rows={useRichText ? 5 : 3}
                        />
                    )}
                 </div>
                 <Button onClick={() => handleSave('en')} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save English
                </Button>
            </TabsContent>
        </Tabs>
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

  const handleContentChange = (key: keyof ContentState, newContent: string) => {
      setContent(c => ({...c, [key]: newContent }));
  }

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
                imageHint="Препоръчителен размер: 300x300px"
            />
            
            <ImageUploadForm 
                title="Изображение на началната страница"
                description="Качете ново изображение, което да се показва в хедъра на началната страница."
                currentImageUrl={initialHeroImageUrl}
                action={updateHeroImage}
                formId="hero-image-upload"
            />

            <ContentCard
                contentKey="slider_title"
                title="Заглавие на началната страница"
                description="Основното заглавие, което се показва на голямата снимка на началната страница."
                content={{ bg: content.slider_title, en: content.slider_title_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'slider_title' : 'slider_title_en', newContent)}
                useRichText={false}
            />

            <ContentCard
                contentKey="slider_desc"
                title="Подзаглавие на началната страница"
                description="Текстът под основното заглавие на началната страница."
                content={{ bg: content.slider_desc, en: content.slider_desc_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'slider_desc' : 'slider_desc_en', newContent)}
                useRichText={false}
            />
            
            <ContentCard
                contentKey="calendar_alert"
                title="Съобщение в календара"
                description="Важно съобщение, което се показва в червена лента над календара."
                content={{ bg: content.calendar_alert_bg, en: content.calendar_alert_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'calendar_alert_bg' : 'calendar_alert_en', newContent)}
                useRichText={false}
            />

            <ContentCard
                contentKey="about_history"
                title="История (За нас)"
                description="Редактирайте съдържанието на секция 'Нашата история' в страница 'За нас'."
                content={{ bg: content.about_history, en: content.about_history_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'about_history' : 'about_history_en', newContent)}
            />
            
            <ContentCard
                contentKey="about_mission"
                title="Мисия (За нас)"
                description="Редактирайте съдържанието на секция 'Нашата мисия' в страница 'За нас'."
                content={{ bg: content.about_mission, en: content.about_mission_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'about_mission' : 'about_mission_en', newContent)}
            />

            <ContentCard
                contentKey="about_team_text"
                title="Екип (За нас)"
                description="Текстът, който се показва в секция 'Екип' на страница 'За нас'."
                content={{ bg: content.about_team_text, en: content.about_team_text_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'about_team_text' : 'about_team_text_en', newContent)}
                useRichText={false}
            />

            <ContentCard
                contentKey="terms_title"
                title="Заглавие (Условия за ползване)"
                description="Заглавието на страницата 'Условия за ползване'."
                content={{ bg: content.terms_title, en: content.terms_title_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'terms_title' : 'terms_title_en', newContent)}
                useRichText={false}
            />
            <ContentCard
                contentKey="terms_desc"
                title="Описание (Условия за ползване)"
                description="Краткото описание под заглавието на страницата 'Условия за ползване'."
                content={{ bg: content.terms_desc, en: content.terms_desc_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'terms_desc' : 'terms_desc_en', newContent)}
                useRichText={false}
            />
            <ContentCard
                contentKey="terms_content"
                title="Съдържание (Условия за ползване)"
                description="Редактирайте съдържанието на страницата 'Условия и правила за ползване'."
                content={{ bg: content.terms_content, en: content.terms_content_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'terms_content' : 'terms_content_en', newContent)}
            />

            <ContentCard
                contentKey="privacy_title"
                title="Заглавие (Политика за поверителност)"
                description="Заглавието на страницата 'Политика за поверителност'."
                content={{ bg: content.privacy_title, en: content.privacy_title_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'privacy_title' : 'privacy_title_en', newContent)}
                useRichText={false}
            />
             <ContentCard
                contentKey="privacy_desc"
                title="Описание (Политика за поверителност)"
                description="Краткото описание под заглавието на страницата 'Политика за поверителност'."
                content={{ bg: content.privacy_desc, en: content.privacy_desc_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'privacy_desc' : 'privacy_desc_en', newContent)}
                useRichText={false}
            />
            <ContentCard
                contentKey="privacy_content"
                title="Съдържание (Политика за поверителност)"
                description="Редактирайте съдържанието на страницата 'Политика за поверителност'."
                content={{ bg: content.privacy_content, en: content.privacy_content_en }}
                onContentChange={(lang, newContent) => handleContentChange(lang === 'bg' ? 'privacy_content' : 'privacy_content_en', newContent)}
            />
        </div>
  );
}
