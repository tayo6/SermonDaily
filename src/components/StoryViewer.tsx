import React, { useEffect, useState } from 'react';
import { Devo, Contributor } from '../types';
import { seriesCol, getContributor, devoBG } from '../data';
import { HeartIcon } from './Icons';
import { Avatar } from './Avatar';

interface StoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  devos: Devo[];
  authorId: string;
  onOpenContributor: (id: string) => void;
  amenD: Record<string, boolean>;
  onToggleAmenD: (devoId: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  isOpen,
  onClose,
  devos,
  authorId,
  onOpenContributor,
  amenD,
  onToggleAmenD,
}) => {
  const [idx, setIdx] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const DUR = 6500;

  useEffect(() => {
    if (isOpen) {
      setIdx(0);
      setElapsed(0);
    }
  }, [isOpen, authorId]);

  useEffect(() => {
    if (!isOpen || devos.length === 0) return;
    const timer = setInterval(() => {
      setElapsed(prev => {
        if (prev + 100 >= DUR) {
          if (idx < devos.length - 1) {
            setIdx(i => i + 1);
            return 0;
          } else {
            onClose();
            return prev;
          }
        }
        return prev + 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isOpen, idx, devos.length, onClose]);

  if (!isOpen || devos.length === 0) return null;

  const currentDevo = devos[idx] || devos[0];
  const author: Contributor = getContributor(authorId);

  const prevStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (idx > 0) {
      setIdx(idx - 1);
      setElapsed(0);
    }
  };

  const nextStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (idx < devos.length - 1) {
      setIdx(idx + 1);
      setElapsed(0);
    } else {
      onClose();
    }
  };

  return (
    <div className={`storyview ${isOpen ? 'open' : ''}`}>
      <div className="sv-card" style={{ background: devoBG(currentDevo) }}>
        {currentDevo.img && (
          <img
            src={currentDevo.img}
            alt={currentDevo.title}
            className="sv-bg-img"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="sv-overlay" />

        <div className="sv-content">
          <div className="sv-segs">
            {devos.map((_, i) => {
              const fill = i < idx ? 100 : i > idx ? 0 : Math.min(100, (elapsed / DUR) * 100);
              return (
                <span key={i} className="seg">
                  <i style={{ width: `${fill}%` }}></i>
                </span>
              );
            })}
          </div>

          <div className="sv-author" onClick={() => { onClose(); onOpenContributor(authorId); }}>
            <Avatar contributor={author} size="sm" />
            <div className="sv-an">
              <b>{author.name}</b>
              <span>{author.church} · {currentDevo.time}</span>
            </div>
            <button className="icon-btn" onClick={(e) => { e.stopPropagation(); onClose(); }} style={{ color: '#fff' }} aria-label="Close story">
              ✕
            </button>
          </div>

          <div className="sv-body">
            <span className="sv-scr">{currentDevo.scr || 'Morning Devotion'}</span>
            <h1>{currentDevo.title}</h1>
            <p>{currentDevo.text}</p>
          </div>

          <div className="sv-foot">
            <input placeholder="Reply with a prayer…" onClick={(e) => e.stopPropagation()} />
            <button
              className={`act amen ${amenD[currentDevo.id] ? 'on' : ''}`}
              onClick={(e) => { e.stopPropagation(); onToggleAmenD(currentDevo.id); }}
              aria-label="Amen"
            >
              <HeartIcon filled={amenD[currentDevo.id]} />
              <b>{currentDevo.amen + (amenD[currentDevo.id] ? 1 : 0)}</b>
            </button>
          </div>
        </div>

        <div className="sv-zone l" onClick={prevStory} />
        <div className="sv-zone r" onClick={nextStory} />
      </div>
    </div>
  );
};
