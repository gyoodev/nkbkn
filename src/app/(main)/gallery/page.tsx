
'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { galleryImages } from '@/lib/data';
import { useLanguage } from '@/hooks/use-language';
import { PageHeader } from '@/components/page-header';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImageOff } from 'lucide-react';

export default function GalleryPage() {
  const { text } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={text.galleryPageTitle}
        description={text.galleryPageDescription}
      />
      <div className="mt-8">
        {galleryImages.length === 0 ? (
           <Alert>
              <ImageOff className="h-4 w-4" />
              <AlertTitle>Галерията е празна</AlertTitle>
              <AlertDescription>
                В момента няма качени снимки в системата.
              </AlertDescription>
            </Alert>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {galleryImages.map((image) => (
              <Card key={image.id} className="group overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative aspect-w-4 aspect-h-3">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={600}
                      height={400}
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      data-ai-hint={image.hint}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
