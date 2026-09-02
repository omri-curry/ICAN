import Link from "next/link";
import { ArrowIcon } from "@/components/ui/icons";
import { checkStatusLabels, dealStages, formatCurrency, formatDate, formatDateTime, type Deal } from "@/data/mocks/deals";
import { StatusBadge } from "./status-badge";

export function DealDetails({ deal }: Readonly<{ deal: Deal }>) {
  return (
    <div className="deal-workspace">
      <Link href="/deals" className="back-link"><ArrowIcon />חזרה לכל העסקאות</Link>
      <section className="deal-detail-heading">
        <div><p className="eyebrow">סביבת עסקה</p><h1>עסקה <bdi>{deal.dealNumber}</bdi></h1><p>כל המידע וההתקדמות של העסקה במקום אחד</p></div>
        <StatusBadge status={deal.status} />
      </section>

      <section className="deal-overview" aria-label="נתונים מרכזיים לעסקה">
        <article className="deal-overview-primary"><span>סכום עסקה</span><strong dir="ltr">{formatCurrency(deal.amount)}</strong></article>
        <article><span>תאריך פתיחה</span><strong dir="ltr">{formatDate(deal.createdAt)}</strong></article>
        <article><span>מספר צ׳קים</span><strong>{deal.checkCount}</strong></article>
        <article><span>סטטוס נוכחי</span><StatusBadge status={deal.status} /></article>
        <article><span>עדכון אחרון</span><strong dir="ltr">{formatDateTime(deal.lastUpdated)}</strong></article>
      </section>

      {deal.requiredActions.length > 0 ? <section className="required-action" aria-labelledby="required-action-title"><div className="required-action-icon">!</div><div><p>נדרשת פעולה מצדכם</p><h2 id="required-action-title">נדרשת השלמת מסמכים</h2>{deal.requiredActions.map((action) => <span key={action}>{action}</span>)}</div><button type="button" disabled>השלמת מסמך</button></section> : null}

      <section className="panel process-panel">
        <div className="detail-section-heading"><div><p className="section-kicker">התקדמות העסקה</p><h2>סטטוס ותהליך</h2></div><span>שלב {deal.currentStage + 1} מתוך {dealStages.length}</span></div>
        <ol className="deal-timeline">{dealStages.map((stage, index) => {
          const state = index < deal.currentStage || (deal.status === "completed" && index === deal.currentStage) ? "complete" : index === deal.currentStage ? "current" : "future";
          return <li className={state} key={stage}><div className="timeline-marker">{state === "complete" ? "✓" : index + 1}</div><span>{stage}</span>{state === "current" ? <small>{deal.status === "needs_completion" ? "ממתין לפעולה שלכם" : "השלב הנוכחי"}</small> : null}</li>;
        })}</ol>
        {deal.status === "rejected" ? <p className="timeline-note rejected-note">הטיפול בעסקה הסתיים בשלב בדיקת ICAN.</p> : null}
      </section>

      <section className="panel checks-detail-panel">
        <div className="detail-section-heading"><div><p className="section-kicker">מסמכי העסקה</p><h2>צ׳קים בעסקה</h2></div><span>{deal.checkCount} צ׳קים</span></div>
        <div className="checks-table-wrap"><table className="checks-table"><thead><tr><th>צ׳ק</th><th>מספר צ׳ק</th><th>סכום</th><th>תאריך פירעון</th><th>שם מושך</th><th>סטטוס</th><th><span className="sr-only">פעולה</span></th></tr></thead><tbody>{deal.checks.map((check, index) => <tr key={check.id}><td><strong>צ׳ק {index + 1}</strong></td><td dir="ltr">{check.checkNumber}</td><td><strong dir="ltr">{formatCurrency(check.amount)}</strong></td><td dir="ltr">{formatDate(check.dueDate)}</td><td>{check.drawerName}</td><td><span className={`check-status check-status-${check.status}`}><i />{checkStatusLabels[check.status]}</span></td><td>{check.status === "needs_completion" ? <button type="button" disabled>השלמת מסמך</button> : null}</td></tr>)}</tbody></table></div>
        <div className="check-cards">{deal.checks.map((check, index) => <article key={check.id}><div><strong>צ׳ק {index + 1}</strong><span className={`check-status check-status-${check.status}`}><i />{checkStatusLabels[check.status]}</span></div><dl><div><dt>מספר צ׳ק</dt><dd dir="ltr">{check.checkNumber}</dd></div><div><dt>סכום</dt><dd dir="ltr">{formatCurrency(check.amount)}</dd></div><div><dt>תאריך פירעון</dt><dd dir="ltr">{formatDate(check.dueDate)}</dd></div><div><dt>שם מושך</dt><dd>{check.drawerName}</dd></div></dl>{check.status === "needs_completion" ? <button type="button" disabled>השלמת מסמך</button> : null}</article>)}</div>
      </section>

      <section className="panel deal-summary-panel">
        <div className="detail-section-heading"><div><p className="section-kicker">מידע כללי</p><h2>פרטי העסקה</h2></div></div>
        <dl>{[
          ["סוג עסקה", deal.dealType], ["סכום כולל", formatCurrency(deal.amount)], ["מספר צ׳קים", String(deal.checkCount)],
          ["תאריך יצירה", formatDate(deal.createdAt)], ["משרד מימון", deal.financingOffice], ["איש קשר", deal.contactName],
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </section>
    </div>
  );
}
