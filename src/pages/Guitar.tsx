import { useState } from 'react';
import { guitarEntries } from '../data/guitar';
import VideoModal from '../components/VideoModal';
import Spread from '../components/Spread';
import styles from './Guitar.module.css';

export default function Guitar() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const half = Math.ceil(guitarEntries.length / 2);
  const entry = (entry: (typeof guitarEntries)[number]) => (
    <div key={entry.id} className={styles.entry}>
      <div className={styles.timelineLeft}>
        <span className={styles.month}>{entry.month}</span>
        <div className={styles.dot} />
        <div className={styles.line} />
      </div>

      <div
        className={`${styles.card} ${!entry.youtubeId ? styles.cardSoon : ''}`}
        onClick={() => entry.youtubeId && setActiveVideo({ id: entry.youtubeId, title: entry.song })}
        role={entry.youtubeId ? 'button' : undefined}
        tabIndex={entry.youtubeId ? 0 : undefined}
      >
        <div className={styles.thumbnail}>
          <img src={entry.thumbnail} alt={entry.song} loading="lazy" />
          {entry.youtubeId ? (
            <div className={styles.playBtn}>play</div>
          ) : (
            <div className={styles.soonBadge}>video soon</div>
          )}
        </div>
        <div className={styles.cardBody}>
          <span className={styles.milestone}>{entry.milestone}</span>
          <h2 className={styles.cardTitle}>{entry.song}</h2>
          <p className={styles.cardNote}>{entry.note}</p>
        </div>
      </div>
    </div>
  );

  const head = (
    <>
      <p className={styles.eyebrow}>practice log</p>
      <h1 className={styles.title}>Guitar</h1>
      <p className={styles.subtitle}>A honest record of learning from scratch. Slowly, badly, happily.</p>
    </>
  );

  const first = (
    <div className={styles.timeline}>{guitarEntries.slice(0, half).map(entry)}</div>
  );

  const rest = <div className={styles.timeline}>{guitarEntries.slice(half).map(entry)}</div>;

  return (
    <>
      <Spread head={head} section="/guitar" left={first} right={rest} />
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
