import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export const HomeIcon = (props: IconProps) => <IconBase {...props}><path d="m3 11 9-8 9 8"/><path d="M5.5 9.5V21h13V9.5M9.5 21v-7h5v7"/></IconBase>;
export const BriefcaseIcon = (props: IconProps) => <IconBase {...props}><rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2"/></IconBase>;
export const PlusIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></IconBase>;
export const MessageIcon = (props: IconProps) => <IconBase {...props}><path d="M20 15a3 3 0 0 1-3 3H9l-5 3v-6a3 3 0 0 1-1-2V7a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3z"/></IconBase>;
export const UserIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="8" r="4"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/></IconBase>;
export const BellIcon = (props: IconProps) => <IconBase {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></IconBase>;
export const ChevronIcon = (props: IconProps) => <IconBase {...props}><path d="m9 10 3 3 3-3"/></IconBase>;
export const ArrowIcon = (props: IconProps) => <IconBase {...props}><path d="M5 12h14M14 7l5 5-5 5"/></IconBase>;
export const MenuIcon = (props: IconProps) => <IconBase {...props}><path d="M4 7h16M4 12h16M4 17h16"/></IconBase>;
export const WalletIcon = (props: IconProps) => <IconBase {...props}><path d="M4 6.5h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2h11"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/></IconBase>;
export const ActivityIcon = (props: IconProps) => <IconBase {...props}><path d="M3 12h4l2.3-6 4.1 12 2.2-6H21"/></IconBase>;
export const CheckCircleIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16.5 9"/></IconBase>;
export const ClockIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></IconBase>;
