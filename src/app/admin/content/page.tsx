'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/rich-text-editor';

export default function AdminContentPage() {
  const [historyContent, setHistoryContent] = useState(
    "Тук ще се появи текущият текст на страницата 'История'..."
  );
  const [missionContent, setMissionContent] = useState(
    "Тук ще се появи текущият текст на страницата 'Мисия'..."
  );

  return (
    <div>
      <PageHeader
        title="Управление на съдържанието"
        description="Редактирайте текстовете на страниците 'История', 'Мисия' и управлявайте екипа."
      />
      <div className="mt-8 grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>История</CardTitle>
            <CardDescription>Редактирайте съдържанието на страница "История".</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="history-text">Текст</Label>
              <RichTextEditor
                value={historyContent}
                onChange={setHistoryContent}
              />
            </div>
            <Button>Запази промените</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Мисия</CardTitle>
            <CardDescription>Редактирайте съдържанието на страница "Мисия".</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="mission-text">Текст</Label>
              <RichTextEditor
                value={missionContent}
                onChange={setMissionContent}
              />
            </div>
            <Button>Запази промените</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Екип</CardTitle>
            <CardDescription>Добавяйте, редактирайте и изтривайте членове на екипа.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end mb-4">
                <Button>Добави нов член</Button>
            </div>
            <div className="border rounded-md p-4">
                {/* Тук ще бъде списъкът с членове на екипа */}
                <p className="text-muted-foreground">Няма добавени членове на екипа.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
