import { US_OUTLINE } from '../data/usOutline';

const RAD = Math.PI / 180;

// Albers equal-area conic with the same settings as the outline's frame
// (d3.geoAlbersUsa lower 48, scale 1300, centred in 975 x 610).
const N = (Math.sin(29.5 * RAD) + Math.sin(45.5 * RAD)) / 2;
const C = Math.cos(29.5 * RAD) ** 2 + 2 * N * Math.sin(29.5 * RAD);
const R0 = Math.sqrt(C) / N;

function raw(lat: number, lon: number): [number, number] {
  const r = Math.sqrt(C - 2 * N * Math.sin(lat * RAD)) / N;
  const theta = N * (lon + 96) * RAD;
  return [r * Math.sin(theta), R0 - r * Math.cos(theta)];
}

const CENTER = raw(38.7, -96.6);

/** Latitude and longitude to a point in the outline's 975 x 610 frame. */
function project(lat: number, lon: number): [number, number] {
  const [x, y] = raw(lat, lon);
  return [487.5 + 1300 * (x - CENTER[0]), 305 - 1300 * (y - CENTER[1])];
}

interface Props {
  /** Places to mark strongly, as [latitude, longitude]. */
  pins: [number, number][];
  /** Other places in the journal, drawn faintly for context. */
  faint?: [number, number][];
  className?: string;
}

/** A pen sketch of the lower 48 with the journal's places marked. */
export default function UsMap({ pins, faint = [], className }: Props) {
  return (
    <svg viewBox="0 0 975 610" className={className} role="img" aria-label="Sketch map of the United States with places marked">
      <filter id="map-wobble">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="7" />
        <feDisplacementMap in="SourceGraphic" scale="9" />
      </filter>
      <path d={US_OUTLINE} fill="none" stroke="var(--ink-soft)" strokeWidth="1.3" strokeLinejoin="round"
            vectorEffect="non-scaling-stroke" filter="url(#map-wobble)" />
      {faint.map(([lat, lon], i) => {
        const [x, y] = project(lat, lon);
        return <circle key={`f${i}`} cx={x} cy={y} r="6" fill="var(--ink-soft)" opacity="0.35" />;
      })}
      {pins.map(([lat, lon], i) => {
        const [x, y] = project(lat, lon);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="17" fill="none" stroke="var(--rust)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
            <circle cx={x} cy={y} r="7" fill="var(--rust)" />
          </g>
        );
      })}
    </svg>
  );
}
