import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginFlow } from "@/components/auth/login-flow";
import { ShieldIcon } from "@/components/ui/icons";
import { getAuthSession } from "@/server/auth/session";

export const metadata: Metadata = {
  title: "כניסה | פורטל משרדי המימון של ICAN",
  description: "כניסה מאובטחת לפורטל משרדי המימון של ICAN",
  robots: { index: false, follow: false },
};

type LoginPageProps = Readonly<{
  searchParams: Promise<{ returnTo?: string | string[] }>;
}>;

function safeReturnTo(value: string | string[] | undefined) {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate?.startsWith("/") && !candidate.startsWith("//") && !candidate.startsWith("/login")
    ? candidate
    : "/";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getAuthSession();
  if (session) redirect("/");
  const { returnTo } = await searchParams;

  return (
    <main className="login-page">
      <section className="login-frame" aria-label="כניסה לפורטל ICAN">
        <aside className="login-brand-panel">
          <div>
            <Image className="login-logo" src="/ican-logo.png" alt="ICAN א.י.ק.נ בע״מ" width={314} height={116} priority />
            <p className="login-brand-kicker">פורטל משרדי המימון</p>
            <h2>הפעילות הפיננסית שלכם.<br />בסביבה אחת, מסודרת ובטוחה.</h2>
            <div className="login-assurance"><ShieldIcon /><span><strong>גישה לאנשי קשר מורשים</strong><small>אימות דו־שלבי לפני הכניסה לפורטל</small></span></div>
          </div>
          <a className="login-technology-credit" href="https://comigo.io" target="_blank" rel="noreferrer" aria-label="פותח בטכנולוגיית Comigo — פתיחת אתר Comigo">
            <Image src="/comigo-mark.webp" alt="" width={53} height={49} />
            <span><small>פותח בטכנולוגיית</small><strong>Comigo</strong></span>
          </a>
        </aside>

        <section className="login-form-panel">
          <div className="login-mobile-logo"><Image src="/ican-logo.png" alt="ICAN" width={157} height={58} priority /></div>
          <LoginFlow returnTo={safeReturnTo(returnTo)} />
          <a className="login-mobile-credit" href="https://comigo.io" target="_blank" rel="noreferrer">
            <Image src="/comigo-mark.webp" alt="" width={53} height={49} />
            <span>פותח בטכנולוגיית <strong>Comigo</strong></span>
          </a>
        </section>
      </section>
    </main>
  );
}
