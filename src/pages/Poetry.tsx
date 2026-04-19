import { useState } from 'react';
import { poems } from '../data/poems';
import type { PoemLanguage } from '../types';
import styles from './Poetry.module.css';

const LANGUAGES: { value: PoemLanguage; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'hindi', label: 'हिंदी' },
];

function isDevanagari(lang: PoemLanguage) {
  return lang === 'marathi' || lang === 'hindi';
}

export default function Poetry() {
  const [lang, setLang] = useState<PoemLanguage>('english');
  const filtered = poems.filter((p) => p.language === lang);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = filtered.find((p) => p.id === activeId) ?? filtered[0];
  const devanagari = isDevanagari(lang);

  const handleLangChange = (next: PoemLanguage) => {
    setLang(next);
    setActiveId(null);
  };

  return (
    <main className={styles.main}>
      <aside className={styles.sidebar}>
        <p className={styles.eyebrow}>Written</p>
        <h1 className={styles.title}>Poetry</h1>

        <div className={styles.langTabs}>
          {LANGUAGES.map((l) => (
            <button
              key={l.value}
              className={lang === l.value ? `${styles.langTab} ${styles.langTabActive}` : styles.langTab}
              onClick={() => handleLangChange(l.value)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <nav className={styles.list}>
          {filtered.map((poem) => (
            <button
              key={poem.id}
              className={poem.id === active?.id ? `${styles.item} ${styles.itemActive}` : styles.item}
              onClick={() => setActiveId(poem.id)}
            >
              <span className={`${styles.itemTitle} ${devanagari ? styles.devanagari : ''}`}>
                {poem.title}
              </span>
              <span className={`${styles.itemDate} ${devanagari ? styles.devanagari : ''}`}>
                {poem.date}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {active && (
        <article className={styles.poem}>
          <h2 className={`${styles.poemTitle} ${devanagari ? styles.devanagari : ''}`}>
            {active.title}
          </h2>
          <p className={`${styles.poemDate} ${devanagari ? styles.devanagari : ''}`}>
            {active.date}
          </p>
          <div className={styles.poemBody}>
            {active.body.split('\n\n').map((stanza, i) => (
              <p key={i} className={`${styles.stanza} ${devanagari ? styles.devanagariStanza : ''}`}>
                {stanza.split('\n').map((line, j, arr) => (
                  <span key={j}>
                    {line}
                    {j < arr.length - 1 && <br />}
                  </span>
                ))}
              </p>
            ))}
          </div>
          {active.note && (
            <p className={`${styles.note} ${devanagari ? styles.devanagari : ''}`}>
              {active.note}
            </p>
          )}
        </article>
      )}
    </main>
  );
}
