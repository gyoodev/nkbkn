
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContent } from '@/lib/client/data';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


function PageContent() {
    const { language } = useLanguage();
    const [termsContent, setTermsContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const contentKey = language === 'en' ? 'terms_content_en' : 'terms_content';
            const content = await getSiteContent(contentKey);
            setTermsContent(content);
            setLoading(false);
        }
        fetchData();
    }, [language]);

    if (loading) {
        return (
             <Card className="mt-8">
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>
                    <>{language === 'bg' ? 'Общи положения' : 'General Provisions'}</>
                </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: termsContent }} />
            </CardContent>
        </Card>
    );
}

export default function TermsPage() {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    async function fetchHeaderData() {
        const titleKey = language === 'en' ? 'terms_title_en' : 'terms_title';
        const descKey = language === 'en' ? 'terms_desc_en' : 'terms_desc';
        const [fetchedTitle, fetchedDesc] = await Promise.all([
            getSiteContent(titleKey),
            getSiteContent(descKey)
        ]);
        setTitle(fetchedTitle || (language === 'en' ? 'Terms of Service' : 'Условия за ползване'));
        setDescription(fetchedDesc || (language === 'en' ? 'Please read our terms carefully.' : 'Моля, прочетете внимателно нашите условия.'));
    }
    fetchHeaderData();
  }, [language]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={title}
        description={description}
      />
      <PageContent />
    </div>
  );
}
