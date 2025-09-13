
'use client';

import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";
import type { Partner } from "@/lib/types";

export function PartnersSection({ partners }: { partners: Partner[] }) {
    const { text } = useLanguage();

    if (partners.length === 0) {
        return null;
    }

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
                    <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-[scroll_40s_linear_infinite]" style={{'--logo-count': partners.length} as React.CSSProperties}>
                        {[...partners, ...partners].map((p, index) => (
                            <li key={`${p.id}-${index}`} className="flex flex-col items-center gap-2">
                                <Image
                                    src={p.logo_url}
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
