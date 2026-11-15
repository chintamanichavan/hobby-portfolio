import { useState } from 'react';
import { pieces } from '../data/writing';
import type { Language, Piece } from '../types';
import Spread from '../components/Spread';
import styles from './Writing.module.css';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'english', label: 'English' },
  { value: 'marathi', label: 'मराठी' },
  { value: 'hindi', label: 'हिंदी' },
];

function isDevanagari(lang: Language) {
  return lang === 'marathi' || lang === 'hindi';
}

/** A poem keeps each line; an essay's lines join into one paragraph. */
function Body({ piece, devanagari }: { piece: Piece; devanagari: boolean }) {
  const blocks = piece.body.split('\n\n');
  if (piece.kind === 'essay') {
    return blocks.map((para, i) => (
      <p key={i} className={`${styles.paragraph} ${devanagari ? styles.devanagariProse : ''}`}>
        {para.replace(/\n/g, ' ')}
      </p>
    ));
  }
  return blocks.map((stanza, i) => (
    <p key={i} className={`${styles.stanza} ${devanagari ? styles.devanagariProse : ''}`}>
      {stanza.split('\n').map((line, j, arr) => (
        <span key={j}>
          {line}
          {j < arr.length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
}

export default function Writing() {
  const [lang, setLang] = useState<Language>('english');
  const filtered = pieces.filter((p) => p.language === lang);
  const [activeId, setActiveId] = useState<string | null>(null);

  const active = filtered.find((p) => p.id === activeId) ?? filtered[0];
  const devanagari = isDevanagari(lang);

  const handleLangChange = (next: Language) => {
    setLang(next);
    setActiveId(null);
  };

  const head = (
    <>
      <p className={styles.eyebrow}>one at a time</p>
      <h1 className={styles.title}>Writing</h1>
    </>
  );

  const index = (
    <div className={styles.sidebar} data-lang={lang}>
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
        {filtered.map((piece) => (
          <button
            key={piece.id}
            className={piece.id === active?.id ? `${styles.item} ${styles.itemActive}` : styles.item}
            onClick={() => setActiveId(piece.id)}
          >
            <span className={`${styles.itemTitle} ${devanagari ? styles.devanagari : ''}`}>
              {piece.title}
            </span>
            <span className={styles.itemDate}>{piece.kind} · {piece.date}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const page = active && (
    <article key={active.id} className={styles.piece} data-lang={lang}>
      <h2 className={`${styles.pieceTitle} ${devanagari ? styles.devanagari : ''}`}>
        {active.title}
      </h2>
      <p className={styles.pieceDate}>{active.kind} · {active.date}</p>
      <div className={styles.pieceBody}>
        <Body piece={active} devanagari={devanagari} />
      </div>
      {active.note && <p className={styles.note}>{active.note}</p>}
      <p className={styles.folio}>
        {filtered.indexOf(active) + 1} of {filtered.length}
      </p>
    </article>
  );

  return <Spread head={head} section="/writing" left={index} right={page} />;
}
