import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSiteContent } from '@/lib/data';
import { Users, Goal, History } from 'lucide-react';

// Make the component async to fetch data on the server
export default async function AboutPage() {

  // Fetch dynamic content
  const historyContent = await getSiteContent('about_history');
  const missionContent = await getSiteContent('about_mission');
  const teamContent = await getSiteContent('about_team_text');

  const sections = [
    {
      icon: <History className="h-10 w-10 text-primary" />,
      title: 'Нашата история',
      content: historyContent,
      className: 'md:col-span-2',
    },
    {
      icon: <Goal className="h-10 w-10 text-primary" />,
      title: 'Нашата мисия',
      content: missionContent,
      className: 'md:col-span-1',
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: 'Нашият екип',
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
          title="За комисията"
          description="Научете повече за нашата история, мисия и хората, които стоят зад Националната комисия за български конни надбягвания."
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
                {section.title !== 'Нашият екип' ? (
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
