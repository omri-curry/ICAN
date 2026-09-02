import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { AccountMenu } from "@/components/layout/account-menu";
import { BellIcon, BriefcaseIcon, HomeIcon, MessageIcon, PlusIcon, UserIcon } from "@/components/ui/icons";
import { requireAuthSession } from "@/server/auth/session";

type AppShellProps = Readonly<{
  children: ReactNode;
  activeSection?: "home" | "deals" | "new";
}>;

export async function AppShell({ children, activeSection = "home" }: AppShellProps) {
  const session = await requireAuthSession();
  const navigation = [
    { label: "ראשי", icon: HomeIcon, href: "/", section: "home" },
    { label: "עסקאות", icon: BriefcaseIcon, href: "/deals", section: "deals" },
    { label: "עסקה חדשה", icon: PlusIcon, href: "/deals/new", section: "new", emphasized: true },
    { label: "פניות", icon: MessageIcon, href: "#פניות", section: "requests", badge: "2" },
    { label: "פרופיל", icon: UserIcon, href: "#פרופיל", section: "profile" },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block"><Image src="/ican-logo.png" alt="ICAN א.י.ק.נ בע״מ" width={314} height={116} priority /></div>
        <nav aria-label="ניווט ראשי"><p className="nav-label">תפריט ראשי</p>{navigation.map(({ label, icon: Icon, href, section, emphasized, badge }) => { const active = activeSection === section; return <Link href={href} aria-current={active ? "page" : undefined} className={`${active ? "active " : ""}${emphasized ? "emphasized" : ""}`} key={label}><Icon /><span>{label}</span>{badge ? <b>{badge}</b> : null}</Link>; })}</nav>
        <div className="sidebar-footer">
          <div className="portal-signature"><span>ICAN</span><p>פורטל משרדי מימון</p><small>סביבת עבודה מאובטחת</small></div>
          <a className="technology-credit" href="https://comigo.io" target="_blank" rel="noreferrer" aria-label="Developed by Comigo — פתיחת אתר Comigo">
            <Image src="/comigo-mark.webp" alt="" width={53} height={49} />
            <span><small>Developed by</small><strong>Comigo</strong></span>
          </a>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand"><Image src="/ican-logo.png" alt="ICAN" width={157} height={58} /></div>
          <div className="office-identity"><span>משרד מימון</span><strong>{session.officeName}</strong></div>
          <div className="account-area"><button className="notification-button" type="button" aria-label="התראות"><BellIcon /><i /></button><span className="topbar-divider" /><AccountMenu officeName={session.officeName} contactName={session.contactName} /></div>
        </header>
        <main>{children}</main>
        <nav className="mobile-nav" aria-label="ניווט ראשי במובייל">{navigation.map(({ label, icon: Icon, href, section, badge }) => { const active = activeSection === section; return <Link href={href} aria-current={active ? "page" : undefined} className={active ? "active" : ""} key={label}><span><Icon />{badge ? <b>{badge}</b> : null}</span><small>{label}</small></Link>; })}</nav>
      </div>
    </div>
  );
}
