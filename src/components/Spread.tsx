import type { ReactNode } from 'react';
import { sections } from '../data/sections';
import Thing from './Thing';
import styles from './Spread.module.css';

interface Props {
  /** Title block across the top. Its section's object floats beside it. */
  head?: ReactNode;
  /** Route of the section this page belongs to, e.g. "/poetry". */
  section?: string;
  left: ReactNode;
  right: ReactNode;
}

/** An open page: a title with its object, then two loose columns on bare ground. */
export default function Spread({ head, section, left, right }: Props) {
  const about = sections.find((s) => s.to === section);
  const number = about ? sections.indexOf(about) + 1 : 0;

  return (
    <main className={styles.spread}>
      {head && (
        <header className={styles.head}>
          <div>{head}</div>
          {about && (
            <figure className={styles.specimen}>
              <Thing name={about.thing} scale={220} />
              <figcaption>fig. {number} — {about.caption}</figcaption>
            </figure>
          )}
        </header>
      )}
      <div className={styles.columns}>
        <section>{left}</section>
        <section>{right}</section>
      </div>
    </main>
  );
}
