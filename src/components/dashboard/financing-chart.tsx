type FinancingChartProps = Readonly<{
  data: ReadonlyArray<{ month: string; value: number }>;
}>;

const width = 680;
const height = 230;
const padding = { top: 18, right: 18, bottom: 38, left: 52 };
const maxValue = 1200000;

export function FinancingChart({ data }: FinancingChartProps) {
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const points = data.map((item, index) => ({
    ...item,
    x: padding.left + (index * chartWidth) / (data.length - 1),
    y: padding.top + chartHeight - (item.value / maxValue) * chartHeight,
  }));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const area = `${line} L ${points.at(-1)?.x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className="chart-wrap" aria-label="תרשים היקפי מימון חודשיים, ינואר עד יוני">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby="chart-title chart-desc">
        <title id="chart-title">היקף מימון חודשי</title>
        <desc id="chart-desc">עלייה מ־620 אלף שקלים בינואר ל־1.05 מיליון שקלים ביוני</desc>
        <defs>
          <linearGradient id="chartArea" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#5f86a0" stopOpacity="0.26" />
            <stop offset="72%" stopColor="#5f86a0" stopOpacity="0.07" />
            <stop offset="100%" stopColor="#5f86a0" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {[0, 300000, 600000, 900000, 1200000].map((value) => {
          const y = padding.top + chartHeight - (value / maxValue) * chartHeight;
          return <g key={value}><line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="chart-grid-line"/><text x={padding.left - 10} y={y + 4} textAnchor="end" className="chart-axis">{value === 0 ? "0" : `${value / 1000000}M`}</text></g>;
        })}
        <path d={area} fill="url(#chartArea)" />
        <path d={line} className="chart-data-line" />
        {points.map((point, index) => <g className="chart-point" tabIndex={0} role="img" aria-label={`${point.month}: ${point.value.toLocaleString("he-IL")} שקלים`} key={point.month}><circle cx={point.x} cy={point.y} r={index === points.length - 1 ? 6 : 4.5}/><g className="chart-tooltip" transform={`translate(${point.x - 38} ${point.y - 40})`}><rect width="76" height="28" rx="6"/><text x="38" y="18" textAnchor="middle">₪{Math.round(point.value / 1000)}K</text></g><text x={point.x} y={height - 11} textAnchor="middle" className="chart-label">{point.month}</text></g>)}
      </svg>
    </div>
  );
}
