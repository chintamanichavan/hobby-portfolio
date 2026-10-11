import { useState } from 'react';
import { cookingEntries } from '../data/cooking';
import VideoModal from '../components/VideoModal';
import Spread from '../components/Spread';
import styles from './Cooking.module.css';

export default function Cooking() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const half = Math.ceil(cookingEntries.length / 2);
  const entry = (entry: (typeof cookingEntries)[number]) => (
    <div
      key={entry.id}
      className={`${styles.card} ${!entry.youtubeId ? styles.cardSoon : ''}`}
      onClick={() => entry.youtubeId && setActiveVideo({ id: entry.youtubeId, title: entry.title })}
      role={entry.youtubeId ? 'button' : undefined}
      tabIndex={entry.youtubeId ? 0 : undefined}
    >
      <div className={styles.thumbnail}>
        <img src={entry.thumbnail} alt={entry.title} loading="lazy" />
        {entry.youtubeId ? (
          <div className={styles.playBtn}>play</div>
        ) : (
          <div className={styles.soonBadge}>video soon</div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.meta}>
          <span className={styles.duration}>{entry.duration}</span>
          <div className={styles.tags}>
            {entry.tags.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
          </div>
        </div>
        <h2 className={styles.cardTitle}>{entry.title}</h2>
        <p className={styles.cardDesc}>{entry.description}</p>
      </div>
    </div>
  );

  const head = (
    <>
      <p className={styles.eyebrow}>recipe cards</p>
      <h1 className={styles.title}>Cooking</h1>
      <p className={styles.subtitle}>Home recipes, experiments, and the occasional disaster.</p>
    </>
  );

  const first = (
    <div className={styles.grid}>{cookingEntries.slice(0, half).map(entry)}</div>
  );

  const rest = <div className={`${styles.grid} ${styles.onward}`}>{cookingEntries.slice(half).map(entry)}</div>;

  return (
    <>
      <Spread head={head} section="/cooking" left={first} right={rest} />
      {activeVideo && (
        <VideoModal
          youtubeId={activeVideo.id}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </>
  );
}
