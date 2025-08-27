'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminCalendarPage() {
  return (
    <div>
      <PageHeader
        title="Управление на календара"
        description="Добавяйте, редактирайте и изтривайте събития от състезателния календар."
      />
       <Card className="mt-8">
        <CardHeader>
          <CardTitle>Календар</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="outline">
              Импортирай
            </Button>
            <Button size="sm">Добави събитие</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center rounded-lg border border-dashed shadow-sm h-[400px]">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Няма добавени събития
              </h3>
              <p className="text-sm text-muted-foreground">
                Можете да започнете, като добавите ново събитие.
              </p>
              <Button className="mt-4">Добави събитие</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
