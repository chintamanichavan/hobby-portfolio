import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <>
      <nav className={styles.nav}>
        <NavLink to="/" className={styles.logo} onClick={close}>
          C
        </NavLink>
        <div className={styles.links}>
          <NavLink to="/photography" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Photography
          </NavLink>
          <NavLink to="/poetry" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Poetry
          </NavLink>
          <NavLink to="/travel" className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Travel
          </NavLink>
        </div>
        <button
          className={styles.hamburger}
          onClick={() => setIsOpen(o => !o)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <span className={`${styles.bar} ${isOpen ? styles.barOpen1 : ''}`} />
          <span className={`${styles.bar} ${isOpen ? styles.barOpen2 : ''}`} />
          <span className={`${styles.bar} ${isOpen ? styles.barOpen3 : ''}`} />
        </button>
      </nav>
      {isOpen && (
        <div className={styles.mobileMenu} onClick={close}>
          <NavLink to="/photography" className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink} onClick={close}>
            Photography
          </NavLink>
          <NavLink to="/poetry" className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink} onClick={close}>
            Poetry
          </NavLink>
          <NavLink to="/travel" className={({ isActive }) => isActive ? `${styles.mobileLink} ${styles.mobileLinkActive}` : styles.mobileLink} onClick={close}>
            Travel
          </NavLink>
        </div>
      )}
    </>
  );
}
