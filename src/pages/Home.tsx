import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const sections = [
  {
    to: '/photography',
    label: 'Photography',
    description: 'Moments caught between intention and accident.',
    accent: '#c4b9a8',
    live: true,
  },
  {
    to: '/poetry',
    label: 'Poetry',
    description: 'Words that arrive uninvited and stay.',
    accent: '#9db4c0',
    live: true,
  },
  {
    to: '/travel',
    label: 'Travel',
    description: 'A few places that changed the shape of ordinary days.',
    accent: '#7a8c6e',
    live: true,
  },
  {
    to: '/guitar',
    label: 'Guitar',
    description: 'Learning to play. Slowly, badly, happily.',
    accent: '#c4a882',
    live: false,
  },
  {
    to: '/cooking',
    label: 'Cooking',
    description: 'Home recipes, experiments, the occasional disaster.',
    accent: '#b87f6a',
    live: false,
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>A personal space</p>
        <h1 className={styles.title}>Things I do<br />when I'm not working.</h1>
        <p className={styles.subtitle}>
          Photography, poetry, travel — and a few things still taking shape.
        </p>
      </header>

      <div className={styles.grid}>
        {sections.map((s) =>
          s.live ? (
            <Link
              key={s.label}
              to={s.to!}
              className={styles.card}
              style={{ '--accent': s.accent } as React.CSSProperties}
            >
              <div className={styles.cardInner}>
                <h2 className={styles.cardTitle}>{s.label}</h2>
                <p className={styles.cardDesc}>{s.description}</p>
                <span className={styles.cardArrow}>Explore →</span>
              </div>
            </Link>
          ) : (
            <Link
              key={s.label}
              to={s.to!}
              className={`${styles.card} ${styles.cardSoon}`}
              style={{ '--accent': s.accent } as React.CSSProperties}
            >
              <div className={styles.cardInner}>
                <h2 className={styles.cardTitle}>{s.label}</h2>
                <p className={styles.cardDesc}>{s.description}</p>
                <span className={styles.comingSoon}>Coming soon</span>
              </div>
            </Link>
          )
        )}
      </div>
    </main>
  );
}
