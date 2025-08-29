'use client';

import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";

const partnerLogos = [
    { name: 'Partner 1', logoUrl: 'https://placehold.co/120x40/gray/white?text=Partner1' },
    { name: 'Partner 2', logoUrl: 'https://placehold.co/120x40/gray/white?text=Partner2' },
    { name: 'Partner 3', logoUrl: 'https://placehold.co/120x40/gray/white?text=Partner3' },
    { name: 'Partner 4', logoUrl: 'https://placehold.co/120x40/gray/white?text=Partner4' },
    { name: 'Partner 5', logoUrl: 'https://placehold.co/120x40/gray/white?text=Partner5' },
    { name: 'Partner 6', logoUrl: 'https://placehold.co/120x40/gray/white?text=Partner6' },
];

export function PartnersSection() {
    const { text } = useLanguage();

    return (
        <section className="py-12 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {text.ourTrustedPartners}
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
                    {partnerLogos.map(p => (
                        <div key={p.name} className="flex justify-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                            <Image
                                src={p.logoUrl}
                                alt={p.name}
                                width={120}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
