
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
      <path d="M3.5 21h17" />
      <path d="M5.5 21v-2.3c0-.8.5-1.5 1.3-1.7l1.1-.4c.8-.2 1.6-.7 2.1-1.3l2.1-2.3C13.6 11.5 14 9.8 14 8V5c0-1.7-1.3-3-3-3H7.5c-.5 0-.9.2-1.2.6L3 7" />
      <path d="M14 5.2V11c0 1.2.4 2.3 1 3.2l1.5 2.1c.6.8 1.4 1.3 2.3 1.5l.9.3c.7.2 1.2.9 1.2 1.6V21" />
      <path d="M7.5 2c.4 2 .9 3.5 1.5 4.5" />
      <path d="M14 5.2c-1.5 1-2.5 2.7-3 4.3" />
    </svg>
  );
}
