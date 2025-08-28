'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function TermsPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.termsTitle}
        description={text.termsDescription}
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Общи положения</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>
            Настоящите Общи условия уреждат отношенията между "Национална комисия за Български конни надбягвания" (наричано по-долу НКБКН) и потребителите на уебсайта. Използването на този сайт означава, че сте съгласни с тези условия.
          </p>
          <h2>1. Права и задължения на потребителите</h2>
          <p>
            Потребителите имат право да използват информацията на сайта за лични и нетърговски цели. Забранява се копирането, разпространението и промяната на съдържание без изричното писмено съгласие на НКБКН.
          </p>
          <h2>2. Ограничение на отговорността</h2>
          <p>
            НКБКН не носи отговорност за точността и пълнотата на предоставената информация. Възможно е да има технически грешки или пропуски. Информацията подлежи на промяна без предварително уведомление.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
