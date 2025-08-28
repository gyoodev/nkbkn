
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function AdminGalleryPage() {
  return (
    <div>
      <PageHeader
        title="Управление на галерия"
        description="Качвайте, редактирайте и изтривайте снимки от галерията."
      />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Галерия</CardTitle>
          <CardDescription>
            Списък с всички снимки в галерията.
          </CardDescription>
          <div className="flex justify-end">
            <Button disabled>
                <PlusCircle className="mr-2 h-4 w-4" />
                Добави нова снимка
            </Button>
          </div>
        </CardHeader>
        <CardContent>
           <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm h-[450px]">
              <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                  Тази секция е в процес на разработка
                </h3>
                <p className="text-sm text-muted-foreground">
                  Скоро ще можете да управлявате галерията оттук.
                </p>
              </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
