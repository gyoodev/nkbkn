'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function PrivacyPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.privacyTitle}
        description={text.privacyDescription}
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Събиране и използване на информация</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none dark:prose-invert">
          <p>
            Ние събираме лична информация, когато се регистрирате на нашия сайт, абонирате се за нашия бюлетин или попълвате формуляр. Тази информация може да включва вашето име, имейл адрес, телефонен номер и друга информация, която предоставяте доброволно.
          </p>
          <h2>Бисквитки (Cookies)</h2>
          <p>
            Нашият сайт използва "бисквитки", за да подобри вашето потребителско изживяване. Бисквитките са малки файлове, които сайтът или неговият доставчик на услуги прехвърля на твърдия диск на вашия компютър чрез уеб браузъра ви (ако позволите), което позволява на сайтовете или системите на доставчиците на услуги да разпознават вашия браузър и да заснемат и запомнят определена информация.
          </p>
           <h2>Разкриване на информация пред трети страни</h2>
            <p>
                Ние не продаваме, не търгуваме и не прехвърляме по друг начин на външни страни вашата лична информация. Това не включва доверени трети страни, които ни помагат в управлението на нашия уебсайт, воденето на нашия бизнес или обслужването ви, стига тези страни да се съгласят да пазят тази информация поверителна.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
