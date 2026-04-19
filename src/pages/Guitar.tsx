import { useState } from 'react';
import { guitarEntries } from '../data/guitar';
import VideoModal from '../components/VideoModal';
import styles from './Guitar.module.css';

export default function Guitar() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Learning in public</p>
        <h1 className={styles.title}>Guitar</h1>
        <p className={styles.subtitle}>A honest record of learning from scratch. Slowly, badly, happily.</p>
      </header>

      <div className={styles.timeline}>
        {guitarEntries.map((entry, i) => (
          <div key={entry.id} className={styles.entry}>
            <div className={styles.timelineLeft}>
              <span className={styles.month}>{entry.month}</span>
              <div className={styles.dot} />
              {i < guitarEntries.length - 1 && <div className={styles.line} />}
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
                  <div className={styles.playBtn}>▶</div>
                ) : (
                  <div className={styles.soonBadge}>Video coming soon</div>
                )}
              </div>
              <div className={styles.cardBody}>
                <span className={styles.milestone}>{entry.milestone}</span>
                <h2 className={styles.cardTitle}>{entry.song}</h2>
                <p className={styles.cardNote}>{entry.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeVideo && (
        <VideoModal
          youtubeId={activeVideo.id}
          title={activeVideo.title}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </main>
  );
}
