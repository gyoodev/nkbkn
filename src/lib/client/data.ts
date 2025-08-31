
'use client';

import type { Jockey, Trainer, Horse, Track, NewsPost, RaceEvent, Document, Result, Partner, SiteContent, Submission, SocialLink, ContactSubmission } from '@/lib/types';
import { createBrowserClient } from '../supabase/client';
import { format, subMonths, getYear, getMonth, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { bg } from 'date-fns/locale';


export async function getJockeys(): Promise<Jockey[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase.from('jockeys').select('id, name, wins, mounts, image_url').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching jockeys:', error.message);
            return [];
        }
        return (data || []).map(jockey => {
            const wins = jockey.wins || 0;
            const mounts = jockey.mounts || 0;
            const winRate = mounts > 0 ? ((wins / mounts) * 100).toFixed(1) + '%' : '0%';
            return {
                id: jockey.id,
                name: jockey.name,
                imageUrl: jockey.image_url,
                wins: wins,
                mounts: mounts,
                winRate: winRate,
            }
        });
    } catch (error: any) {
        console.error('Error in getJockeys:', error.message);
        return [];
    }
}

export async function getTrainers(): Promise<Trainer[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase.from('trainers').select('*').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching trainers:', error.message);
            return [];
        }
        return (data || []).map(trainer => ({
            id: trainer.id,
            name: trainer.name,
            image_url: trainer.image_url,
            achievements: Array.isArray(trainer.achievements) ? trainer.achievements : (typeof trainer.achievements === 'string' ? trainer.achievements.split(',').map((s: string) => s.trim()) : []),
            stats: {
                wins: trainer.wins || 0,
                mounts: trainer.mounts || 0,
            }
        }));
    } catch (error: any) {
        console.error('Error in getTrainers:', error.message);
        return [];
    }
}


export async function getHorses(): Promise<Horse[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase.from('horses').select('*').order('name', { ascending: true });
        if (error) {
            console.error('Error fetching horses:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error in getHorses:', e.message);
        return [];
    }
}

export const tracks: Track[] = [
    { id: 1, name: 'Хиподрум "Гецово"', location: 'с. Гецово, обл. Разград', description: '„Хиподрумът в момента е в изоставено състояние, но нашият екип вече работи активно по неговото възстановяване, за да бъде готов за Държавното първенство по конни надбягвания през сезон 2026. Следващата ни цел е да осигурим финансиране и подкрепа от общината за цялостното проектиране и пълно обновяване на съоръжението.“' },
];

export const galleryImages: { id: number; src: string; alt: string, hint: string }[] = [];


export async function getRaceEvents(): Promise<RaceEvent[]> {
    const supabase = createBrowserClient();
    try {
        const { data: events, error: eventsError } = await supabase
            .from('race_events')
            .select(`
                *,
                races (*)
            `)
            .order('date', { ascending: true });

        if (eventsError) {
            console.error('Error fetching race events:', eventsError.message);
            return [];
        }
        
        for (const event of events) {
            if (event.races) {
                event.races.sort((a, b) => a.time.localeCompare(b.time));
            }
        }

        return events as RaceEvent[];
    } catch (e: any) {
        console.error('Error in getRaceEvents:', e.message);
        return [];
    }
}


export async function getDocuments(): Promise<Document[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });
            
        if (error) {
            console.error('Error fetching documents:', error.message);
            return [];
        }

        return data.map(doc => {
            const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(doc.path);
            return {
                ...doc,
                href: publicUrl,
            }
        });
    } catch (e: any) {
        console.error('Error fetching documents:', e.message);
        return [];
    }
}

export async function getResults(): Promise<Result[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase.from('results').select('*').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching results:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error fetching results:', e.message);
        return [];
    }
}

export async function getPartners(): Promise<Partner[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: true });
        if (error) {
            console.error('Error fetching partners:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error fetching partners:', e.message);
        return [];
    }
}


export async function getDashboardStats() {
    const supabase = createBrowserClient();
    try {
        const [
            { count: horses },
            { count: jockeys },
            { count: trainers },
            { count: news },
            { count: events },
        ] = await Promise.all([
            supabase.from('horses').select('*', { count: 'exact', head: true }),
            supabase.from('jockeys').select('*', { count: 'exact', head: true }),
            supabase.from('trainers').select('*', { count: 'exact', head: true }),
            supabase.from('news_posts').select('*', { count: 'exact', head: true }),
            supabase.from('race_events').select('*', { count: 'exact', head: true }),
        ]);

        return {
            horses: horses ?? 0,
            jockeys: jockeys ?? 0,
            trainers: trainers ?? 0,
            news: news ?? 0,
            events: events ?? 0,
        }
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error.message);
        return {
            horses: 0,
            jockeys: 0,
            trainers: 0,
            news: 0,
            events: 0,
        };
    }
}

export async function getSocialLinks(): Promise<SocialLink[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase
            .from('social_links')
            .select('*')
            .order('id', { ascending: true });
        
        if (error) {
            console.error('Error fetching social links:', error.message);
            return [];
        }
        return data || [];
    } catch(e: any) {
        console.error('Error in getSocialLinks:', e.message);
        return [];
    }
}

export async function getSubmissions(): Promise<Submission[]> {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
        return [];
    }
    return data;
}

export async function getSiteContent(key: string): Promise<string> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase
            .from('site_content')
            .select('content')
            .eq('key', key)
            .single();

        if (error || !data) {
            if (error && error.code !== 'PGRST116') { // 'PGRST116' means no rows found
                console.error(`Error fetching site content for key "${key}":`, error.message);
            }
            return '';
        }
        return data.content || '';
    } catch (e: any) {
        console.error(`Error in getSiteContent for key "${key}":`, e.message);
        return '';
    }
}

async function getLikesForMonth(year: number, month: number, supabase: any): Promise<number> {
    const startDate = format(new Date(year, month, 1), 'yyyy-MM-dd');
    const endDate = format(new Date(year, month + 1, 0), 'yyyy-MM-dd');
    
    const { data, error } = await supabase
        .from('news_posts')
        .select('likes')
        .gte('date', startDate)
        .lte('date', endDate);

    if (error) {
        console.error(`Error fetching likes for ${year}-${month + 1}:`, error);
        return 0;
    }
    
    return data.reduce((acc: number, item: { likes: number | null }) => acc + (item.likes || 0), 0);
}


export async function getMonthlyActivityStats() {
    const supabase = createBrowserClient();
    const today = new Date();
    const last12Months = eachMonthOfInterval({
        start: subMonths(today, 11),
        end: today
    });

    const stats = await Promise.all(
        last12Months.map(async (monthDate) => {
            const year = getYear(monthDate);
            const month = getMonth(monthDate);
            const monthName = format(monthDate, 'LLL', { locale: bg });
            
            const { count: submissions } = await supabase
                .from('submissions')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', format(startOfMonth(monthDate), 'yyyy-MM-dd HH:mm:ss'))
                .lte('created_at', format(endOfMonth(monthDate), 'yyyy-MM-dd HH:mm:ss'));

             const likes = await getLikesForMonth(year, month, supabase);

            return {
                name: monthName,
                Харесвания: likes,
                Заявки: submissions ?? 0,
            };
        })
    );

    return stats;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching contact submissions:", error);
        return [];
    }
    return data;
}

export async function getNewsPosts(): Promise<NewsPost[]> {
    const supabase = createBrowserClient();
    try {
        const { data, error } = await supabase.from('news_posts').select('*').order('date', { ascending: false });
        if (error) {
            console.error('Error fetching news posts:', error.message);
            return [];
        }
        return (data || []).map(post => ({
            ...post,
            href: `/news/${post.id}`,
            comments: [], // Comments are not fetched in the list view
        }));
    } catch(e: any) {
        console.error('Error fetching news posts:', e.message);
        return [];
    }
}
