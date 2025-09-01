
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContent } from '@/lib/server/data';

export default async function TermsPage() {
    const termsContent = await getSiteContent('terms_content');
    const defaultContent = `
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
    `;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Условия и правила за ползване"
        description="Моля, прочетете внимателно нашите условия и правила."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Общи положения</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: termsContent || defaultContent }} />
        </CardContent>
      </Card>
    </div>
  );
}
