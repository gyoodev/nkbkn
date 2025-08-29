'use client';

import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";

const partnerLogos = [
    { name: 'Partner 1', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner1' },
    { name: 'Partner 2', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner2' },
    { name: 'Partner 3', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner3' },
    { name: 'Partner 4', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner4' },
    { name: 'Partner 5', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner5' },
    { name: 'Partner 6', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner6' },
    { name: 'Partner 7', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner7' },
    { name: 'Partner 8', logoUrl: 'https://placehold.co/150x60/gray/white?text=Partner8' },
];

export function PartnersSection() {
    const { text } = useLanguage();

    return (
        <section className="py-12 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {text.ourTrustedPartners}
                    </h2>
                </div>
                 <div
                  className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
                >
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-[scroll_40s_linear_infinite]" style={{'--logo-count': partnerLogos.length} as React.CSSProperties}>
                        {[...partnerLogos, ...partnerLogos].map((p, index) => (
                            <li key={`${p.name}-${index}`}>
                                <Image
                                    src={p.logoUrl}
                                    alt={p.name}
                                    width={150}
                                    height={60}
                                    className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}