import Link from "next/link";

export default function DealNotFound() {
  return <div className="deal-not-found"><p className="eyebrow">לא נמצא</p><h1>העסקה שחיפשתם אינה קיימת</h1><p>ייתכן שמספר העסקה שגוי או שהעסקה אינה זמינה לצפייה.</p><Link href="/deals">חזרה לכל העסקאות</Link></div>;
}
