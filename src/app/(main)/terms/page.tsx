'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContent } from '@/lib/client/data';
import { useLanguage, useDynamicTranslation } from '@/hooks/use-language';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';


function TermsPageContent() {
    const { language } = useLanguage();
    const [termsContent, setTermsContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // Always fetch the base Bulgarian content
            const content = await getSiteContent('terms_content');
            setTermsContent(content);
            setLoading(false);
        }
        fetchData();
    }, []);

    const translatedContent = useDynamicTranslation(termsContent);

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
                <div dangerouslySetInnerHTML={{ __html: translatedContent }} />
            </CardContent>
        </Card>
    );
}

export default function TermsPage() {
  const { text } = useLanguage();
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.termsTitle}
        description={text.termsDescription}
      />
      <TermsPageContent />
    </div>
  );
}
