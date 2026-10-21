import { useRef, useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Spread from '../components/Spread';
import { paintings } from '../data/paintings';
import type { Painting as Work } from '../types';
import styles from './Painting.module.css';

/** The painting's proportions, its width in centimetres for the wall, and its shape for the easel. */
function sized(p: Work): React.CSSProperties {
  return { '--cm': p.size[0], '--ratio': p.size[0] / p.size[1] } as React.CSSProperties;
}

/** Watercolours on paper hang behind a mat; canvases hang in a bare frame. */
function frameOf(p: Work): string {
  return p.medium.includes('paper') ? `${styles.frame} ${styles.matted}` : styles.frame;
}

/** One painting on the easel, close up, with its label; the whole wall beside it, at true relative size. */
export default function Painting() {
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(false);
  const easel = useRef<HTMLDivElement>(null);

  const work = paintings[n];
  if (!work) return null;

  const pick = (i: number) => {
    setN(i);
    // On a narrow screen the easel is above the wall, out of sight.
    if (easel.current && easel.current.getBoundingClientRect().top < 0) easel.current.scrollIntoView({ block: 'start' });
  };

  const head = (
    <>
      <p className={styles.kicker}>on the wall</p>
      <h1 className={styles.title}>Painting</h1>
      <p className={styles.lede}>Mostly watercolour, some oil. I paint the places I would go back to.</p>
    </>
  );

  const onEasel = (
    <div ref={easel} className={styles.easel}>
      <button key={work.id} className={`${frameOf(work)} ${styles.big}`} style={sized(work)} onClick={() => setOpen(true)} aria-label={`Look closer at ${work.title}`}>
        <img src={work.src} alt={work.alt} />
      </button>

      <div className={styles.label}>
        <p className={styles.number}>no. {n + 1} of {paintings.length}</p>
        <h2 className={styles.workTitle}>{work.title}</h2>
        <p className={styles.facts}>{work.medium} · {work.size[0]} × {work.size[1]} cm · {work.year}</p>
        {work.note && <p className={styles.note}>{work.note}</p>}
      </div>

      <nav className={styles.turns} aria-label="Paintings">
        <button className={styles.turn} onClick={() => setN(n - 1)} disabled={n === 0}>← before</button>
        <button className={styles.turn} onClick={() => setN(n + 1)} disabled={n === paintings.length - 1}>next →</button>
      </nav>
    </div>
  );

  const wall = (
    <div className={styles.wall}>
      <p className={styles.wallNote}>the wall, every painting at its true size against the others</p>
      <ul className={styles.hung}>
        {paintings.map((p, i) => (
          <li key={p.id} className={styles.hook}>
            <button
              className={i === n ? `${frameOf(p)} ${styles.here}` : frameOf(p)}
              style={sized(p)}
              onClick={() => pick(i)}
              aria-label={`${p.title}, ${p.medium.toLowerCase()}, ${p.year}`}
              aria-current={i === n}
            >
              <img src={p.src} alt="" loading="lazy" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <>
      <Spread head={head} section="/painting" left={onEasel} right={wall} />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={n}
        on={{ view: ({ index }) => setN(index) }}
        slides={paintings.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </>
  );
}
