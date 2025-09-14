
import { notFound } from 'next/navigation';
import { getNewsPost } from '@/lib/server/data';
import { NewsPostClientPage } from './components/news-post-client-page';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getNewsPost(params.id);

  if (!post) {
    return {
      title: 'Новината не е намерена',
      description: 'Страницата, която се опитвате да достъпите, не съществува.',
    }
  }

  return {
    title: `${post.title} | НКБКН`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  }
}

export default async function NewsPostPage({ params }: { params: { id: string } }) {
  const post = await getNewsPost(params.id);

  if (!post) {
    notFound();
  }

  return <NewsPostClientPage post={post} />;
}
