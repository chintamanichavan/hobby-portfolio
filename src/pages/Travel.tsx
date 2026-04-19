import { useState } from 'react';
import { travelEntries } from '../data/travel';
import styles from './Travel.module.css';

export default function Travel() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = travelEntries.find((e) => e.id === activeId);

  if (active) {
    return (
      <main className={styles.article}>
        <button className={styles.back} onClick={() => setActiveId(null)}>
          ← All trips
        </button>
        <div className={styles.cover}>
          <img src={active.coverImage} alt={active.destination} />
        </div>
        <div className={styles.articleBody}>
          <p className={styles.eyebrow}>{active.country} · {active.year}</p>
          <h1 className={styles.articleTitle}>{active.destination}</h1>
          <p className={styles.excerpt}>{active.excerpt}</p>
          <div className={styles.tags}>
            {active.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
          <div className={styles.prose}>
            {active.body.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Places</p>
        <h1 className={styles.title}>Travel</h1>
        <p className={styles.subtitle}>I haven't been many places. But these ones stuck.</p>
      </header>

      <div className={styles.entries}>
        {travelEntries.map((entry) => (
          <button key={entry.id} className={styles.card} onClick={() => setActiveId(entry.id)}>
            <div className={styles.cardImage}>
              <img src={entry.coverImage} alt={entry.destination} loading="lazy" />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardMeta}>{entry.country} · {entry.year}</p>
              <h2 className={styles.cardTitle}>{entry.destination}</h2>
              <p className={styles.cardExcerpt}>{entry.excerpt}</p>
              <div className={styles.tags}>
                {entry.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
