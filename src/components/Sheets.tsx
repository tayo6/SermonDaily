import React, { useEffect, useRef } from 'react';
import { ChurchInfo, Contributor, Sermon, Devo, NotificationItem } from '../types';
import { getContributor, seriesCol, initials, VERSES } from '../data';
import {
  PinIcon,
  BookIcon,
  HeartIcon,
  BkSmIcon,
  SunIcon,
  UserIcon,
  VerIcon,
} from './Icons';
import { Avatar } from './Avatar';

interface ChurchSheetProps {
  churchName: string | null;
  qrOnly?: boolean;
  onClose: () => void;
  churchDb: Record<string, ChurchInfo>;
  contributors: Contributor[];
  sermons: Sermon[];
  isFollowingChurch: boolean;
  onToggleFollowChurch: (name: string) => void;
  isFollowingContributor: (id: string) => boolean;
  onToggleFollowContributor: (id: string) => void;
  onOpenContributor: (id: string) => void;
  onOpenPost: (id: string) => void;
}

export const ChurchSheet: React.FC<ChurchSheetProps> = ({
  churchName,
  qrOnly,
  onClose,
  churchDb,
  contributors,
  sermons,
  isFollowingChurch,
  onToggleFollowChurch,
  isFollowingContributor,
  onToggleFollowContributor,
  onOpenContributor,
  onOpenPost,
}) => {
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (churchName && qrCanvasRef.current) {
      const cv = qrCanvasRef.current;
      const x = cv.getContext('2d');
      if (x) {
        const n = 21;
        const s = cv.width / n;
        x.fillStyle = '#241E18';
        x.fillRect(0, 0, cv.width, cv.width);
        x.fillStyle = '#fff';
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            if ((i * 7 + j * 13 + ((i * j) % 5)) % 3 !== 0) {
              x.fillRect(i * s, j * s, s, s);
            }
          }
        }
        const finder = (a: number, b: number) => {
          x.fillStyle = '#fff';
          x.fillRect(a, b, 7 * s, 7 * s);
          x.fillStyle = '#241E18';
          x.fillRect(a, b, 7 * s, 7 * s);
          x.fillStyle = '#fff';
          x.fillRect(a + s, b + s, 5 * s, 5 * s);
          x.fillStyle = '#241E18';
          x.fillRect(a + 2 * s, b + 2 * s, 3 * s, 3 * s);
        };
        finder(0, 0);
        finder(14 * s, 0);
        finder(0, 14 * s);
      }
    }
  }, [churchName, qrOnly]);

  if (!churchName) return null;
  const db: ChurchInfo = churchDb[churchName] || {
    region: 'North America',
    city: 'Los Angeles',
    co: 'United States',
    doc: 'Non-denominational',
    desc: '',
  };
  const writers = contributors.filter(c => c.church === churchName);
  const churchSermons = sermons.filter(p => p.church === churchName);

  return (
    <>
      <div className="backdrop open" onClick={onClose} />
      <div className="sheet open">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>{churchName}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sheet-body">
          <div className="cs-head">
            <span
              className="av lg"
              style={{ background: seriesCol(churchName), borderRadius: '16px' }}
            >
              {initials(churchName)}
            </span>
            <div>
              <div className="v-name" style={{ fontSize: '18px' }}>{churchName}</div>
              <div className="v-sub">{db.region} · {db.doc}</div>
              <div className="v-ch">
                {[db.city, db.st, db.co].filter(Boolean).join(', ')}
              </div>
              {db.pastor && (
                <div className="v-sub" style={{ marginTop: '4px' }}>
                  {db.role || 'Lead Pastor'}: <b>{db.pastor}</b>
                </div>
              )}
            </div>
          </div>
          <p className="cs-bio">{db.desc}</p>
          <button
            className="btn-primary"
            onClick={() => onToggleFollowChurch(churchName)}
            style={{ margin: '14px 0 4px' }}
          >
            {isFollowingChurch ? 'Following ✓' : `Follow ${churchName}`}
          </button>

          {qrOnly && (
            <div>
              <div className="sec-label">Bulletin QR (demo)</div>
              <div
                style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'center',
                  background: 'var(--card)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '14px',
                }}
              >
                <canvas
                  ref={qrCanvasRef}
                  width={108}
                  height={108}
                  style={{ borderRadius: '8px', flex: 'none' }}
                />
                <span className="cs-bio" style={{ margin: 0 }}>
                  Print this in your church bulletin. Scanning opens this Sunday’s notes — visitors who take notes become writers. <i>(Prototype renders a decorative pattern; production encodes a real link.)</i>
                </span>
              </div>
            </div>
          )}

          {!qrOnly && (
            <>
              <div className="sec-label">Sermon notes · {churchSermons.length}</div>
              {churchSermons.length > 0 ? (
                churchSermons.map((p) => (
                  <article
                    key={p.id}
                    className="crow"
                    onClick={() => { onClose(); onOpenPost(p.id); }}
                    style={{ padding: '13px 0' }}
                  >
                    <span
                      className="av sm"
                      style={{ background: seriesCol(p.series), borderRadius: '10px' }}
                    >
                      <BookIcon />
                    </span>
                    <div className="c-mid">
                      <div className="c-t">{p.title}</div>
                      <div className="c-m">{p.date} · {p.speaker}</div>
                    </div>
                    <span className="c-amen">
                      <HeartIcon /> {p.amen}
                    </span>
                  </article>
                ))
              ) : (
                <p className="cs-bio">No notes yet — your church could be first.</p>
              )}

              <div className="sec-label">Writers · {writers.length}</div>
              {writers.length > 0 ? (
                writers.map((c) => (
                  <article
                    key={c.id}
                    className="crow"
                    style={{ padding: '13px 0' }}
                    onClick={() => { onClose(); onOpenContributor(c.id); }}
                  >
                    <Avatar contributor={c} size="sm" />
                    <div className="c-mid">
                      <div className="c-t">{c.name} {c.ver && <VerIcon />}</div>
                      <div className="c-m">{c.notes} notes · {c.followers} followers</div>
                    </div>
                    <button
                      className={`follow ${isFollowingContributor(c.id) ? 'on' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFollowContributor(c.id);
                      }}
                    >
                      {isFollowingContributor(c.id) ? 'Following' : 'Follow'}
                    </button>
                  </article>
                ))
              ) : (
                <p className="cs-bio">No writers yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

interface ContributorSheetProps {
  authorId: string | null;
  onClose: () => void;
  sermons: Sermon[];
  devos: Devo[];
  isFollowing: boolean;
  onToggleFollow: (id: string) => void;
  onOpenPost: (id: string) => void;
  onOpenStoryUser: (id: string) => void;
  onToast: (msg: string) => void;
}

export const ContributorSheet: React.FC<ContributorSheetProps> = ({
  authorId,
  onClose,
  sermons,
  devos,
  isFollowing,
  onToggleFollow,
  onOpenPost,
  onOpenStoryUser,
  onToast,
}) => {
  if (!authorId) return null;
  const c = getContributor(authorId);
  const notes = sermons.filter(p => p.by === authorId);
  const userDevos = devos.filter(d => d.by === authorId);

  return (
    <>
      <div className="backdrop open" onClick={onClose} />
      <div className="sheet open">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>Contributor</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sheet-body">
          <div className="cs-head">
            <Avatar contributor={c} size="lg" />
            <div>
              <div className="v-name" style={{ fontSize: '18px' }}>
                {c.name} {c.ver && <VerIcon />}
              </div>
              <div className="v-sub">{c.doc} · {c.loc}</div>
              <div className="v-ch">{c.church}</div>
              <div className="v-fp" style={{ marginTop: '6px' }}>
                {c.focus.map((f) => (
                  <span
                    key={f}
                    className={`fp f-${f === 'Kids' ? 'k' : f === 'Teens' ? 't' : 'a'}`}
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="cs-stats">
            <div>
              <b>{c.notes}</b>
              <span>notes</span>
            </div>
            <div>
              <b>{c.followers + (isFollowing ? 1 : 0)}</b>
              <span>followers</span>
            </div>
          </div>

          <p className="cs-bio">{c.bio}</p>

          {authorId !== 'you' && (
            <button
              className="btn-primary"
              onClick={() => onToggleFollow(authorId)}
              style={{ margin: '14px 0 4px' }}
            >
              {isFollowing ? 'Following ✓' : `Follow ${c.name}`}
            </button>
          )}

          {userDevos.length > 0 && (
            <>
              <div className="sec-label">Morning devotions</div>
              {userDevos.map((d) => (
                <article
                  key={d.id}
                  className="crow"
                  onClick={() => { onClose(); onOpenStoryUser(authorId); }}
                  style={{ padding: '11px 0' }}
                >
                  <span className="nic" style={{ width: '30px', height: '30px' }}>
                    <SunIcon />
                  </span>
                  <div className="c-mid">
                    <div className="c-t" style={{ fontSize: '14px' }}>{d.title}</div>
                    <div className="c-m">{d.scr}</div>
                  </div>
                  <span className="c-amen">
                    <HeartIcon /> {d.amen}
                  </span>
                </article>
              ))}
            </>
          )}

          <div className="sec-label">Recent notes</div>
          {notes.length > 0 ? (
            notes.map((p) => (
              <article
                key={p.id}
                className="crow"
                onClick={() => { onClose(); onOpenPost(p.id); }}
                style={{ padding: '13px 0' }}
              >
                <Avatar contributor={c} size="sm" />
                <div className="c-mid">
                  <div className="c-t">{p.title}</div>
                  <div className="c-m">{p.date} · {p.read}</div>
                </div>
                <span className="c-amen">
                  <HeartIcon /> {p.amen}
                </span>
              </article>
            ))
          ) : (
            <p className="cs-bio">No notes yet.</p>
          )}

          {authorId !== 'you' && (
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button
                className="quiet danger"
                onClick={() => onToast('Report sent to moderators — thank you for keeping this community honourable')}
              >
                Report contributor
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface VerseSheetProps {
  verseRef: string | null;
  onClose: () => void;
  sermons: Sermon[];
  onOpenVersePage: (ref: string) => void;
}

export const VerseSheet: React.FC<VerseSheetProps> = ({
  verseRef,
  onClose,
  sermons,
  onOpenVersePage,
}) => {
  if (!verseRef) return null;
  const text = VERSES[verseRef.trim()];
  const base = verseRef.split(':')[0].trim();
  const matchingNotes = sermons.filter(p => {
    const combined = p.body.join(' ') + ' ' + p.excerpt;
    return combined.includes(verseRef) || combined.includes(base);
  });

  return (
    <>
      <div className="backdrop open" onClick={onClose} />
      <div className="sheet open">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>{verseRef}</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sheet-body">
          {text ? (
            <>
              <div className="vp-verse">“{text}”</div>
              <div className="vp-src">KJV (public domain) · offline demo library</div>
            </>
          ) : (
            <div className="vp-verse" style={{ fontSize: '15px', color: 'var(--ink-2)' }}>
              Verse text isn’t in the offline demo library yet.<br />
              In production this fetches live from a free source like <b>bible-api.com</b>.
            </div>
          )}
          <button
            className="btn-primary"
            onClick={() => { onClose(); onOpenVersePage(verseRef); }}
            style={{ margin: '16px 0' }}
          >
            See {matchingNotes.length} note{matchingNotes.length === 1 ? '' : 's'} on this verse
          </button>
        </div>
      </div>
    </>
  );
};

interface VersePageProps {
  verseRef: string | null;
  onClose: () => void;
  sermons: Sermon[];
  onOpenPost: (id: string) => void;
}

export const VersePage: React.FC<VersePageProps> = ({
  verseRef,
  onClose,
  sermons,
  onOpenPost,
}) => {
  if (!verseRef) return null;
  const text = VERSES[verseRef.trim()];
  const base = verseRef.split(':')[0].trim();
  const matchingNotes = sermons.filter(p => {
    const combined = p.body.join(' ') + ' ' + p.excerpt;
    return combined.includes(verseRef) || combined.includes(base);
  });

  return (
    <div className="full open" style={{ zIndex: 62 }}>
      <div className="ftop">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div className="flabel">{verseRef}</div>
        <span style={{ width: '38px' }} />
      </div>
      <div className="fbody">
        <div className="vp-verse">
          “{text || 'Verse text — connect a free Bible source in production.'}”
        </div>
        <div className="sec-label">
          Preached in {matchingNotes.length} note{matchingNotes.length === 1 ? '' : 's'}
        </div>
        {matchingNotes.length > 0 ? (
          matchingNotes.map((p) => {
            const author = getContributor(p.by);
            return (
              <div
                key={p.id}
                className="sp-row"
                onClick={() => { onClose(); onOpenPost(p.id); }}
              >
                <span className="av sm" style={{ background: author.col }}>{author.ini}</span>
                <div className="c-mid">
                  <div className="c-t">{p.title}</div>
                  <div className="c-m">{p.church} · {p.speaker}</div>
                </div>
                <span className="c-amen"><HeartIcon /> {p.amen}</span>
              </div>
            );
          })
        ) : (
          <p className="cs-bio">No notes reference this verse yet — yours could be first.</p>
        )}
      </div>
    </div>
  );
};

interface SeriesPageProps {
  seriesName: string | null;
  onClose: () => void;
  sermons: Sermon[];
  isFollowing: boolean;
  onToggleFollow: (name: string) => void;
  onOpenPost: (id: string) => void;
}

export const SeriesPage: React.FC<SeriesPageProps> = ({
  seriesName,
  onClose,
  sermons,
  isFollowing,
  onToggleFollow,
  onOpenPost,
}) => {
  if (!seriesName) return null;
  const seriesNotes = sermons.filter(p => p.series === seriesName && p.focus !== 'Kids');

  return (
    <div className="full open" style={{ zIndex: 63 }}>
      <div className="ftop">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div className="flabel">Series</div>
        <span style={{ width: '38px' }} />
      </div>
      <div className="fbody">
        <div className="sp-cover" style={{ background: seriesCol(seriesName) }}>
          <h2>{seriesName}</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '6px' }}>
          <span className="m-tag">{seriesNotes.length} notes</span>
          <button
            className={`follow ${isFollowing ? 'on' : ''}`}
            onClick={() => onToggleFollow(seriesName)}
            style={{ marginLeft: 'auto' }}
          >
            {isFollowing ? 'Following series' : 'Follow series'}
          </button>
        </div>
        {seriesNotes.map((p) => {
          const author = getContributor(p.by);
          return (
            <div
              key={p.id}
              className="sp-row"
              onClick={() => { onClose(); onOpenPost(p.id); }}
            >
              <Avatar contributor={author} size="sm" />
              <div className="c-mid">
                <div className="c-t">{p.title}</div>
                <div className="c-m">{p.church} · {p.date} · {p.speaker}</div>
              </div>
              <span className="c-amen"><HeartIcon /> {p.amen}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface NotificationsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notifs: NotificationItem[];
  onSelectNotif: (notif: NotificationItem, index: number) => void;
}

export const NotificationsSheet: React.FC<NotificationsSheetProps> = ({
  isOpen,
  onClose,
  notifs,
  onSelectNotif,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="backdrop open" onClick={onClose} />
      <div className="sheet open">
        <div className="grabber" />
        <div className="sheet-head">
          <h2>Notifications</h2>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <div className="sheet-body">
          {notifs.length > 0 ? (
            notifs.map((n, i) => {
              const author = getContributor(n.by);
              return (
                <div
                  key={i}
                  className="nitem"
                  onClick={() => onSelectNotif(n, i)}
                >
                  <span className="nic">
                    {n.t === 'note' && <BookIcon />}
                    {n.t === 'amen' && <HeartIcon />}
                    {n.t === 'devo' && <SunIcon />}
                    {n.t === 'follow' && <UserIcon />}
                  </span>
                  <span className="nit">
                    <b>{author.name}</b>
                    <span>{n.txt}</span>
                  </span>
                  <em>{n.time}</em>
                </div>
              );
            })
          ) : (
            <p className="cs-bio" style={{ textAlign: 'center', padding: '30px 0' }}>
              All caught up 🌿
            </p>
          )}
        </div>
      </div>
    </>
  );
};
