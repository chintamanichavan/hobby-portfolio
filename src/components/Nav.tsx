import { Link, NavLink } from 'react-router-dom';
import { OWNER } from '../data/owner';
import { sections } from '../data/sections';
import styles from '../App.module.css';

/** The quiet line across the top: who this is, and where you can go. */
export default function Nav() {
  return (
    <header className={styles.top}>
      <Link to="/" className={styles.home}>{OWNER}<br />a field journal</Link>
      <nav className={styles.index} aria-label="Sections">
        {sections.map((s, i) => (
          <NavLink key={s.to} to={s.to} className={({ isActive }) => (isActive ? styles.here : undefined)}>
            <span>{String(i + 1).padStart(2, '0')}</span> {s.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
