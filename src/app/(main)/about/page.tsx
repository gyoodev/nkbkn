
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContent } from '@/lib/client/data';
import { Users, Goal, History } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';

// Make the component async to fetch data on the server
export default function AboutPage() {
  const { text } = useLanguage();
  const [historyContent, setHistoryContent] = useState('');
  const [missionContent, setMissionContent] = useState('');
  const [teamContent, setTeamContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        const [history, mission, team] = await Promise.all([
            getSiteContent('about_history'),
            getSiteContent('about_mission'),
            getSiteContent('about_team_text'),
        ]);
        setHistoryContent(history);
        setMissionContent(mission);
        setTeamContent(team);
        setLoading(false);
    }
    fetchData();
  }, [])


  const sections = [
    {
      icon: <History className="h-10 w-10 text-primary" />,
      title: text.aboutHistoryTitle,
      content: historyContent,
      className: 'md:col-span-2',
    },
    {
      icon: <Goal className="h-10 w-10 text-primary" />,
      title: text.aboutMissionTitle,
      content: missionContent,
      className: 'md:col-span-1',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: text.aboutTeamTitle,
      content: teamContent,
      className: 'md:col-span-3',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gray-50/50 dark:bg-gray-950/50">
       <div
        className="absolute inset-0 z-0 opacity-5"
        style={{
          backgroundImage:
            'radial-gradient(circle at 25px 25px, hsl(var(--primary)) 2%, transparent 0%), radial-gradient(circle at 75px 75px, hsl(var(--primary)) 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
        />
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 relative z-10">
        <PageHeader
          title={text.aboutPageTitle}
          description={text.aboutPageDescription}
          className="text-center mb-12"
        />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {sections.map((section, index) => (
            <Card key={index} className={`transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl bg-background/80 backdrop-blur-sm border-border/50 ${section.className}`}>
              <CardHeader className="flex flex-col items-center text-center gap-4 p-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    {section.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 text-center">
                 {/* Use dangerouslySetInnerHTML for rich text from the history and mission sections */}
                {loading ? <p>Loading...</p> : section.title !== text.aboutTeamTitle ? (
                     <div className="text-base text-muted-foreground prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: section.content }} />
                ) : (
                     <p className="text-base text-muted-foreground">{section.content}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
