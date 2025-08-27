import type { SVGProps } from "react";

export function HorseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 16l1-9 4-1 4 1 1 9M9 20l2-8h2l2 8" />
      <path d="M12 3v2M9 12h6" />
      <path d="M5.5 12h13" />
      <path d="M8 3s-1.5 2.5-3 3.5c-2 1.33-3 3.5-3 5.5" />
      <path d="M16 3s1.5 2.5 3 3.5c2 1.33 3 3.5 3 5.5" />
    </svg>
  );
}
