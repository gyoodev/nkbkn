
'use client';

import { useLanguage } from "@/hooks/use-language";

const partnerLogos = [
    { name: 'Amazon', logo: <AmazonLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'Apple', logo: <AppleLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'Facebook', logo: <FacebookLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'Square', logo: <SquareLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'Google', logo: <GoogleLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'Airbnb', logo: <AirbnbLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'PayPal', logo: <PayPalLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'React', logo: <ReactLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'Webflow', logo: <WebflowLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'VSCode', logo: <VSCodeLogo className="h-6 w-auto text-gray-500" /> },
    { name: 'YouTube', logo: <YouTubeLogo className="h-6 w-auto text-gray-500" /> },
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
                        <div key={p.name} className="flex justify-center">
                            {p.logo}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


// SVG Logo Components
function AmazonLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 102 31" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M72.4353 23.3592V10.2335H77.925V13.013H78.0847C78.9634 11.2357 81.1812 9.87399 84.1373 9.87399C88.6101 9.87399 90.9877 12.534 90.9877 16.7673V23.3592H85.4979V17.3262C85.4979 14.5467 84.2171 13.3756 81.9993 13.3756C79.8614 13.3756 77.925 14.6265 77.925 17.566V23.3592H72.4353Z" fill="currentColor"/>
        <path d="M57.6979 10.2335H63.1877V23.3592H57.6979V10.2335Z" fill="currentColor"/>
        <path d="M37.8943 10.2335H43.384V13.013H43.5437C44.4224 11.2357 46.6402 9.87399 49.5963 9.87399C54.0691 9.87399 56.4467 12.534 56.4467 16.7673V23.3592H50.9569V17.3262C50.9569 14.5467 49.6761 13.3756 47.4583 13.3756C45.3204 13.3756 43.384 14.6265 43.384 17.566V23.3592H37.8943V10.2335Z" fill="currentColor"/>
        <path d="M21.5714 23.3592L26.3424 10.2335H32.4309L24.5645 28.2917C23.606 30.409 21.8906 30.9678 20.2132 30.9678C19.6543 30.9678 19.3352 30.9678 18.9362 30.888C18.9362 30.888 18.9362 30.888 18.8563 30.888L19.495 27.8522C19.7342 27.932 20.0534 27.932 20.3726 27.932C21.1711 27.932 21.4903 27.4533 21.7295 26.9744L21.5714 23.3592Z" fill="currentColor"/>
        <path d="M92.7441 23.3592V10.2335H98.2338V23.3592H92.7441Z" fill="currentColor"/>
        <path d="M97.7543 20.1423C98.4735 19.3438 98.7927 18.3853 98.7927 17.2541C98.7927 15.1362 97.4321 13.7745 95.374 13.7745H91.5466V23.3592H95.4538C97.5917 23.3592 98.9523 21.9177 98.9523 20.0625C98.9523 18.8315 98.3934 17.873 97.435 17.1742L101.422 23.3592H102L97.7543 17.0145V20.1423Z" fill="currentColor"/>
        <path d="M0 16.7274V10.2335H12.986L10.6084 14.8091H5.49883V17.0071H9.89006L7.43265 21.5028H12.986L15.6831 16.7274H0Z" fill="currentColor"/>
        <path d="M21.7295 26.9744L24.8837 18.3055L21.8906 10.2335H16.0818L13.1457 18.3055L16.2999 26.9744C17.3382 29.5311 18.7786 30.9678 20.293 30.9678C20.8519 30.9678 21.2509 30.888 21.6499 30.7283L22.2887 27.6925C22.0495 27.7724 21.7295 27.8522 21.4903 27.8522C20.6116 27.8522 20.3724 27.3734 20.1332 26.8945L21.7295 26.9744Z" fill="currentColor"/>
        <path d="M83.8181 24.3175C83.1793 25.116 82.3808 25.4352 81.3425 25.4352C79.8281 25.4352 78.4675 24.4767 78.4675 22.4588V10.2335H83.9573V22.1394C83.9573 23.0979 84.4362 23.5768 85.1554 23.5768C85.7942 23.5768 86.1932 23.2576 86.5124" fill="currentColor"/>
    </svg>
  )
}
function AppleLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="currentColor"/>
    </svg>
  )
}
function FacebookLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 120 22" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M119.055 11.0003C119.055 5.20405 114.516 -0.000183105 108.72 -0.000183105C102.924 -0.000183105 98.3848 5.20405 98.3848 11.0003C98.3848 16.7965 102.924 22.0007 108.72 22.0007C114.516 22.0007 119.055 16.7965 119.055 11.0003ZM108.72 4.14816C106.666 4.14816 104.981 5.83279 104.981 7.88647V14.1141C104.981 16.1678 106.666 17.8524 108.72 17.8524C110.774 17.8524 112.459 16.1678 112.459 14.1141V7.88647C112.459 5.83279 110.774 4.14816 108.72 4.14816Z" fill="currentColor"/>
    </svg>
  )
}
function SquareLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M96.84 21.6C96.84 26.4 93.24 30 88.44 30C83.64 30 80.04 26.4 80.04 21.6C80.04 16.8 83.64 13.2 88.44 13.2C93.24 13.2 96.84 16.8 96.84 21.6ZM88.44 16.8C85.56 16.8 83.16 18.96 83.16 21.6C83.16 24.24 85.56 26.4 88.44 26.4C91.32 26.4 93.72 24.24 93.72 21.6C93.72 18.96 91.32 16.8 88.44 16.8Z" fill="currentColor"/>
    </svg>
  )
}
function GoogleLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16.92 13.2C13.56 13.2 10.8 15.96 10.8 19.32C10.8 22.68 13.56 25.44 16.92 25.44C19.08 25.44 20.64 24.36 21.36 23.04L19.2 21.84C18.84 22.68 18.12 23.4 16.92 23.4C15.24 23.4 13.92 21.84 13.92 19.32C13.92 16.8 15.24 15.24 16.92 15.24C18.12 15.24 18.84 15.96 19.2 16.8L21.36 15.6C20.64 14.28 19.08 13.2 16.92 13.2Z" fill="currentColor"/>
    </svg>
  )
}
function AirbnbLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M22.92 25.2C25.92 25.2 28.2 22.92 28.2 19.92C28.2 16.92 25.92 14.64 22.92 14.64C19.92 14.64 17.64 16.92 17.64 19.92C17.64 22.92 19.92 25.2 22.92 25.2ZM22.92 17.04C24.48 17.04 25.68 18.24 25.68 19.92C25.68 21.6 24.48 22.8 22.92 22.8C21.36 22.8 20.16 21.6 20.16 19.92C20.16 18.24 21.36 17.04 22.92 17.04Z" fill="currentColor"/>
    </svg>
  )
}
function PayPalLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M25.92 13.2H32.4L30.96 23.4H24.48L25.92 13.2Z" fill="currentColor"/>
    </svg>
  )
}
function ReactLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <circle cx="16" cy="16" r="16" fill="currentColor"/>
        <path d="M16 4.22217C9.5 4.22217 4 9.72217 4 16.2222C4 22.7222 9.5 28.2222 16 28.2222C22.5 28.2222 28 22.7222 28 16.2222C28 9.72217 22.5 4.22217 16 4.22217Z" stroke="white" strokeWidth="2"/>
    </svg>
  )
}
function WebflowLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z" fill="currentColor"/>
    </svg>
  )
}
function VSCodeLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16 0L0 16L16 32L32 16L16 0Z" fill="currentColor"/>
    </svg>
  )
}
function YouTubeLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="currentColor"/>
    </svg>
  )
}
