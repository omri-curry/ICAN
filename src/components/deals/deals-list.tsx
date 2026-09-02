"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/ui/icons";
import { formatCurrency, formatDate, formatDateTime, type Deal, type DealStatus } from "@/data/mocks/deals";
import { StatusBadge } from "./status-badge";

type StatusFilter = "all" | DealStatus;

export function DealsList({ deals }: Readonly<{ deals: ReadonlyArray<Deal> }>) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredDeals = useMemo(() => {
    const normalizedQuery = query.replace(/\s|#/g, "");
    return deals.filter((deal) => {
      const matchesQuery = !normalizedQuery || deal.id.includes(normalizedQuery);
      const matchesStatus = status === "all" || deal.status === status;
      const matchesFrom = !dateFrom || deal.createdAt >= dateFrom;
      const matchesTo = !dateTo || deal.createdAt <= dateTo;
      return matchesQuery && matchesStatus && matchesFrom && matchesTo;
    });
  }, [dateFrom, dateTo, deals, query, status]);

  function openDeal(id: string) {
    router.push(`/deals/${id}`);
  }

  return (
    <>
      <section className="deal-filters" aria-label="חיפוש וסינון עסקאות">
        <label className="search-field"><span>חיפוש</span><div><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></svg><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="חיפוש לפי מספר עסקה" inputMode="numeric" /></div></label>
        <label><span>סטטוס</span><select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}><option value="all">הכל</option><option value="in_progress">בטיפול</option><option value="needs_completion">ממתין להשלמות</option><option value="approved">אושרה</option><option value="completed">בוצעה</option><option value="rejected">נדחתה</option></select></label>
        <fieldset><legend>טווח תאריכים</legend><div className="date-range"><label><span className="sr-only">מתאריך</span><input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="מתאריך" /></label><i>–</i><label><span className="sr-only">עד תאריך</span><input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="עד תאריך" /></label></div></fieldset>
        <button type="button" className="clear-filters" onClick={() => { setQuery(""); setStatus("all"); setDateFrom(""); setDateTo(""); }} disabled={!query && status === "all" && !dateFrom && !dateTo}>ניקוי סינון</button>
      </section>

      <div className="results-meta"><strong>מציג {filteredDeals.length} עסקאות</strong><span>מתוך {deals.length} עסקאות</span></div>

      {filteredDeals.length ? <>
        <section className="panel deals-table-panel" aria-label="רשימת עסקאות">
          <div className="table-scroll"><table className="deals-list-table"><thead><tr><th>מספר עסקה</th><th>תאריך פתיחה</th><th>סכום עסקה</th><th>מספר צ׳קים</th><th>סטטוס</th><th>עדכון אחרון</th><th><span className="sr-only">פעולה</span></th></tr></thead><tbody>{filteredDeals.map((deal) => <tr key={deal.id} tabIndex={0} onClick={() => openDeal(deal.id)} onKeyDown={(event) => { if (event.key === "Enter") openDeal(deal.id); }} aria-label={`פתיחת עסקה ${deal.dealNumber}`}><td><strong dir="ltr">{deal.dealNumber}</strong></td><td dir="ltr">{formatDate(deal.createdAt)}</td><td><strong dir="ltr">{formatCurrency(deal.amount)}</strong></td><td>{deal.checkCount}</td><td><StatusBadge status={deal.status} /></td><td dir="ltr">{formatDateTime(deal.lastUpdated)}</td><td><Link href={`/deals/${deal.id}`} onClick={(event) => event.stopPropagation()}>צפייה בעסקה <ArrowIcon /></Link></td></tr>)}</tbody></table></div>
        </section>
        <section className="deal-cards" aria-label="רשימת עסקאות במובייל">{filteredDeals.map((deal) => <Link href={`/deals/${deal.id}`} className="deal-card" key={deal.id}><div className="deal-card-head"><strong dir="ltr">{deal.dealNumber}</strong><StatusBadge status={deal.status} /></div><dl><div><dt>סכום עסקה</dt><dd dir="ltr">{formatCurrency(deal.amount)}</dd></div><div><dt>תאריך פתיחה</dt><dd dir="ltr">{formatDate(deal.createdAt)}</dd></div><div><dt>מספר צ׳קים</dt><dd>{deal.checkCount}</dd></div><div><dt>עדכון אחרון</dt><dd dir="ltr">{formatDateTime(deal.lastUpdated)}</dd></div></dl><span className="deal-card-action">צפייה בעסקה <ArrowIcon /></span></Link>)}</section>
      </> : <section className="empty-deals"><strong>לא נמצאו עסקאות</strong><p>נסו לשנות את החיפוש או את הסינון שבחרתם.</p></section>}
    </>
  );
}
