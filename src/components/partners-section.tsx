
'use client';

import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";

const partnerLogos = [
    { name: 'GKDEV', logoUrl: 'https://storage.googleapis.com/stabl-media/65942d99-5d46-4458-9a48-18e38a202dff.png' },
    { name: 'YouTube', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1280px-YouTube_Logo_2017.svg.png' },
    { name: 'Meta', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Meta-Logo.png' },
    { name: 'Starbucks', logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png' },
    { name: 'Община Търговище', logoUrl: 'https://storage.googleapis.com/stabl-media/e1418f77-3e5f-40e8-b193-a4e985873995.png' },
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
                            <li key={`${p.name}-${index}`} className="flex flex-col items-center gap-2">
                                <Image
                                    src={p.logoUrl}
                                    alt={p.name}
                                    width={150}
                                    height={60}
                                    className="object-contain h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
                                />
                                <span className="text-sm font-medium text-muted-foreground">{p.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
