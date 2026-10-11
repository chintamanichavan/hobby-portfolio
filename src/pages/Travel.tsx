import { useState } from 'react';
import Spread from '../components/Spread';
import { travelEntries } from '../data/travel';
import styles from './Travel.module.css';

/** Postcards on the left page; the letter from the one you pick is on the right. */
export default function Travel() {
  const [activeId, setActiveId] = useState(travelEntries[0]?.id);
  const active = travelEntries.find((e) => e.id === activeId);

  const head = (
    <>
      <p className={styles.eyebrow}>postcards home</p>
      <h1 className={styles.title}>Travel</h1>
      <p className={styles.subtitle}>I haven't been many places. But these ones stuck.</p>
    </>
  );

  const postcards = (
    <>
      <div className={styles.entries}>
        {travelEntries.map((entry) => (
          <button
            key={entry.id}
            className={entry.id === activeId ? `${styles.card} ${styles.cardActive}` : styles.card}
            onClick={() => setActiveId(entry.id)}
          >
            <div className={styles.cardImage}>
              <img src={entry.coverImage} alt={entry.destination} loading="lazy" />
            </div>
            <div className={styles.cardContent}>
              <span className={styles.postage} aria-hidden="true">
                <span className={styles.postmark}>{entry.country}<br />{entry.year}</span>
                <span className={styles.stamp}>{entry.year}</span>
              </span>
              <h2 className={styles.cardTitle}>{entry.destination}</h2>
              <span className={styles.readMore}>
                {entry.id === activeId ? 'reading →' : 'turn over →'}
              </span>
            </div>
          </button>
        ))}
      </div>
    </>
  );

  const letter = active && (
    <article key={active.id} className={styles.letter}>
      <p className={styles.eyebrow}>{active.country} · {active.year}</p>
      <h2 className={styles.articleTitle}>{active.destination}</h2>
      <p className={styles.excerpt}>{active.excerpt}</p>
      <div className={styles.tags}>
        {active.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
      </div>
      <div className={styles.prose}>
        {active.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)}
      </div>
    </article>
  );

  return <Spread head={head} section="/travel" left={postcards} right={letter} />;
}
