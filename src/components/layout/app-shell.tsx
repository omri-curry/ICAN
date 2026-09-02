import type { ReactNode } from "react";
import Image from "next/image";
import { BellIcon, BriefcaseIcon, ChevronIcon, HomeIcon, MessageIcon, PlusIcon, UserIcon } from "@/components/ui/icons";
import { dashboardData } from "@/data/mocks/dashboard";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  const navigation = [
    { label: "ראשי", icon: HomeIcon, active: true },
    { label: "עסקאות", icon: BriefcaseIcon },
    { label: "עסקה חדשה", icon: PlusIcon, emphasized: true },
    { label: "פניות", icon: MessageIcon, badge: "2" },
    { label: "פרופיל", icon: UserIcon },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block"><Image src="/ican-logo.png" alt="ICAN א.י.ק.נ בע״מ" width={314} height={116} priority /></div>
        <nav aria-label="ניווט ראשי"><p className="nav-label">תפריט ראשי</p>{navigation.map(({ label, icon: Icon, active, emphasized, badge }) => <a href={active ? "/" : `#${label}`} aria-current={active ? "page" : undefined} className={`${active ? "active " : ""}${emphasized ? "emphasized" : ""}`} key={label}><Icon /><span>{label}</span>{badge ? <b>{badge}</b> : null}</a>)}</nav>
        <div className="sidebar-footer"><span>ICAN</span><p>פורטל משרדי מימון</p><small>סביבת עבודה מאובטחת</small></div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><Image src="/ican-logo.png" alt="ICAN" width={157} height={58} /></div>
          <div className="office-identity"><span>משרד מימון</span><strong>{dashboardData.office.name}</strong></div>
          <div className="account-area"><button className="notification-button" type="button" aria-label="התראות"><BellIcon /><i /></button><span className="topbar-divider" /><button className="account-button" type="button" aria-label="תפריט משתמש"><span className="avatar">יי</span><span><small>משתמש</small><strong>{dashboardData.office.userName}</strong></span><ChevronIcon /></button></div>
        </header>
        <main>{children}</main>
        <nav className="mobile-nav" aria-label="ניווט ראשי במובייל">{navigation.map(({ label, icon: Icon, active, badge }) => <a href={active ? "/" : `#${label}`} aria-current={active ? "page" : undefined} className={active ? "active" : ""} key={label}><span><Icon />{badge ? <b>{badge}</b> : null}</span><small>{label}</small></a>)}</nav>
      </div>
    </div>
  );
}
