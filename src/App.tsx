import { useState } from 'react';
import { BrowserRouter, Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Cover from './components/Cover';
import Nav from './components/Nav';
import Thing from './components/Thing';
import { sections } from './data/sections';
import Home from './pages/Home';
import Photography from './pages/Photography';
import Poetry from './pages/Poetry';
import Travel from './pages/Travel';
import Cooking from './pages/Cooking';
import Guitar from './pages/Guitar';
import styles from './App.module.css';

function Journal() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // The closed journal, among the things beside it, greets a visitor who arrives at the first page.
  const [closed, setClosed] = useState(pathname === '/');

  // Every page ends by pointing at the next section; the last one leads back to the first.
  const here = sections.findIndex((s) => s.to === pathname);
  const next = sections[(here + 1) % sections.length];

  return (
    <>
      {closed && <Cover onPick={navigate} onOpened={() => setClosed(false)} />}
      {/* The page waits until the cover has opened, so it arrives as the cover swings away. */}
      {!closed && (
        <>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/photography" element={<Photography />} />
            <Route path="/poetry" element={<Poetry />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/cooking" element={<Cooking />} />
            <Route path="/guitar" element={<Guitar />} />
          </Routes>

          {/* The day ends: the ground darkens, and the next section waits there. */}
          {next && (
            <footer className={styles.dusk}>
              <Link to={next.to} className={styles.next}>
                <span className={styles.nextLabel}>next</span>
                <span className={styles.nextTitle}>{next.label}</span>
                <Thing name={next.thing} scale={150} className={styles.nextThing} />
              </Link>
              <p className={styles.colophon}>Chintamani · things I do when I'm not working</p>
            </footer>
          )}
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Journal />
    </BrowserRouter>
  );
}
