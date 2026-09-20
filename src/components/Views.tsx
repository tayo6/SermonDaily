import React, { useState } from 'react';
import { Sermon, Devo, Contributor, ChurchInfo, DraftItem, SchedItem, PrivateNote } from '../types';
import {
  getContributor,
  seriesCol,
  devoBG,
  KGRAD,
  TREND,
  XDOCS,
  XREGS,
  LOCS,
  DOCS,
  AGES,
  YOU,
} from '../data';
import {
  BookIcon,
  HeartIcon,
  CommIcon,
  ShareIcon,
  MicIcon,
  PinIcon,
  SearchIcon,
  VerIcon,
  BkSmIcon,
  SunIcon,
} from './Icons';
import { KidArt } from './KidArt';

// -------------------------------------------------------------
// HOME VIEW
// -------------------------------------------------------------
interface HomeViewProps {
  sermons: Sermon[];
  devos: Devo[];
  scheduled?: SchedItem[];
  ftab: 'discover' | 'following';
  setFtab: (tab: 'discover' | 'following') => void;
  layoutStyle: 'edit' | 'cards' | 'compact';
  setLayoutStyle: (style: 'edit' | 'cards' | 'compact') => void;
  focusFilter: 'all' | 'sermon' | 'kids';
  setFocusFilter: (filter: 'all' | 'sermon' | 'kids') => void;
  followMap: Record<string, boolean>;
  churchFollowMap: Record<string, boolean>;
  seriesFollowMap: Record<string, boolean>;
  seenDevos: Record<string, boolean>;
  amenMap: Record<string, boolean>;
  onToggleAmen: (id: string) => void;
  onToggleFollow: (authorId: string) => void;
  onOpenPost: (id: string) => void;
  onOpenStoryUser: (authorId: string) => void;
  onAddDevotionStory: () => void;
  onGoVoices: () => void;
  onToast: (msg: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  sermons,
  devos,
  scheduled = [],
  ftab,
  setFtab,
  layoutStyle,
  setLayoutStyle,
  focusFilter,
  setFocusFilter,
  followMap,
  churchFollowMap,
  seriesFollowMap,
  seenDevos,
  amenMap,
  onToggleAmen,
  onToggleFollow,
  onOpenPost,
  onOpenStoryUser,
  onAddDevotionStory,
  onGoVoices,
  onToast,
}) => {
  const [awareDismissed, setAwareDismissed] = useState(false);
  const [remindMap, setRemindMap] = useState<Record<string, boolean>>({});

  const fmtIn = (ms: number) => {
    const h = Math.round(ms / 3600000);
    if (h < 1) {
      const m = Math.round(ms / 60000);
      return `in ${m}m`;
    }
    if (h < 24) return `in ${h}h`;
    const d = Math.round(h / 24);
    return `in ${d}d`;
  };

  const now = Date.now();
  const upcoming = scheduled
    .filter(s => (typeof s.when === 'number' ? s.when : new Date(s.when).getTime()) > now)
    .sort((a, b) => {
      const ta = typeof a.when === 'number' ? a.when : new Date(a.when).getTime();
      const tb = typeof b.when === 'number' ? b.when : new Date(b.when).getTime();
      return ta - tb;
    });

  const up = upcoming[0];
  const diff = up ? (typeof up.when === 'number' ? up.when : new Date(up.when).getTime()) - now : 0;
  const showAware = !awareDismissed && up && diff > 0 && diff <= 48 * 3600 * 1000;
  const remKey = up ? (up.id || up.title) : '';
  const isRem = !!remindMap[remKey];

  // Story users logic
  const storyUsersOrder: string[] = [];
  const visitedUsers: Record<string, boolean> = {};
  devos.forEach(d => {
    if (ftab === 'following' && d.by !== 'you' && !followMap[d.by]) return;
    if (!visitedUsers[d.by]) {
      visitedUsers[d.by] = true;
      storyUsersOrder.push(d.by);
    }
  });
  storyUsersOrder.sort((a, b) => (a === 'you' ? -1 : b === 'you' ? 1 : 0));

  const filteredPosts = sermons.filter(p => {
    if (focusFilter === 'kids' && p.focus !== 'Kids') return false;
    if (focusFilter === 'sermon' && p.focus === 'Kids') return false;
    if (ftab === 'following') {
      return followMap[p.by] || churchFollowMap[p.church] || (p.series && seriesFollowMap[p.series]);
    }
    return true;
  });

  return (
    <section className="view on" id="view-home">
      {/* 1. Tabs at the top */}
      <nav className="tabs">
        <button
          className={`tab ${ftab === 'discover' ? 'on' : ''}`}
          onClick={() => setFtab('discover')}
        >
          Discover
        </button>
        <button
          className={`tab ${ftab === 'following' ? 'on' : ''}`}
          onClick={() => setFtab('following')}
        >
          Following
        </button>
      </nav>

      {/* 2. Awareness banner (scheduled sermons dropping soon) */}
      {showAware && (
        <div className="aware" id="awareBanner">
          <span className="aw-c" id="awCount">{fmtIn(diff)}</span>
          <div className="aw-t">
            <b id="awTitle">{up.title}</b> —{' '}
            <span id="awWho">
              {up.by === 'you' ? 'Your scheduled note' : (up.by ? getContributor(up.by)?.name : up.church) || up.church || 'Upcoming Service'}
            </span>
          </div>
          <button
            className={`aw-btn ${isRem ? 'on' : ''}`}
            id="awRemind"
            onClick={() => {
              if (isRem) {
                setRemindMap(prev => ({ ...prev, [remKey]: false }));
                onToast('Reminder removed');
              } else {
                setRemindMap(prev => ({ ...prev, [remKey]: true }));
                onToast('We’ll nudge you when it drops');
              }
            }}
          >
            {isRem ? '✓ Set' : '🔔 Remind'}
          </button>
          <button
            className="aw-x"
            id="awDismiss"
            title="Dismiss"
            onClick={() => setAwareDismissed(true)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 3. Stories carousel */}
      <div className="stories">
        {!storyUsersOrder.includes('you') && (
          <div className="story add" onClick={onAddDevotionStory}>
            <span className="st-plus">+</span>
            <span className="st-k">YOUR STORY</span>
            <span className="st-e">Add a morning devotion</span>
          </div>
        )}
        {storyUsersOrder.map(u => {
          const d = devos.find(x => x.by === u);
          if (!d) return null;
          const author = getContributor(u);
          const isMine = u === 'you';
          const isSeen = !!seenDevos[d.id];
          return (
            <div
              key={u}
              className={`story ${isSeen ? 'seen' : ''}`}
              style={{ background: devoBG(d) }}
              onClick={() => onOpenStoryUser(u)}
            >
              <span className="st-k">{isMine ? 'YOUR STORY' : 'DEVOTION'}</span>
              <span className="st-t">{d.title}</span>
              <span className="st-sp" />
              <span className="st-b">
                <span className="av" style={{ background: author.col }}>{author.ini}</span>
                <span className="st-n">
                  {isMine ? 'You' : author.name.split(' ')[0]} · {d.time}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      {/* Layout switchers */}
      <div className="stylerow">
        <span className="sl">Layout</span>
        <button
          className={`q ${layoutStyle === 'edit' ? 'on' : ''}`}
          onClick={() => setLayoutStyle('edit')}
        >
          Editorial
        </button>
        <button
          className={`q ${layoutStyle === 'cards' ? 'on' : ''}`}
          onClick={() => setLayoutStyle('cards')}
        >
          Cards
        </button>
        <button
          className={`q ${layoutStyle === 'compact' ? 'on' : ''}`}
          onClick={() => setLayoutStyle('compact')}
        >
          Compact
        </button>
      </div>

      {/* Focus filter */}
      <div className="frow" id="ffilter">
        <button
          className={`q ${focusFilter === 'all' ? 'on' : ''}`}
          onClick={() => setFocusFilter('all')}
        >
          All
        </button>
        <button
          className={`q ${focusFilter === 'sermon' ? 'on' : ''}`}
          onClick={() => setFocusFilter('sermon')}
        >
          Sermons
        </button>
        <button
          className={`q ${focusFilter === 'kids' ? 'on' : ''}`}
          onClick={() => setFocusFilter('kids')}
        >
          🧒 Kids Zone
        </button>
      </div>

      {/* Feed list */}
      <div id="feed" className="anim">
        {filteredPosts.length === 0 ? (
          <div className="empty">
            <div className="big">The well is quiet</div>
            <div className="verse">“Taste and see that the Lord is good.” — Psalm 34:8</div>
            <p>Follow a few voices or churches and their notes will fill this well.</p>
            <button onClick={onGoVoices}>Explore voices</button>
          </div>
        ) : (
          filteredPosts.map((p) => {
            const author = getContributor(p.by);
            const isPostAmen = !!amenMap[p.id];
            const isFollowing = !!followMap[p.by];

            // Compact mode renders all posts uniformly as crow
            if (layoutStyle === 'compact') {
              return (
                <article key={p.id} className="crow" onClick={() => onOpenPost(p.id)}>
                  <span className="av sm" style={{ background: author.col }}>{author.ini}</span>
                  <div className="c-mid">
                    <div className="c-t">{p.title}</div>
                    <div className="c-m">{p.church} · {author.name} · {p.date}</div>
                  </div>
                  <button
                    className={`c-amen act ${isPostAmen ? 'amen on' : ''}`}
                    style={{ padding: '4px 6px', background: 'none', border: 'none' }}
                    onClick={(e) => { e.stopPropagation(); onToggleAmen(p.id); }}
                  >
                    <HeartIcon filled={isPostAmen} /> <b>{p.amen + (isPostAmen ? 1 : 0)}</b>
                  </button>
                </article>
              );
            }

            // Kids card (for Editorial and Cards)
            if (p.focus === 'Kids') {
              return (
                <article
                  key={p.id}
                  className="kcard"
                  onClick={() => onOpenPost(p.id)}
                >
                  <div
                    className="kart"
                    style={{ background: KGRAD[p.kidsart || 'lion'] || KGRAD.lion }}
                  >
                    <KidArt kind={p.kidsart || 'lion'} />
                  </div>
                  <div className="kin">
                    <h3>{p.title}</h3>
                    <p>{p.excerpt.replace(/<[^>]*>/g, '').slice(0, 70)}</p>
                    <div className="kby">
                      <span className="av" style={{ background: author.col }}>{author.ini}</span>
                      <span>{author.name.split(' ')[0]} · {p.church}</span>
                      <button
                        className={`act amen ${isPostAmen ? 'on' : ''}`}
                        style={{ marginLeft: 'auto', padding: '2px 6px' }}
                        onClick={(e) => { e.stopPropagation(); onToggleAmen(p.id); }}
                      >
                        <HeartIcon filled={isPostAmen} /> <b>{p.amen + (isPostAmen ? 1 : 0)}</b>
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            // Cards layout
            if (layoutStyle === 'cards') {
              return (
                <article key={p.id} className="fcard" onClick={() => onOpenPost(p.id)}>
                  <div className="fstrip" style={{ background: seriesCol(p.series) }}>
                    {p.series || 'Sermon Notes'}
                  </div>
                  <div className="fcard-in">
                    <div className="byline" style={{ marginBottom: '8px' }}>
                      <span className="av" style={{ background: author.col }}>{author.ini}</span>
                      <div className="by-mid">
                        <div className="by-name">{author.name} {author.ver && <VerIcon />}</div>
                        <div className="by-meta">
                          {p.church} · {p.date}
                          {p.chOnly && <span> · <b>Church only</b></span>}
                        </div>
                      </div>
                      {p.by !== 'you' && (
                        <button
                          className={`follow ${isFollowing ? 'on' : ''}`}
                          onClick={(e) => { e.stopPropagation(); onToggleFollow(p.by); }}
                        >
                          {isFollowing ? 'Following' : 'Follow'}
                        </button>
                      )}
                    </div>
                    <h3 className="post-title">{p.title}</h3>
                    <p
                      className="excerpt"
                      dangerouslySetInnerHTML={{ __html: p.excerpt }}
                    />
                    {p.media && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '11px' }}>
                        {p.media.v && <span className="media">▶ Video</span>}
                        {p.media.a && <span className="media"><MicIcon /> Audio</span>}
                      </div>
                    )}
                    <div className="tagrow">
                      <span className="m-tag doc">{author.doc}</span>
                      <span className={`fp f-${p.focus === 'Kids' ? 'k' : p.focus === 'Teens' ? 't' : 'a'}`}>
                        {p.focus}
                      </span>
                    </div>
                    <div className="actions">
                      <button
                        className={`act amen ${isPostAmen ? 'on pop' : ''}`}
                        onClick={(e) => { e.stopPropagation(); onToggleAmen(p.id); }}
                      >
                        <HeartIcon filled={isPostAmen} />
                        <b>{p.amen + (isPostAmen ? 1 : 0)}</b>
                      </button>
                      <button
                        className="act"
                        onClick={(e) => { e.stopPropagation(); onToast('Open the note to read reflections'); }}
                      >
                        <CommIcon />
                        <b>{(p.refl || []).length}</b>
                      </button>
                      <span className="act meta-r">{p.read}</span>
                      <button
                        className="act"
                        onClick={(e) => { e.stopPropagation(); onToast('Share link copied'); }}
                      >
                        <ShareIcon />
                      </button>
                    </div>
                  </div>
                </article>
              );
            }

            // Editorial (default)
            return (
              <article key={p.id} className="post" onClick={() => onOpenPost(p.id)}>
                <div className="byline">
                  <span className="av" style={{ background: author.col }}>{author.ini}</span>
                  <div className="by-mid">
                    <div className="by-name">{author.name} {author.ver && <VerIcon />}</div>
                    <div className="by-meta">
                      {p.church} · {p.date}
                      {p.chOnly && <span> · <b>Church only</b></span>}
                    </div>
                  </div>
                  {p.by !== 'you' && (
                    <button
                      className={`follow ${isFollowing ? 'on' : ''}`}
                      onClick={(e) => { e.stopPropagation(); onToggleFollow(p.by); }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>

                <div
                  className="overline"
                  style={{
                    textDecoration: 'none',
                    textDecorationLine: 'none',
                    border: 'none',
                    borderTop: 'none',
                  }}
                >
                  <BookIcon /> {p.series || 'Sermon Notes'}
                </div>

                <h3 className="post-title">{p.title}</h3>
                <p className="excerpt" dangerouslySetInnerHTML={{ __html: p.excerpt }} />

                {p.media && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '11px' }}>
                    {p.media.v && <span className="media">▶ Video</span>}
                    {p.media.a && <span className="media"><MicIcon /> Audio</span>}
                  </div>
                )}

                <div className="tagrow">
                  <span className="m-tag doc">{author.doc}</span>
                  <span className={`fp f-${p.focus === 'Kids' ? 'k' : p.focus === 'Teens' ? 't' : 'a'}`}>
                    {p.focus}
                  </span>
                </div>

                <div className="actions">
                  <button
                    className={`act amen ${isPostAmen ? 'on pop' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onToggleAmen(p.id); }}
                  >
                    <HeartIcon filled={isPostAmen} />
                    <b>{p.amen + (isPostAmen ? 1 : 0)}</b>
                  </button>
                  <button
                    className="act"
                    onClick={(e) => { e.stopPropagation(); onToast('Open the note to read reflections'); }}
                  >
                    <CommIcon />
                    <b>{(p.refl || []).length}</b>
                  </button>
                  <span className="act meta-r">{p.read}</span>
                  <button
                    className="act"
                    onClick={(e) => { e.stopPropagation(); onToast('Share link copied'); }}
                  >
                    <ShareIcon />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
      <div style={{ height: '24px' }} />
    </section>
  );
};

// -------------------------------------------------------------
// EXPLORE VIEW
// -------------------------------------------------------------
interface ExploreViewProps {
  churchDb: Record<string, ChurchInfo>;
  contributors: Contributor[];
  sermons: Sermon[];
  churchFollowMap: Record<string, boolean>;
  onToggleFollowChurch: (name: string) => void;
  onOpenChurch: (name: string, qrOnly?: boolean) => void;
  onOpenPost: (id: string) => void;
  onOpenSeries: (name: string) => void;
  onSelectTag: (tag: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  churchDb,
  contributors,
  sermons,
  churchFollowMap,
  onToggleFollowChurch,
  onOpenChurch,
  onOpenPost,
  onOpenSeries,
  onSelectTag,
}) => {
  const [query, setQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');

  const isFiltered = query.trim() !== '' || selectedDoc !== 'All' || selectedRegion !== 'All';

  const order = Object.keys(churchDb);
  const matchingChurches = order.filter(ch => {
    const db = churchDb[ch];
    if (selectedDoc !== 'All' && db.doc !== selectedDoc) return false;
    if (selectedRegion !== 'All' && db.region !== selectedRegion) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const hay = `${ch} ${db.city} ${db.st || ''} ${db.co} ${db.pastor || ''} ${db.doc}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const clearFilters = () => {
    setQuery('');
    setSelectedDoc('All');
    setSelectedRegion('All');
  };

  const kidsSermons = sermons.filter(p => p.focus === 'Kids');
  const seriesNames: string[] = [];
  sermons.forEach(p => {
    if (p.series && p.focus !== 'Kids' && !seriesNames.includes(p.series)) {
      seriesNames.push(p.series);
    }
  });

  return (
    <section className="view on" id="view-explore">
      <header className="page-head">
        <h1>Explore</h1>
        <p>Find churches by name, city, tradition or region.</p>
      </header>

      <div className="searchwrap">
        <label className="search">
          <SearchIcon />
          <input
            placeholder="Search church, city, pastor…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      {/* Filter chips */}
      <div className="sec-label" style={{ padding: '0 20px', marginTop: '10px' }}>Denomination</div>
      <div className="hchips" style={{ paddingBottom: '4px' }}>
        {XDOCS.map((doc) => (
          <button
            key={doc}
            className={`q ${selectedDoc === doc ? 'on' : ''}`}
            onClick={() => setSelectedDoc(doc)}
          >
            {doc}
          </button>
        ))}
      </div>

      <div className="sec-label" style={{ padding: '0 20px', marginTop: '10px' }}>Location</div>
      <div className="hchips" style={{ paddingBottom: '4px' }}>
        {XREGS.map((reg) => (
          <button
            key={reg}
            className={`q ${selectedRegion === reg ? 'on' : ''}`}
            onClick={() => setSelectedRegion(reg)}
          >
            {reg}
          </button>
        ))}
      </div>

      <div className="sec-label" style={{ padding: '0 20px', marginTop: '4px' }}>
        Churches <span className="count">· {matchingChurches.length} shown</span>
        {isFiltered && (
          <button className="quiet" onClick={clearFilters} style={{ marginLeft: 'auto' }}>
            Clear
          </button>
        )}
      </div>

      <div style={{ marginTop: '-6px' }}>
        {matchingChurches.length === 0 ? (
          <div className="empty" style={{ padding: '40px 30px' }}>
            <div className="big">No churches match</div>
            <p>Try another name, city or tradition — or clear the filters.</p>
            <button onClick={clearFilters}>Clear search &amp; filters</button>
          </div>
        ) : (
          matchingChurches.map((ch) => {
            const db = churchDb[ch];
            const writers = contributors.filter(c => c.church === ch);
            const notes = sermons.filter(p => p.church === ch);
            const isFollowing = !!churchFollowMap[ch];
            const writerNames = writers.slice(0, 2).map(c => c.name).join(', ') +
              (writers.length > 2 ? ` +${writers.length - 2}` : '');

            return (
              <article key={ch} className="chcard">
                <div className="ch-top">
                  <h3>{ch}</h3>
                  <button
                    className={`follow ${isFollowing ? 'on' : ''}`}
                    onClick={() => onToggleFollowChurch(ch)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
                <span className="region">{db.home ? 'Your church' : db.region}</span>
                <span className="doctag">{db.doc}</span>
                <div className="ch-loc">
                  <PinIcon />
                  <span>{[db.city, db.st, db.co].filter(Boolean).join(', ')}</span>
                </div>
                {db.pastor && (
                  <div className="ch-pastor">
                    {db.role || 'Lead Pastor'}: <b>{db.pastor}</b>
                  </div>
                )}
                <div className="ch-stats">
                  <div className="stat hl">
                    <b>{writers.length}</b>
                    <span>Writers active</span>
                  </div>
                  <div className="stat">
                    <b>{notes.length}</b>
                    <span>Sermon notes</span>
                  </div>
                </div>
                <p className="ch-desc">{db.desc}</p>
                {writers.length > 0 && (
                  <div className="ch-writers">
                    <span className="cw-l">Writers for this church</span>
                    <div className="cw-r">
                      {writers.slice(0, 3).map(w => (
                        <span key={w.id} className="av" style={{ background: w.col }}>{w.ini}</span>
                      ))}
                      <span className="cw-n">{writerNames}</span>
                    </div>
                  </div>
                )}
                <div className="ch-actions">
                  <button className="btn-soft" onClick={() => onOpenChurch(ch)}>
                    <BookIcon /> View {notes.length} Note{notes.length === 1 ? '' : 's'}
                  </button>
                  <button className="btn-line" onClick={() => onOpenChurch(ch)}>
                    Explore {writers.length} Writer{writers.length === 1 ? '' : 's'}
                  </button>
                  <button className="btn-line" onClick={() => onOpenChurch(ch, true)}>
                    🔖 Bulletin QR
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {!isFiltered && (
        <>
          <div className="sec-label" style={{ padding: '0 20px', marginTop: '22px' }}>Kids corner</div>
          <div className="xscroll">
            {kidsSermons.map(p => (
              <div key={p.id} className="kmini" onClick={() => onOpenPost(p.id)}>
                <div className="kart" style={{ background: KGRAD[p.kidsart || 'lion'] || KGRAD.lion }}>
                  <KidArt kind={p.kidsart} />
                </div>
                <div className="kin">
                  <h3>{p.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="sec-label" style={{ padding: '0 20px', marginTop: '10px' }}>Featured series</div>
          <div className="xscroll">
            {seriesNames.map(n => {
              const count = sermons.filter(p => p.series === n).length;
              return (
                <div
                  key={n}
                  className="xcard"
                  style={{ background: seriesCol(n) }}
                  onClick={() => onOpenSeries(n)}
                >
                  <span>{n}</span>
                  <em>{count} note{count === 1 ? '' : 's'}</em>
                </div>
              );
            })}
          </div>

          <div className="sec-label" style={{ padding: '0 20px', marginTop: '12px' }}>Trending tags</div>
          <div className="chips" style={{ padding: '0 20px' }}>
            {TREND.map(t => (
              <button key={t} className="chip" onClick={() => onSelectTag(t)}>
                #{t}
              </button>
            ))}
          </div>
        </>
      )}

      <div style={{ height: '24px' }} />
    </section>
  );
};

// -------------------------------------------------------------
// TRENDY VIEW
// -------------------------------------------------------------
interface TrendyViewProps {
  sermons: Sermon[];
  devos: Devo[];
  contributors: Contributor[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  followMap: Record<string, boolean>;
  onToggleFollow: (id: string) => void;
  onOpenPost: (id: string) => void;
  onOpenStoryUser: (authorId: string) => void;
  onOpenContributor: (authorId: string) => void;
  onOpenSeries: (name: string) => void;
  onSelectTag: (tag: string) => void;
}

export const TrendyView: React.FC<TrendyViewProps> = ({
  sermons,
  devos,
  contributors,
  searchQuery,
  setSearchQuery,
  followMap,
  onToggleFollow,
  onOpenPost,
  onOpenStoryUser,
  onOpenContributor,
  onOpenSeries,
  onSelectTag,
}) => {
  const q = searchQuery.trim().toLowerCase();

  const hotPosts = [...sermons]
    .sort((a, b) => {
      const scoreA = a.amen + (a.refl ? a.refl.length * 2 : 0);
      const scoreB = b.amen + (b.refl ? b.refl.length * 2 : 0);
      return scoreB - scoreA;
    })
    .slice(0, 6);

  const seriesNames: string[] = [];
  sermons.forEach(p => {
    if (p.series && p.focus !== 'Kids' && !seriesNames.includes(p.series)) {
      seriesNames.push(p.series);
    }
  });

  const matchingPosts = q
    ? sermons.filter(p => `${p.title} ${p.church} ${p.speaker} ${p.tags.join(' ')} ${p.series || ''}`.toLowerCase().includes(q))
    : [];

  const matchingContributors = q
    ? contributors.filter(c => `${c.name} ${c.church} ${c.doc} ${c.loc}`.toLowerCase().includes(q))
    : [];

  const matchingDevos = q
    ? devos.filter(d => `${d.title} ${d.scr || ''} ${d.text}`.toLowerCase().includes(q))
    : [];

  return (
    <section className="view on" id="view-trendy">
      <header className="page-head">
        <h1>Trending</h1>
        <p>What the community is engaging right now.</p>
      </header>

      <div className="searchwrap">
        <label className="search">
          <SearchIcon />
          <input
            placeholder="Search preacher, sermon, church, tag…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </label>
      </div>

      {q ? (
        <div>
          <div className="sec-label" style={{ padding: '0 20px' }}>
            Sermons · {matchingPosts.length}
          </div>
          {matchingPosts.length > 0 ? (
            matchingPosts.map(p => {
              const author = getContributor(p.by);
              return (
                <article key={p.id} className="crow" onClick={() => onOpenPost(p.id)}>
                  <span className="av sm" style={{ background: author.col }}>{author.ini}</span>
                  <div className="c-mid">
                    <div className="c-t">{p.title}</div>
                    <div className="c-m">{p.church} · {p.speaker}</div>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="cs-bio" style={{ padding: '0 20px' }}>No sermons match.</p>
          )}

          <div className="sec-label" style={{ padding: '0 20px' }}>
            Devotions · {matchingDevos.length}
          </div>
          {matchingDevos.map(d => {
            const author = getContributor(d.by);
            return (
              <article key={d.id} className="crow" onClick={() => onOpenStoryUser(d.by)}>
                <span className="av sm" style={{ background: author.col }}>{author.ini}</span>
                <div className="c-mid">
                  <div className="c-t" style={{ fontSize: '14px' }}>{d.title}</div>
                  <div className="c-m">{d.scr} · {author.name}</div>
                </div>
                <span className="c-amen"><HeartIcon /> {d.amen}</span>
              </article>
            );
          })}

          <div className="sec-label" style={{ padding: '0 20px' }}>
            Contributors · {matchingContributors.length}
          </div>
          {matchingContributors.map(c => (
            <article key={c.id} className="crow" onClick={() => onOpenContributor(c.id)}>
              <span className="av sm" style={{ background: c.col }}>{c.ini}</span>
              <div className="c-mid">
                <div className="c-t">{c.name} {c.ver && <VerIcon />}</div>
                <div className="c-m">{c.church} · {c.doc}</div>
              </div>
              <button
                className={`follow ${followMap[c.id] ? 'on' : ''}`}
                onClick={(e) => { e.stopPropagation(); onToggleFollow(c.id); }}
              >
                {followMap[c.id] ? 'Following' : 'Follow'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div>
          <div className="sec-label" style={{ padding: '0 20px' }}>Hot right now</div>
          <div>
            {hotPosts.map((p, i) => {
              const author = getContributor(p.by);
              return (
                <article key={p.id} className="crow" onClick={() => onOpenPost(p.id)}>
                  <span className={`medal ${i < 3 ? `m${i + 1}` : ''}`} style={{ marginTop: 0 }}>
                    {i + 1}
                  </span>
                  <div className="c-mid">
                    <div className="c-t">{p.title}</div>
                    <div className="c-m">{p.church} · {p.speaker}</div>
                  </div>
                  <span className="c-amen">
                    <HeartIcon /> {p.amen + ((p.refl || []).length * 2)}
                  </span>
                </article>
              );
            })}
          </div>

          <div className="sec-label" style={{ padding: '0 20px' }}>Trending tags</div>
          <div className="chips" style={{ padding: '0 20px' }}>
            {TREND.map(t => (
              <button key={t} className="chip" onClick={() => onSelectTag(t)}>
                #{t}
              </button>
            ))}
          </div>

          <div className="sec-label" style={{ padding: '0 20px' }}>Featured series</div>
          <div className="xscroll">
            {seriesNames.map(n => {
              const count = sermons.filter(p => p.series === n).length;
              return (
                <div
                  key={n}
                  className="xcard"
                  style={{ background: seriesCol(n) }}
                  onClick={() => onOpenSeries(n)}
                >
                  <span>{n}</span>
                  <em>{count} note{count === 1 ? '' : 's'}</em>
                </div>
              );
            })}
          </div>

          <div style={{ height: '24px' }} />
        </div>
      )}
    </section>
  );
};

// -------------------------------------------------------------
// VOICES VIEW
// -------------------------------------------------------------
interface VoicesViewProps {
  contributors: Contributor[];
  followMap: Record<string, boolean>;
  onToggleFollow: (id: string) => void;
  onOpenContributor: (id: string) => void;
}

export const VoicesView: React.FC<VoicesViewProps> = ({
  contributors,
  followMap,
  onToggleFollow,
  onOpenContributor,
}) => {
  const [vLoc, setVLoc] = useState('All');
  const [vDoc, setVDoc] = useState('All');
  const [vAge, setVAge] = useState('All');

  const filtered = contributors
    .filter(c => {
      if (vLoc !== 'All' && c.loc !== vLoc) return false;
      if (vDoc !== 'All' && c.doc !== vDoc) return false;
      if (vAge !== 'All' && !c.focus.includes(vAge)) return false;
      return true;
    })
    .sort((a, b) => b.followers - a.followers);

  return (
    <section className="view on" id="view-voices">
      <header className="page-head">
        <h1>Community Voices</h1>
        <p>Contributors enriching the Body of Christ.</p>
      </header>

      {/* Filter rows */}
      <div style={{ marginTop: '6px' }}>
        <div className="sec-label" style={{ padding: '0 20px' }}>Location</div>
        <div className="hchips">
          {LOCS.map(l => (
            <button
              key={l}
              className={`q ${vLoc === l ? 'on' : ''}`}
              onClick={() => setVLoc(l)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="sec-label" style={{ padding: '0 20px' }}>Church doctrine</div>
        <div className="hchips">
          {DOCS.map(d => (
            <button
              key={d}
              className={`q ${vDoc === d ? 'on' : ''}`}
              onClick={() => setVDoc(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="sec-label" style={{ padding: '0 20px' }}>Sermon focus</div>
        <div className="hchips">
          {AGES.map(a => (
            <button
              key={a}
              className={`q ${vAge === a ? 'on' : ''}`}
              onClick={() => setVAge(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="sec-label" style={{ padding: '0 20px' }}>
        Contributors <span className="count">· {filtered.length} match</span>
      </div>

      <div>
        {filtered.length === 0 ? (
          <div className="empty">
            <div className="big">No contributors match</div>
            <p>Try removing a filter.</p>
          </div>
        ) : (
          filtered.map((c, i) => {
            const rank = i + 1;
            const isFollowing = !!followMap[c.id];
            return (
              <article
                key={c.id}
                className="vcard"
                onClick={() => onOpenContributor(c.id)}
              >
                <span className={`medal ${rank <= 3 ? `m${rank}` : ''}`}>{rank}</span>
                <span className="av" style={{ background: c.col }}>{c.ini}</span>
                <div className="v-mid">
                  <div className="v-name">{c.name} {c.ver && <VerIcon />}</div>
                  <div className="v-sub">{c.doc} · {c.loc}</div>
                  <div className="v-ch">{c.church}</div>
                  <div className="v-stats">
                    {c.notes} notes · {c.followers + (isFollowing ? 1 : 0)} followers
                  </div>
                  <div className="v-fp">
                    {c.focus.map(f => (
                      <span key={f} className={`fp f-${f === 'Kids' ? 'k' : f === 'Teens' ? 't' : 'a'}`}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  className={`follow ${isFollowing ? 'on' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onToggleFollow(c.id); }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </article>
            );
          })
        )}
      </div>

      <div style={{ height: '24px' }} />
    </section>
  );
};

// -------------------------------------------------------------
// PROFILE VIEW
// -------------------------------------------------------------
interface ProfileViewProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  mySermons: Sermon[];
  myDevos: Devo[];
  privateNotes: PrivateNote[];
  drafts: DraftItem[];
  scheduled: SchedItem[];
  bookmarkedSermons: Sermon[];
  onOpenPost: (id: string) => void;
  onOpenStoryUser: (id: string) => void;
  onEditDraft: (draft: DraftItem, index: number) => void;
  onCancelScheduled: (index: number) => void;
  onToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
  mySermons,
  myDevos,
  privateNotes,
  drafts,
  scheduled,
  bookmarkedSermons,
  onOpenPost,
  onOpenStoryUser,
  onEditDraft,
  onCancelScheduled,
  onToast,
}) => {
  const [ptab, setPtab] = useState<'pub' | 'draft' | 'lib'>('pub');

  if (!isOpen) return null;

  const totalAmens =
    mySermons.reduce((acc, p) => acc + p.amen, 0) +
    myDevos.reduce((acc, d) => acc + d.amen, 0);

  const hasDevoToday = myDevos.length > 0;
  const manna = [1, 1, 0, 1, 1, 0, hasDevoToday ? 1 : 0];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <div className="full open" style={{ zIndex: 66 }}>
      <div className="ftop">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div className="flabel">Profile</div>
        <button className="icon-btn" onClick={onOpenSettings}>⚙</button>
      </div>

      <div className="fbody" id="pBody">
        <div className="p-head">
          <span className="av lg" style={{ background: YOU.col }}>{YOU.ini}</span>
          <div>
            <div className="v-name" style={{ fontSize: '19px' }}>You</div>
            <div className="v-sub">{YOU.church} · {YOU.doc}</div>
          </div>
          <button
            className="follow"
            style={{ marginLeft: 'auto' }}
            onClick={() => onToast('Profile editing opens here')}
          >
            Edit
          </button>
        </div>

        <div className="p-stats">
          <div className="stat">
            <b>{mySermons.length + myDevos.length}</b>
            <span>Posts</span>
          </div>
          <div className="stat hl">
            <b>{totalAmens}</b>
            <span>Amens</span>
          </div>
          <div className="stat">
            <b>{YOU.followers}</b>
            <span>Followers</span>
          </div>
        </div>

        <div className="sec-label" style={{ marginTop: '8px' }}>Manna gathered this week</div>
        <div className="manna">
          {manna.map((f, i) => (
            <div key={i} className={`mday ${f ? 'f' : ''} ${i === 6 ? 't' : ''}`}>
              <i />
              <span>{days[i]}</span>
            </div>
          ))}
        </div>

        <div className="tabs" style={{ marginTop: '16px' }}>
          <button
            className={`tab ${ptab === 'pub' ? 'on' : ''}`}
            onClick={() => setPtab('pub')}
          >
            Published
          </button>
          <button
            className={`tab ${ptab === 'draft' ? 'on' : ''}`}
            onClick={() => setPtab('draft')}
          >
            Drafts &amp; Scheduled
          </button>
          <button
            className={`tab ${ptab === 'lib' ? 'on' : ''}`}
            onClick={() => setPtab('lib')}
          >
            Library
          </button>
        </div>

        {ptab === 'pub' && (
          <div>
            {mySermons.map(p => (
              <article
                key={p.id}
                className="crow"
                onClick={() => { onClose(); onOpenPost(p.id); }}
                style={{ padding: '13px 0' }}
              >
                <span className="nic" style={{ width: '30px', height: '30px' }}><BookIcon /></span>
                <div className="c-mid">
                  <div className="c-t" style={{ fontSize: '14px' }}>{p.title}</div>
                  <div className="c-m">{p.date} · {p.amen} amens</div>
                </div>
                {p.chOnly && <span className="m-tag">Church only</span>}
              </article>
            ))}
            {privateNotes.map(pr => (
              <article
                key={pr.id}
                className="crow"
                onClick={() => onToast('Private note — visible only to you')}
                style={{ padding: '13px 0' }}
              >
                <span className="nic" style={{ width: '30px', height: '30px' }}>🔒</span>
                <div className="c-mid">
                  <div className="c-t" style={{ fontSize: '14px' }}>{pr.title}</div>
                  <div className="c-m">Private · {pr.date}</div>
                </div>
              </article>
            ))}
            {myDevos.map(d => (
              <article
                key={d.id}
                className="crow"
                onClick={() => { onClose(); onOpenStoryUser('you'); }}
                style={{ padding: '13px 0' }}
              >
                <span className="nic" style={{ width: '30px', height: '30px' }}><SunIcon /></span>
                <div className="c-mid">
                  <div className="c-t" style={{ fontSize: '14px' }}>{d.title}</div>
                  <div className="c-m">Devotion · {d.amen} amens</div>
                </div>
              </article>
            ))}
            {mySermons.length === 0 && privateNotes.length === 0 && myDevos.length === 0 && (
              <p className="cs-bio">Nothing published yet — tap Write to begin.</p>
            )}
          </div>
        )}

        {ptab === 'draft' && (
          <div>
            {drafts.length > 0 ? (
              drafts.map((d, i) => (
                <article
                  key={i}
                  className="crow"
                  onClick={() => { onClose(); onEditDraft(d, i); }}
                  style={{ padding: '13px 0' }}
                >
                  <span className="nic" style={{ width: '30px', height: '30px' }}>✏️</span>
                  <div className="c-mid">
                    <div className="c-t" style={{ fontSize: '14px' }}>{d.title || 'Untitled draft'}</div>
                    <div className="c-m">Draft · {d.date}</div>
                  </div>
                </article>
              ))
            ) : (
              <p className="cs-bio">No drafts.</p>
            )}

            {scheduled.length > 0 && (
              <>
                <div className="sec-label">Scheduled</div>
                {scheduled.map((s, i) => (
                  <article key={i} className="crow" style={{ padding: '13px 0', cursor: 'default' }}>
                    <span className="nic" style={{ width: '30px', height: '30px' }}>🕒</span>
                    <div className="c-mid">
                      <div className="c-t" style={{ fontSize: '14px' }}>{s.title}</div>
                      <div className="c-m">{new Date(s.when).toLocaleString()}</div>
                    </div>
                    <button className="quiet danger" onClick={() => onCancelScheduled(i)}>
                      Cancel
                    </button>
                  </article>
                ))}
              </>
            )}
          </div>
        )}

        {ptab === 'lib' && (
          <div>
            {bookmarkedSermons.length > 0 ? (
              bookmarkedSermons.map(p => (
                <article
                  key={p.id}
                  className="crow"
                  onClick={() => { onClose(); onOpenPost(p.id); }}
                  style={{ padding: '13px 0' }}
                >
                  <span className="nic" style={{ width: '30px', height: '30px' }}><BkSmIcon /></span>
                  <div className="c-mid">
                    <div className="c-t" style={{ fontSize: '14px' }}>{p.title}</div>
                    <div className="c-m">{p.church}</div>
                  </div>
                </article>
              ))
            ) : (
              <p className="cs-bio">Bookmark notes with the ribbon icon to build your library.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
