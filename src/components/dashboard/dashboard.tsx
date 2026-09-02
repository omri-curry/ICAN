import { ArrowIcon } from "@/components/ui/icons";
import { dashboardData } from "@/data/mocks/dashboard";
import { FinancingChart } from "./financing-chart";
import { DonutChart } from "./donut-chart";

export function Dashboard() {
  const { office, kpis, annualTarget, monthlyActivity, pipeline, checksOverview, recentDeals, allDeals } = dashboardData;

  return (
    <div className="dashboard">
      <section className="page-heading">
        <div>
          <p className="eyebrow">סקירה יומית</p>
          <h1>שלום, {office.name}</h1>
          <p>תמונת מצב עדכנית של הפעילות שלכם מול ICAN</p>
        </div>
        <p className="last-updated"><span />עודכן לאחרונה: היום, 09:42</p>
      </section>

      <section className="kpi-grid" aria-label="מדדים מרכזיים">
        {kpis.map((kpi) => <article className={`kpi-card${kpi.featured ? " kpi-card-featured" : ""}`} key={kpi.label}>
          <p>{kpi.label}</p>
          <strong dir="ltr">{kpi.value}</strong>
          <div><span>{kpi.change}</span>{kpi.context}</div>
        </article>)}
      </section>

      <section className="insights-grid">
        <article className="panel target-panel">
          <div className="panel-heading"><div><p className="section-kicker">ביצועים אישיים</p><h2>יעד שנתי</h2></div><span className="month-chip">{annualTarget.period}</span></div>
          <div className="target-values"><strong dir="ltr">{annualTarget.current}</strong><span>מתוך <b dir="ltr">{annualTarget.goal}</b></span></div>
          <div className="progress-meta"><span>{annualTarget.remaining}</span><strong>{annualTarget.percent}%</strong></div>
          <div className="progress-track" role="progressbar" aria-valuenow={annualTarget.percent} aria-valuemin={0} aria-valuemax={100} aria-label={`${annualTarget.percent} אחוז מהיעד השנתי הושלמו`}><span style={{ width: `${annualTarget.percent}%` }} /></div>
          <div className="target-footer"><span>ביצוע שנתי: <b dir="ltr">{annualTarget.current}</b></span><span>נותרו 4 חודשים</span></div>
        </article>

        <article className="panel pipeline-panel">
          <div className="panel-heading"><div><p className="section-kicker">צבר נוכחי</p><h2>סטטוס עסקאות</h2></div><span className="pipeline-total">48 <small>עסקאות</small></span></div>
          <div className="pipeline-bar" aria-label="התפלגות סטטוס עסקאות">{pipeline.map((item) => <span key={item.label} style={{ flex: item.value, background: item.tone }} />)}</div>
          <div className="pipeline-list">{pipeline.map((item) => <div key={item.label}><span className="status-dot" style={{ background: item.tone }} /><span>{item.label}</span><strong>{item.value}</strong></div>)}</div>
        </article>
      </section>

      <section className="panel chart-panel">
        <div className="panel-heading"><div><p className="section-kicker">6 חודשים אחרונים</p><h2>פעילות מימון</h2></div><div className="chart-summary"><span>סה״כ בתקופה</span><strong dir="ltr">₪4.83M</strong></div></div>
        <FinancingChart data={monthlyActivity} />
      </section>

      <section className="checks-grid" aria-label="נתוני צ׳קים והחזרות">
        <article className="panel checks-panel">
          <div className="panel-heading"><div><p className="section-kicker">תיק צ׳קים</p><h2>סטטוס צ׳קים</h2></div><div className="return-kpi"><span>אחוז החזרות</span><strong dir="ltr">{checksOverview.returnedPercent}%</strong><small>9 מתוך {checksOverview.total} צ׳קים</small></div></div>
          <div className="donut-content">
            <DonutChart segments={checksOverview.statuses} centerValue={String(checksOverview.total)} centerLabel="סה״כ צ׳קים" ariaLabel="התפלגות סטטוס הצ׳קים" />
            <div className="donut-legend">{checksOverview.statuses.map((item) => <div key={item.label}><i style={{ background: item.tone }} /><span>{item.label}</span><strong>{item.value}</strong><small>{item.percent}%</small></div>)}</div>
          </div>
        </article>
        <article className="panel checks-panel">
          <div className="panel-heading"><div><p className="section-kicker">ניתוח החזרות</p><h2>סיבת חזרת צ׳קים</h2></div><span className="pipeline-total">9 <small>צ׳קים שחזרו</small></span></div>
          <div className="donut-content">
            <DonutChart segments={checksOverview.returnReasons} centerValue="9" centerLabel="החזרות" ariaLabel="התפלגות הסיבות לחזרת צ׳קים" />
            <div className="donut-legend">{checksOverview.returnReasons.map((item) => <div key={item.label}><i style={{ background: item.tone }} /><span>{item.label}</span><strong>{item.value}</strong><small>{item.percent}%</small></div>)}</div>
          </div>
        </article>
      </section>

      <section className="panel deals-panel">
        <div className="panel-heading deals-heading"><div><p className="section-kicker">צבר בתהליך</p><h2>עסקאות פעילות</h2></div><a href="#all-deals">לכל העסקאות <ArrowIcon /></a></div>
        <div className="table-scroll"><table><thead><tr><th>מספר עסקה</th><th>תאריך</th><th>סכום</th><th>מספר צ׳קים</th><th>סטטוס</th><th><span className="sr-only">פעולה</span></th></tr></thead><tbody>{recentDeals.map((deal) => <tr key={deal.id}><td><strong dir="ltr">{deal.id}</strong></td><td dir="ltr">{deal.date}</td><td><strong dir="ltr">{deal.amount}</strong></td><td>{deal.checks}</td><td><span className={`deal-status status-${deal.tone}`}><i />{deal.status}</span></td><td><a href={`#deal-${deal.id.slice(1)}`}>צפייה בעסקה <ArrowIcon /></a></td></tr>)}</tbody></table></div>
      </section>

      <section className="panel deals-panel all-deals-panel" id="all-deals">
        <div className="panel-heading deals-heading"><div><p className="section-kicker">היסטוריה מלאה</p><h2>כל העסקאות</h2></div><span className="table-count">{allDeals.length} עסקאות מוצגות</span></div>
        <div className="table-scroll"><table><thead><tr><th>מספר עסקה</th><th>פתיחת עסקה</th><th>סכום</th><th>סטטוס</th><th>שלב / סיבת עצירה</th><th>עדכון אחרון</th><th><span className="sr-only">פעולה</span></th></tr></thead><tbody>{allDeals.map((deal) => <tr key={deal.id}><td><strong dir="ltr">{deal.id}</strong></td><td dir="ltr">{deal.date}</td><td><strong dir="ltr">{deal.amount}</strong></td><td><span className={`deal-status status-${deal.tone}`}><i />{deal.status}</span></td><td>{deal.update}</td><td dir="ltr">{deal.updateDate}</td><td><a href={`#deal-${deal.id.slice(1)}`}>צפייה <ArrowIcon /></a></td></tr>)}</tbody></table></div>
      </section>
    </div>
  );
}
