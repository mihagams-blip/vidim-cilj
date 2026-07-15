import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowUpRight(props: IconProps) {
  return <svg {...base} {...props}><path d="M7 17 17 7M8 7h9v9" /></svg>;
}

export function ArrowDown(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 4v15m-6-6 6 6 6-6" /></svg>;
}

export function Mail(props: IconProps) {
  return <svg {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m5 8 7 5 7-5" /></svg>;
}

export function MapPin(props: IconProps) {
  return <svg {...base} {...props}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}

export function Facebook(props: IconProps) {
  return <svg {...base} {...props}><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v6h4v-6h3l1-4h-4V9c0-.6.4-1 1-1Z" /></svg>;
}

export function Waves(props: IconProps) {
  return <svg {...base} {...props}><path d="M3 8c3-2 5-2 8 0s5 2 10 0M3 13c3-2 5-2 8 0s5 2 10 0M3 18c3-2 5-2 8 0s5 2 10 0" /></svg>;
}

export function Bike(props: IconProps) {
  return <svg {...base} {...props}><circle cx="5.5" cy="17" r="3.5" /><circle cx="18.5" cy="17" r="3.5" /><path d="m5.5 17 4-8h4l5 8M9 17h7.5M8 6h4" /></svg>;
}

export function Mountain(props: IconProps) {
  return <svg {...base} {...props}><path d="m3 19 6.5-12L13 13l2.5-4L21 19H3Z" /><path d="m8 10 2 2 1.4-1.4" /></svg>;
}

export function Spark(props: IconProps) {
  return <svg {...base} {...props}><path d="M12 2c.5 5.8 4.2 9.5 10 10-5.8.5-9.5 4.2-10 10-.5-5.8-4.2-9.5-10-10 5.8-.5 9.5-4.2 10-10Z" /></svg>;
}

export function Movement(props: IconProps) {
  return <svg {...base} {...props}><circle cx="12" cy="5" r="2" /><path d="m8 21 2-6-3-3 3-4 4 2 3 1M12 15l4 6M14 10l1-3" /></svg>;
}
