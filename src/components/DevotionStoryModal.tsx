import React, { useState, useRef, useEffect } from 'react';
import { Devo } from '../types';
import { PALETTE } from '../data';

interface DevotionStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishStory: (devo: Devo) => void;
  onToast: (msg: string) => void;
}

export const DevotionStoryModal: React.FC<DevotionStoryModalProps> = ({
  isOpen,
  onClose,
  onPublishStory,
  onToast,
}) => {
  const [scr, setScr] = useState('');
  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [dBGIdx, setDBGIdx] = useState<number>(-1);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (bodyRef.current) {
          bodyRef.current.focus();
        }
      }, 200);
    } else {
      setScr('');
      setTitle('');
      setBodyText('');
      setDBGIdx(-1);
      if (bodyRef.current) {
        bodyRef.current.innerHTML = '';
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBodyInput = () => {
    if (bodyRef.current) {
      setBodyText(bodyRef.current.innerText || '');
    }
  };

  const words = bodyText.trim() ? bodyText.trim().split(/\s+/).length : 0;

  const handleShare = () => {
    const plain = (bodyRef.current?.innerText || bodyText || '').replace(/\s+/g, ' ').trim();
    const trimmedScr = scr.trim();

    if (words === 0 && !trimmedScr) {
      onToast('Write even one verse for today');
      return;
    }

    let finalScr = trimmedScr;
    if (!finalScr) {
      const m = plain.match(
        /\b(?:[1-3]\s+)?(?:Psalm|Psalms|Proverbs|John|Matthew|Mark|Luke|Romans|Isaiah|Genesis|Exodus|Ephesians|Philippians|James|Acts|Daniel)\s+\d{1,3}(?::\d{1,3})?/
      );
      if (m) finalScr = m[0];
    }

    const firstSentence = plain.split(/[.!?]/)[0].slice(0, 40);
    const finalTitle = title.trim() || firstSentence || 'Today’s devotion';

    const newDevo: Devo = {
      id: `u${Date.now()}`,
      by: 'you',
      title: finalTitle,
      scr: finalScr,
      text: plain.slice(0, 220),
      time: 'Now',
      amen: 0,
      bg: dBGIdx,
    };

    onPublishStory(newDevo);
    onClose();
    onToast('Devotion shared — it’s live at the top ☀️');
  };

  return (
    <div className={`edview ${isOpen ? 'open' : ''}`} id="devoView">
      <div className="topbar">
        <button className="icon-btn" id="dBack" onClick={onClose} aria-label="Back">
          ←
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <b style={{ font: '700 15px var(--sans)' }}>New Devotion</b>
          <span style={{ font: '500 11px var(--sans)', color: 'var(--ink-3)' }}>
            Publishes as this morning&apos;s story
          </span>
        </div>
        <button className="btn-share" id="dShare" onClick={handleShare}>
          Share
        </button>
      </div>

      <div className="editor">
        <input
          className="field"
          id="dScr"
          placeholder="📖  Scripture (optional) — e.g. Psalm 5:3"
          style={{ marginBottom: '16px' }}
          value={scr}
          onChange={(e) => setScr(e.target.value)}
        />
        <input
          className="title-input"
          id="dTitle"
          placeholder="Devotion title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div
          ref={bodyRef}
          className="note"
          id="dBody"
          contentEditable
          suppressContentEditableWarning
          data-ph="Write today's devotion — a verse, a thought, a prayer…"
          onInput={handleBodyInput}
        />

        <div className="sec-label" style={{ marginTop: '20px' }}>
          Story background
        </div>
        <div className="bgrow" id="dBG">
          <button
            type="button"
            className={`bgsw auto ${dBGIdx === -1 ? 'on' : ''}`}
            onClick={() => setDBGIdx(-1)}
          >
            AUTO
          </button>
          {PALETTE.map((p, i) => (
            <button
              key={i}
              type="button"
              className={`bgsw ${dBGIdx === i ? 'on' : ''}`}
              style={{ background: `linear-gradient(135deg, ${p[0]}, ${p[1]})` }}
              onClick={() => setDBGIdx(i)}
            />
          ))}
        </div>
      </div>

      <div className="details-bar" style={{ cursor: 'default' }}>
        <div className="db-icon">☀️</div>
        <div className="db-text">
          <div className="db-t1">Morning Devotions</div>
          <div className="db-t2" id="dMeta">
            {words} words · shares as a story
          </div>
        </div>
      </div>
    </div>
  );
};

