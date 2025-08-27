import type { SVGProps } from "react";

export function HorseLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      {...props}
    >
      <path d="M141.28,137.2,128,104l-13.28,33.2a12,12,0,0,0,1.8,11.84l4.24,5.4,4.24-5.4A12,12,0,0,0,141.28,137.2ZM216,64V208a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V64A16,16,0,0,1,56,48H200A16,16,0,0,1,216,64Zm-16,0H56V208H200Zm-60-24a12,12,0,0,0-12,12v8a12,12,0,0,0,24,0v-8A12,12,0,0,0,140,40Z"/>
    </svg>
  );
}
