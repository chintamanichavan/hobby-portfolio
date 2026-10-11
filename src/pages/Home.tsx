import { Link } from 'react-router-dom';
import Spread from '../components/Spread';
import Thing from '../components/Thing';
import UsMap from '../components/UsMap';
import { cookingEntries } from '../data/cooking';
import { guitarEntries } from '../data/guitar';
import { albums, photos } from '../data/photos';
import { poems } from '../data/poems';
import { sections } from '../data/sections';
import { travelEntries } from '../data/travel';
import styles from './Home.module.css';

/** What is inside each section, shown beside its name. */
const INSIDE: Record<string, string> = {
  '/photography': `${photos.length} prints from ${albums.length} places`,
  '/poetry':      `${poems.length} poems in English, Marathi and Hindi`,
  '/travel':      `${travelEntries.length} postcards`,
  '/guitar':      `${guitarEntries.length} entries in the practice log`,
  '/cooking':     `${cookingEntries.length} recipe cards`,
};

/** Three prints left lying on the first page. */
const LOOSE_PRINTS = [albums[4]?.photos[1], albums[1]?.photos[1], albums[5]?.photos[0]].filter((p) => p !== undefined);

const ALL_PINS = albums.flatMap((a) => a.pins);

export default function Home() {
  const first = (
    <>
      <p className={styles.kicker}>a field journal</p>
      <h1 className={styles.title}>Things I do when I'm not working.</h1>
      <p className={styles.owner}>kept by Chintamani</p>

      <div className={styles.collage} aria-hidden="true">
        {LOOSE_PRINTS.map((p) => (
          <figure key={p.id} className={styles.print}>
            <img src={p.src} alt="" />
            <figcaption>{p.location}</figcaption>
          </figure>
        ))}
        <Thing name="leaf-oak" scale={150} className={styles.leafA} />
        <Thing name="leaf-aspen" scale={130} className={styles.leafB} />
      </div>
    </>
  );

  const contents = (
    <>
      <ol className={styles.contents}>
        {sections.map((s, i) => (
          <li key={s.to}>
            <Link to={s.to} className={styles.row}>
              <span className={styles.fig}>fig. {i + 1}</span>
              <span className={styles.label}>{s.label}</span>
              <span className={styles.inside}>{INSIDE[s.to]}</span>
              <Thing name={s.thing} scale={74} className={styles.thing} />
            </Link>
          </li>
        ))}
      </ol>

      <figure className={styles.map}>
        <UsMap pins={ALL_PINS} />
        <figcaption>where these pages have been</figcaption>
      </figure>
    </>
  );

  return <Spread left={first} right={contents} />;
}
