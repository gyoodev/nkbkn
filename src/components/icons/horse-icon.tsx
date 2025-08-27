import type { SVGProps } from "react";

export function HorseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        <path d="M3.5 21a2.5 2.5 0 0 1-3-3.5 3 3 0 0 1 2-3c1-2 1-4 2-6l1-2c1-2 3-2 4-3l1 3c1 2-1 4-1 6-2 2-2 4-2 6" />
        <path d="M21.5 21a2.5 2.5 0 0 0-3-3.5 3 3 0 0 0-2-3c-1-2-1-4-2-6l-1-2c-1-2-3-2-4-3l-1 3c-1 2 1 4 1 6 2 2 2 4 2 6" />
        <path d="M7 10h11l2-2-2-2h-3" />
        <path d="M12 10V4.5a2.5 2.5 0 0 1 5 0V10" />
    </svg>
  );
}
