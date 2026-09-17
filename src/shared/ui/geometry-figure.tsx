import type { MathTopic } from '../../entities/math-topic/model/types';

type Figure = NonNullable<MathTopic['figure']>;
const polygons: Partial<Record<Figure, string>> = {
  triangle: '120,20 30,135 210,135',
  quadrilateral: '70,25 205,55 175,135 35,115',
  square: '65,25 175,25 175,135 65,135',
  rectangle: '30,40 210,40 210,120 30,120',
  rhombus: '120,15 210,80 120,145 30,80',
  parallelogram: '65,30 210,30 175,130 30,130',
  trapezoid: '75,35 165,35 215,130 25,130',
  'right-triangle': '55,20 190,135 55,135',
};

export function GeometryFigure({
  kind,
  title,
  compact = false,
}: {
  kind: Figure;
  title: string;
  compact?: boolean;
}) {
  const round = kind === 'circle' || kind === 'disk';
  return (
    <svg
      className={compact ? 'geometry-figure compact-figure' : 'geometry-figure'}
      viewBox="0 0 240 160"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${title} — чертёж`}
    >
      <g
        stroke="currentColor"
        strokeWidth={compact ? 4 : 2}
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      >
        {round ? (
          <>
            <circle cx="120" cy="80" r="61" fill={kind === 'disk' ? '#ededed' : 'none'} />
            <path d="M120 80H181" strokeDasharray="5 5" />
            <circle cx="120" cy="80" r="2.5" fill="currentColor" />
          </>
        ) : (
          <polygon points={polygons[kind]} />
        )}
        {kind === 'right-triangle' && <path d="M55 120H70V135" />}
        {kind === 'square' && <path d="M65 120H80V135" />}
        {kind === 'rectangle' && <path d="M30 105H45V120" />}
        {kind === 'rhombus' && !compact && (
          <path d="M120 15V145M30 80H210" stroke="#999" strokeDasharray="5 5" strokeWidth="1.2" />
        )}
      </g>
      {!compact && round && (
        <g fill="currentColor" fontSize="14" fontFamily="YS Text, sans-serif">
          <text x="104" y="99">
            O
          </text>
          <text x="147" y="72">
            r
          </text>
        </g>
      )}
      {!compact && (kind === 'square' || kind === 'rectangle') && (
        <g fill="currentColor" fontSize="14" fontFamily="YS Text, sans-serif">
          <text x="117" y={kind === 'square' ? 153 : 142}>
            a
          </text>
          {kind === 'rectangle' && (
            <text x="220" y="84">
              b
            </text>
          )}
        </g>
      )}
    </svg>
  );
}
