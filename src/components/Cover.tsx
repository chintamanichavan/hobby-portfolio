import { useRef, useState } from 'react';
import { deskObjects, journal } from '../data/desk';
import type { DeskObject } from '../data/desk';
import styles from './Cover.module.css';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** How long the cover takes to swing away; matches the animation in Cover.module.css. */
const OPEN_MS = 950;

interface Props {
  /** Called at once when a section's object is picked, so the right page is ready. */
  onPick: (to: string) => void;
  /** Called when the cover has swung away. */
  onOpened: () => void;
}

function place(o: DeskObject): React.CSSProperties {
  return { '--x': o.at[0], '--y': o.at[1], '--w': o.size[0], '--h': o.size[1], '--depth': o.depth } as React.CSSProperties;
}

/**
 * The first thing a visitor sees: the closed journal on the pale ground, with
 * a few things lying around it. Picking one up, or the journal itself, swings
 * the cover away and lets the page underneath arrive.
 */
export default function Cover({ onPick, onOpened }: Props) {
  const ground = useRef<HTMLDivElement>(null);
  const [opening, setOpening] = useState(false);

  const open = (to?: string) => {
    if (opening) return;
    if (to) onPick(to);
    if (REDUCED_MOTION) return onOpened();
    setOpening(true);
    setTimeout(onOpened, OPEN_MS);
  };

  // Everything drifts a few pixels with the pointer, nearer things more.
  const drift = (e: React.MouseEvent) => {
    if (REDUCED_MOTION) return;
    ground.current?.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5).toFixed(3));
    ground.current?.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5).toFixed(3));
  };

  return (
    <div ref={ground} className={opening ? `${styles.cover} ${styles.opening}` : styles.cover} onMouseMove={drift}>
      <p className={styles.hint}>pick something up,<br />or open the journal</p>

      <div className={styles.layout}>
        <div className={`${styles.thing} ${styles.journal}`} style={place(journal)}>
          <img src="/media/desk/journal.webp" alt="" draggable={false} />
          <button className={styles.pick} onClick={() => open()} aria-label="Open the journal" />
        </div>

        {deskObjects.map((o) => (
          <div key={o.name} className={styles.thing} style={place(o)}>
            <img src={`/media/desk/${o.name}.webp`} alt="" draggable={false} />
            {o.to && (
              <button className={styles.pick} onClick={() => open(o.to)}>
                <span className={styles.label}>{o.label}</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
