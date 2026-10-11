import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Spread from '../components/Spread';
import Thing from '../components/Thing';
import UsMap from '../components/UsMap';
import { albums, photos } from '../data/photos';
import styles from './Photography.module.css';

const ALL_PINS = albums.flatMap((a) => a.pins);

/** "36.06° N, 112.14° W" */
function coords([lat, lon]: [number, number]): string {
  return `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`;
}

/** One album at a time: field notes and a map on the left, its prints on the right. */
export default function Photography() {
  const [n, setN] = useState(0);
  // Index into the flat `photos` list, or -1 when the lightbox is closed.
  const [open, setOpen] = useState(-1);

  const album = albums[n];
  if (!album) return null;

  const places = [...new Set(album.photos.map((p) => p.location))];
  const isFall = album.note.includes('fall');
  const pin = album.pins[0];

  const head = (
    <>
      <p className={styles.kicker}>prints, laid out</p>
      <h1 className={styles.title}>Photography</h1>
      <p className={styles.lede}>I photograph to remember what I noticed.</p>
    </>
  );

  const notes = (
    // Keyed by album so the notes ease in again when you move on.
    <div key={n} className={styles.notes}>
      <p className={styles.albumNo}>album {n + 1} of {albums.length}</p>
      <h2 className={styles.albumTitle}>{album.title}</h2>
      <p className={styles.albumNote}>{album.note}</p>

      {pin && (
        <figure className={styles.map}>
          <UsMap pins={album.pins} faint={ALL_PINS} />
          <figcaption>{coords(pin)}</figcaption>
          {isFall && <Thing name="leaf-oak" scale={120} className={styles.leaf} />}
        </figure>
      )}

      <ul className={styles.places}>
        {places.map((place) => <li key={place}>{place}</li>)}
      </ul>

      <nav className={styles.turns} aria-label="Albums">
        <button className={styles.turn} onClick={() => setN(n - 1)} disabled={n === 0}>← before</button>
        <select className={styles.jump} value={n} onChange={(e) => setN(Number(e.target.value))} aria-label="Jump to album">
          {albums.map((a, i) => <option key={a.title} value={i}>{i + 1}. {a.title}</option>)}
        </select>
        <button className={styles.turn} onClick={() => setN(n + 1)} disabled={n === albums.length - 1}>next album →</button>
      </nav>
    </div>
  );

  const prints = (
    <div key={n} className={styles.prints}>
      {album.photos.map((photo) => (
        <button
          key={photo.id}
          className={styles.print}
          onClick={() => setOpen(photos.indexOf(photo))}
          aria-label={`View ${photo.alt}`}
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" />
          <span className={styles.where}>{photo.location}, {photo.year}</span>
          {photo.caption && <span className={styles.caption}>{photo.caption}</span>}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <Spread head={head} section="/photography" left={notes} right={prints} />
      <Lightbox
        open={open >= 0}
        close={() => setOpen(-1)}
        index={open}
        slides={photos.map((p) => ({ src: p.src, alt: p.alt }))}
      />
    </>
  );
}
