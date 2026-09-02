type DonutChartProps = Readonly<{
  segments: ReadonlyArray<{ label: string; percent: number; tone: string }>;
  centerValue: string;
  centerLabel: string;
  ariaLabel: string;
}>;

export function DonutChart({ segments, centerValue, centerLabel, ariaLabel }: DonutChartProps) {
  const stops = segments.map((segment, index) => {
    const start = segments.slice(0, index).reduce((total, item) => total + item.percent, 0);
    const end = start + segment.percent;
    return `${segment.tone} ${start}% ${end}%`;
  });

  return (
    <div className="donut-chart" role="img" aria-label={ariaLabel} style={{ background: `conic-gradient(${stops.join(", ")})` }}>
      <div><strong>{centerValue}</strong><span>{centerLabel}</span></div>
    </div>
  );
}
