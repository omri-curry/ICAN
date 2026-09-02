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
export const UploadIcon = (props: IconProps) => <IconBase {...props}><path d="M12 16V4M7.5 8.5 12 4l4.5 4.5"/><path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/></IconBase>;
export const BuildingIcon = (props: IconProps) => <IconBase {...props}><path d="M4 21V6l8-3 8 3v15M2 21h20M8 8h1M8 12h1M8 16h1M15 8h1M15 12h1M15 16h1M10 21v-3h4v3"/></IconBase>;
export const PhoneIcon = (props: IconProps) => <IconBase {...props}><path d="M7.2 3.5 10 7.8 7.9 10a16.8 16.8 0 0 0 6.1 6.1l2.2-2.1 4.3 2.8-.8 3.3c-.2.8-1 1.4-1.9 1.4A15.3 15.3 0 0 1 2.5 6.2c0-.9.6-1.7 1.4-1.9z"/></IconBase>;
export const ShieldIcon = (props: IconProps) => <IconBase {...props}><path d="M12 3 4.5 6v5.5c0 4.4 3 7.8 7.5 9.5 4.5-1.7 7.5-5.1 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/></IconBase>;
export const KeyIcon = (props: IconProps) => <IconBase {...props}><circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M15 8l2 2M17 6l2 2"/></IconBase>;
export const LogOutIcon = (props: IconProps) => <IconBase {...props}><path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/></IconBase>;
