import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { photos } from '../data/photos';
import styles from './Photography.module.css';

export default function Photography() {
  const [index, setIndex] = useState(-1);

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Visual</p>
        <h1 className={styles.title}>Photography</h1>
        <p className={styles.subtitle}>I photograph to remember what I noticed.</p>
      </header>

      <div className={styles.grid}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            className={styles.photoWrap}
            onClick={() => setIndex(i)}
            aria-label={`View ${photo.alt}`}
          >
            <img src={photo.src} alt={photo.alt} className={styles.photo} loading="lazy" />
            <div className={styles.overlay}>
              <span className={styles.location}>{photo.location}, {photo.year}</span>
              {photo.caption && <span className={styles.caption}>{photo.caption}</span>}
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </main>
  );
}
