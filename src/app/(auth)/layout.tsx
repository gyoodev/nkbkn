
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        {children}
      </div>
      <div className="relative hidden flex-1 items-center justify-center bg-primary/5 lg:flex">
         <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent"></div>
         <Image 
            src="https://picsum.photos/800/1000"
            alt="Person working on a laptop"
            width={400}
            height={500}
            className="relative z-10 rounded-2xl object-cover"
            data-ai-hint="person laptop"
         />
      </div>
    </div>
  );
}
