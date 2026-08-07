

type DataPoint = {
  weekLabel: string;
  enrollments: number;
};

type EnrollmentTrendChartProps = {
  data: DataPoint[];
};

/**
 * Pure-CSS area chart showing weekly enrollment trend.
 * No charting library needed — rendered with SVG.
 */
export default function EnrollmentTrendChart({
  data,
}: EnrollmentTrendChartProps) {
  const maxValue = Math.max(...data.map((d) => d.enrollments), 1);

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 200;
  const paddingX = 0;
  const paddingY = 10;
  const graphWidth = chartWidth - paddingX * 2;
  const graphHeight = chartHeight - paddingY * 2;

  // Build SVG path points
  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * graphWidth;
    const y = paddingY + graphHeight - (d.enrollments / maxValue) * graphHeight;
    return { x, y };
  });

  // Line path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Area path (fill under the line)
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingY + graphHeight} L ${points[0].x} ${paddingY + graphHeight} Z`;

  // Y-axis tick values
  const yTicks = [0, Math.round(maxValue / 2), maxValue];

  return (
    <section className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-4 py-3 md:px-6 md:py-5">
        <h2 className="text-lg font-semibold text-customer-teal">
          Enrollment Trend
        </h2>
        <p className="mt-1 text-sm text-customer-charcoal">
          Weekly paid enrollments over the last 12 weeks
        </p>
      </div>

      {data.every((d) => d.enrollments === 0) ? (
        <div className="px-6 py-12 text-center text-sm text-neutral-500">
          No enrollment data yet. Trends will appear once students begin
          purchasing courses.
        </div>
      ) : (
        <div className="p-4 md:p-6">
          {/* SVG Chart */}
          <div className="relative">
            <svg
              viewBox={`-40 0 ${chartWidth + 50} ${chartHeight + 30}`}
              className="h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid lines */}
              {yTicks.map((tick, i) => {
                const y =
                  paddingY + graphHeight - (tick / maxValue) * graphHeight;
                return (
                  <g key={`grid-${i}`}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={paddingX + graphWidth}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-neutral-400 text-[11px]"
                    >
                      {tick}
                    </text>
                  </g>
                );
              })}

              {/* Gradient definition */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-customer-teal, #003366)"
                    stopOpacity="0.25"
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-customer-teal, #003366)"
                    stopOpacity="0.02"
                  />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path d={areaPath} fill="url(#areaGradient)" />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke="var(--color-customer-teal, #003366)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((p, i) => (
                <g key={`point-${i}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="white"
                    stroke="var(--color-customer-teal, #003366)"
                    strokeWidth="2"
                  />
                  {/* Value label on hover-visible dots */}
                  {data[i].enrollments > 0 && (
                    <text
                      x={p.x}
                      y={p.y - 12}
                      textAnchor="middle"
                      className="fill-customer-charcoal text-[10px] font-semibold"
                    >
                      {data[i].enrollments}
                    </text>
                  )}
                </g>
              ))}

              {/* X-axis labels */}
              {data.map((d, i) => {
                const x = paddingX + (i / (data.length - 1)) * graphWidth;
                // Show every other label on small screens
                const showLabel = i % 2 === 0 || i === data.length - 1;
                return showLabel ? (
                  <text
                    key={`label-${i}`}
                    x={x}
                    y={chartHeight + 18}
                    textAnchor="middle"
                    className="fill-neutral-400 text-[10px]"
                  >
                    {d.weekLabel}
                  </text>
                ) : null;
              })}
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
