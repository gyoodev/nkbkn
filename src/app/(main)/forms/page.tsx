
'use client';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Horse, User, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function FormsPage() {
    const { text } = useLanguage();

    const formCards = [
        {
            title: "Регистрация на жокеи",
            description: "Добавете нов жокей към системата чрез администраторския панел.",
            href: "/admin/jockeys/new",
            icon: <User className="h-8 w-8 text-primary" />,
            buttonText: "Добави жокей"
        },
        {
            title: "Регистрация на треньори",
            description: "Добавете нов треньор към системата чрез администраторския панел.",
            href: "/admin/trainers/new",
            icon: <User className="h-8 w-8 text-primary" />,
            buttonText: "Добави треньор"
        },
        {
            title: "Регистрация на коне",
            description: "Добавете нов кон към системата, включително информация за собственик, произход и статистика.",
            href: "/admin/horses/new",
            icon: <Horse className="h-8 w-8 text-primary" />,
            buttonText: "Добави кон"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <PageHeader
                title="Управление на регистрации"
                description="Централизирано управление на жокеи, треньори и коне през административния панел."
            />
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {formCards.map((card, index) => (
                     <Card key={index} className="flex flex-col">
                        <CardHeader className="flex flex-row items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full">
                                {card.icon}
                            </div>
                            <div>
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-grow flex items-end">
                            <Button asChild className="w-full">
                                <Link href={card.href}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    {card.buttonText}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
