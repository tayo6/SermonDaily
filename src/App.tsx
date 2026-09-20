import React, { useState, useEffect } from 'react';
import {
  Sermon,
  Devo,
  NotificationItem,
  DraftItem,
  SchedItem,
  PrivateNote,
} from './types';
import {
  CHURCH_DB,
  CONTRIBUTORS,
  INITIAL_SERMONS,
  INITIAL_DEVOS,
  INITIAL_NOTIFS,
  INITIAL_SCHED,
} from './data';
import { LogoIcon, BellIcon } from './components/Icons';
import { HomeView, ExploreView, TrendyView, VoicesView, ProfileView } from './components/Views';
import {
  ChurchSheet,
  ContributorSheet,
  VerseSheet,
  VersePage,
  SeriesPage,
  NotificationsSheet,
} from './components/Sheets';
import { ReaderModal } from './components/ReaderModal';
import { ShareCardModal } from './components/ShareCardModal';
import { EditorModal } from './components/EditorModal';
import { DevotionStoryModal } from './components/DevotionStoryModal';
import { LiveCapture } from './components/LiveCapture';
import { StoryViewer } from './components/StoryViewer';

export default function App() {
  // Navigation & Appearance
  const [tab, setTab] = useState<'home' | 'explore' | 'trendy' | 'voices' | 'write'>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [reminder, setReminder] = useState(true);

  // Home view filters & layout
  const [ftab, setFtab] = useState<'discover' | 'following'>('discover');
  const [layoutStyle, setLayoutStyle] = useState<'edit' | 'cards' | 'compact'>('edit');
  const [focusFilter, setFocusFilter] = useState<'all' | 'sermon' | 'kids'>('all');

  // Search in Trendy
  const [trendySearch, setTrendySearch] = useState('');

  // Core collections
  const [sermons, setSermons] = useState<Sermon[]>(INITIAL_SERMONS);
  const [devos, setDevos] = useState<Devo[]>(INITIAL_DEVOS);
  const [notifs, setNotifs] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [scheduled, setScheduled] = useState<SchedItem[]>(INITIAL_SCHED);
  const [privateNotes, setPrivateNotes] = useState<PrivateNote[]>([]);

  // Engagement maps
  const [followMap, setFollowMap] = useState<Record<string, boolean>>({});
  const [churchFollowMap, setChurchFollowMap] = useState<Record<string, boolean>>({});
  const [seriesFollowMap, setSeriesFollowMap] = useState<Record<string, boolean>>({});
  const [amenMap, setAmenMap] = useState<Record<string, boolean>>({});
  const [amenDMap, setAmenDMap] = useState<Record<string, boolean>>({});
  const [bookmarksMap, setBookmarksMap] = useState<Record<string, boolean>>({});
  const [seenDevos, setSeenDevos] = useState<Record<string, boolean>>({});

  // Active sheets & overlays
  const [readerPostId, setReaderPostId] = useState<string | null>(null);
  const [verseRef, setVerseRef] = useState<string | null>(null);
  const [versePageRef, setVersePageRef] = useState<string | null>(null);
  const [seriesName, setSeriesName] = useState<string | null>(null);
  const [cardPost, setCardPost] = useState<Sermon | null>(null);
  const [churchSheet, setChurchSheet] = useState<{ name: string; qrOnly?: boolean } | null>(null);
  const [contribSheetId, setContribSheetId] = useState<string | null>(null);
  const [notifSheetOpen, setNotifSheetOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [devoStoryModalOpen, setDevoStoryModalOpen] = useState(false);
  const [liveCapOpen, setLiveCapOpen] = useState(false);
  const [storyUser, setStoryUser] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  // Theme synchronization
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Keyboard escape listener to close overlays
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReaderPostId(null);
        setVerseRef(null);
        setVersePageRef(null);
        setSeriesName(null);
        setCardPost(null);
        setChurchSheet(null);
        setContribSheetId(null);
        setNotifSheetOpen(false);
        setProfileOpen(false);
        setSettingsOpen(false);
        setEditorOpen(false);
        setDevoStoryModalOpen(false);
        setLiveCapOpen(false);
        setStoryUser(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Toggles
  const handleToggleAmen = (id: string) => {
    setAmenMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAmenD = (id: string) => {
    setAmenDMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleFollow = (authorId: string) => {
    const next = !followMap[authorId];
    setFollowMap(prev => ({ ...prev, [authorId]: next }));
    const author = CONTRIBUTORS.find(c => c.id === authorId);
    showToast(next ? `Following ${author?.name || authorId}` : 'Unfollowed');
  };

  const handleToggleFollowChurch = (name: string) => {
    const next = !churchFollowMap[name];
    setChurchFollowMap(prev => ({ ...prev, [name]: next }));
    showToast(next ? `Following ${name}` : 'Unfollowed');
  };

  const handleToggleFollowSeries = (name: string) => {
    const next = !seriesFollowMap[name];
    setSeriesFollowMap(prev => ({ ...prev, [name]: next }));
    showToast(next ? `Following “${name}” — new notes will notify you` : 'Unfollowed series');
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarksMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenStoryUser = (authorId: string) => {
    setStoryUser(authorId);
    // Mark seen
    const userDevo = devos.find(d => d.by === authorId);
    if (userDevo) {
      setSeenDevos(prev => ({ ...prev, [userDevo.id]: true }));
    }
  };

  const handleAddReflection = (postId: string, text: string, audioUrl?: string, audioDuration?: number) => {
    setSermons(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const refl = p.refl ? [...p.refl] : [];
          refl.push({ by: 'you', txt: text, audioUrl, audioDuration });
          return { ...p, refl };
        }
        return p;
      })
    );
  };

  // Nav click
  const handleNavClick = (newTab: 'home' | 'explore' | 'trendy' | 'voices' | 'write') => {
    if (newTab === 'write') {
      setEditorOpen(true);
    } else {
      setTab(newTab);
    }
  };

  const activeReaderPost = sermons.find(p => p.id === readerPostId) || null;

  return (
    <>
      <div className="phone">
      <div className="stage">
        {/* Topbar */}
        <div className="topbar">
          <div className="wordmark">
            <LogoIcon />
            Sermon Daily
          </div>
          <button
            className="icon-btn"
            aria-label="Notifications"
            onClick={() => setNotifSheetOpen(true)}
          >
            <BellIcon />
            {notifs.length > 0 && <span className="nbdot">{notifs.length}</span>}
          </button>
          <button className="myav" onClick={() => setProfileOpen(true)}>
            ME
          </button>
        </div>

        {/* Main View Area */}
        <div className="main">
          {tab === 'home' && (
            <HomeView
              sermons={sermons}
              devos={devos}
              scheduled={scheduled}
              ftab={ftab}
              setFtab={setFtab}
              layoutStyle={layoutStyle}
              setLayoutStyle={setLayoutStyle}
              focusFilter={focusFilter}
              setFocusFilter={setFocusFilter}
              followMap={followMap}
              churchFollowMap={churchFollowMap}
              seriesFollowMap={seriesFollowMap}
              seenDevos={seenDevos}
              amenMap={amenMap}
              onToggleAmen={handleToggleAmen}
              onToggleFollow={handleToggleFollow}
              onOpenPost={(id) => setReaderPostId(id)}
              onOpenStoryUser={handleOpenStoryUser}
              onAddDevotionStory={() => {
                setDevoStoryModalOpen(true);
              }}
              onGoVoices={() => setTab('voices')}
              onToast={showToast}
            />
          )}

          {tab === 'explore' && (
            <ExploreView
              churchDb={CHURCH_DB}
              contributors={CONTRIBUTORS}
              sermons={sermons}
              churchFollowMap={churchFollowMap}
              onToggleFollowChurch={handleToggleFollowChurch}
              onOpenChurch={(name, qrOnly) => setChurchSheet({ name, qrOnly })}
              onOpenPost={(id) => setReaderPostId(id)}
              onOpenSeries={(name) => setSeriesName(name)}
              onSelectTag={(tag) => {
                setTab('trendy');
                setTrendySearch(tag);
              }}
            />
          )}

          {tab === 'trendy' && (
            <TrendyView
              sermons={sermons}
              devos={devos}
              contributors={CONTRIBUTORS}
              searchQuery={trendySearch}
              setSearchQuery={setTrendySearch}
              followMap={followMap}
              onToggleFollow={handleToggleFollow}
              onOpenPost={(id) => setReaderPostId(id)}
              onOpenStoryUser={handleOpenStoryUser}
              onOpenContributor={(id) => setContribSheetId(id)}
              onOpenSeries={(name) => setSeriesName(name)}
              onSelectTag={(tag) => setTrendySearch(tag)}
            />
          )}

          {tab === 'voices' && (
            <VoicesView
              contributors={CONTRIBUTORS}
              followMap={followMap}
              onToggleFollow={handleToggleFollow}
              onOpenContributor={(id) => setContribSheetId(id)}
            />
          )}
        </div>

        {/* Story Viewer Overlay */}
        <StoryViewer
          isOpen={!!storyUser}
          onClose={() => setStoryUser(null)}
          devos={devos.filter(d => d.by === storyUser)}
          authorId={storyUser || 'you'}
          onOpenContributor={(id) => setContribSheetId(id)}
          amenD={amenDMap}
          onToggleAmenD={handleToggleAmenD}
        />

        {/* Full Reader Overlay */}
        <ReaderModal
          post={activeReaderPost}
          onClose={() => setReaderPostId(null)}
          allSermons={sermons}
          isBookmarked={!!bookmarksMap[activeReaderPost?.id || '']}
          onToggleBookmark={handleToggleBookmark}
          isFollowingAuthor={!!followMap[activeReaderPost?.by || '']}
          onToggleFollowAuthor={handleToggleFollow}
          isAmen={!!amenMap[activeReaderPost?.id || '']}
          onToggleAmen={handleToggleAmen}
          onOpenCard={(p) => setCardPost(p)}
          onOpenVerse={(ref) => setVerseRef(ref)}
          onOpenSeries={(name) => setSeriesName(name)}
          onOpenAnotherPost={(id) => setReaderPostId(id)}
          onAddReflection={handleAddReflection}
          onToast={showToast}
        />

        {/* Verse Sheet & Verse Page */}
        <VerseSheet
          verseRef={verseRef}
          onClose={() => setVerseRef(null)}
          sermons={sermons}
          onOpenVersePage={(ref) => setVersePageRef(ref)}
        />
        <VersePage
          verseRef={versePageRef}
          onClose={() => setVersePageRef(null)}
          sermons={sermons}
          onOpenPost={(id) => setReaderPostId(id)}
        />

        {/* Series Page */}
        <SeriesPage
          seriesName={seriesName}
          onClose={() => setSeriesName(null)}
          sermons={sermons}
          isFollowing={!!seriesFollowMap[seriesName || '']}
          onToggleFollow={handleToggleFollowSeries}
          onOpenPost={(id) => setReaderPostId(id)}
        />

        {/* WhatsApp Share Card Modal */}
        <ShareCardModal
          post={cardPost}
          onClose={() => setCardPost(null)}
          onToast={showToast}
        />

        {/* Church Sheet */}
        <ChurchSheet
          churchName={churchSheet?.name || null}
          qrOnly={churchSheet?.qrOnly}
          onClose={() => setChurchSheet(null)}
          churchDb={CHURCH_DB}
          contributors={CONTRIBUTORS}
          sermons={sermons}
          isFollowingChurch={!!churchFollowMap[churchSheet?.name || '']}
          onToggleFollowChurch={handleToggleFollowChurch}
          isFollowingContributor={(id) => !!followMap[id]}
          onToggleFollowContributor={handleToggleFollow}
          onOpenContributor={(id) => setContribSheetId(id)}
          onOpenPost={(id) => setReaderPostId(id)}
        />

        {/* Contributor Sheet */}
        <ContributorSheet
          authorId={contribSheetId}
          onClose={() => setContribSheetId(null)}
          sermons={sermons}
          devos={devos}
          isFollowing={!!followMap[contribSheetId || '']}
          onToggleFollow={handleToggleFollow}
          onOpenPost={(id) => setReaderPostId(id)}
          onOpenStoryUser={handleOpenStoryUser}
          onToast={showToast}
        />

        {/* Notifications Sheet */}
        <NotificationsSheet
          isOpen={notifSheetOpen}
          onClose={() => setNotifSheetOpen(false)}
          notifs={notifs}
          onSelectNotif={(n, i) => {
            setNotifs(prev => prev.filter((_, idx) => idx !== i));
            setNotifSheetOpen(false);
            if (n.pid) setReaderPostId(n.pid);
            else if (n.t === 'devo') handleOpenStoryUser(n.by);
            else setContribSheetId(n.by);
          }}
        />

        {/* Profile Overlay */}
        <ProfileView
          isOpen={profileOpen}
          onClose={() => setProfileOpen(false)}
          onOpenSettings={() => setSettingsOpen(true)}
          mySermons={sermons.filter(s => s.by === 'you')}
          myDevos={devos.filter(d => d.by === 'you')}
          privateNotes={privateNotes}
          drafts={drafts}
          scheduled={scheduled}
          bookmarkedSermons={sermons.filter(s => bookmarksMap[s.id])}
          onOpenPost={(id) => setReaderPostId(id)}
          onOpenStoryUser={handleOpenStoryUser}
          onEditDraft={(d, i) => {
            setDrafts(prev => prev.filter((_, idx) => idx !== i));
            setEditorOpen(true);
            showToast('Editing draft');
          }}
          onCancelScheduled={(i) => {
            setScheduled(prev => prev.filter((_, idx) => idx !== i));
            showToast('Scheduled post cancelled');
          }}
          onToast={showToast}
        />

        {/* Settings Sheet */}
        {settingsOpen && (
          <>
            <div className="backdrop open" onClick={() => setSettingsOpen(false)} />
            <div className="sheet open">
              <div className="grabber" />
              <div className="sheet-head">
                <h2>Settings</h2>
                <button className="icon-btn" onClick={() => setSettingsOpen(false)}>✕</button>
              </div>
              <div className="sheet-body">
                <div className="sec-label">Appearance</div>
                <div className="chips">
                  <button
                    className={`q ${theme === 'light' ? 'on' : ''}`}
                    onClick={() => setTheme('light')}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={`q ${theme === 'dark' ? 'on' : ''}`}
                    onClick={() => setTheme('dark')}
                  >
                    🌙 Dark
                  </button>
                </div>
                <div className="setrow">
                  <b>Morning devotion reminder</b>
                  <span className="v-sub">6:30 AM daily</span>
                  <button
                    className={`tgl ${reminder ? 'on' : ''}`}
                    onClick={() => {
                      const next = !reminder;
                      setReminder(next);
                      showToast(next ? 'Morning reminder on — 6:30 AM' : 'Reminder off');
                    }}
                  >
                    <i />
                  </button>
                </div>
                <div className="setrow">
                  <b>Community guidelines</b>
                  <button
                    className="quiet"
                    onClick={() => showToast('Be kind. Give honour. Report what is un-Christlike.')}
                  >
                    View
                  </button>
                </div>
                <p className="ob-note" style={{ textAlign: 'left' }}>
                  Reminders fire via push in production — mocked here.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Editor Modal for Feed Posts (like an Instagram Feed Post) */}
        <EditorModal
          isOpen={editorOpen}
          onClose={() => setEditorOpen(false)}
          onOpenLive={() => setLiveCapOpen(true)}
          onPublishSermon={(newS) => {
            setSermons(prev => [newS, ...prev]);
            setTab('home');
            showToast('Your note is live in the feed');
          }}
          onSavePrivate={(pNote) => {
            setPrivateNotes(prev => [pNote, ...prev]);
            showToast('Saved to your private notes');
          }}
          onSaveDraft={(draft) => {
            setDrafts(prev => [draft, ...prev]);
          }}
          onSchedule={(item) => {
            setScheduled(prev => [item, ...prev]);
          }}
          onToast={showToast}
        />

        {/* Morning Devotion Story Modal (like an Instagram Story) */}
        <DevotionStoryModal
          isOpen={devoStoryModalOpen}
          onClose={() => setDevoStoryModalOpen(false)}
          onPublishStory={(newD) => {
            setDevos(prev => [newD, ...prev]);
            setTab('home');
            showToast('Your devotion story is live at the top of the feed');
          }}
          onToast={showToast}
        />

        {/* Live Capture Modal */}
        <LiveCapture
          isOpen={liveCapOpen}
          onClose={() => setLiveCapOpen(false)}
          onTransfer={(html) => {
            const noteEl = document.querySelector('.edview .note') as HTMLDivElement | null;
            if (noteEl) {
              if (noteEl.innerHTML.trim()) {
                noteEl.innerHTML += `<br>${html}`;
              } else {
                noteEl.innerHTML = html;
              }
            }
          }}
          onToast={showToast}
        />

        {/* Floating Toast */}
        <div className={`toast ${toastMsg ? 'show' : ''}`}>
          {toastMsg}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottomnav">
        <button
          className={`nv ${tab === 'home' ? 'on' : ''}`}
          onClick={() => handleNavClick('home')}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <path d="M9 22V12h6v10" />
          </svg>
          Home
        </button>
        <button
          className={`nv ${tab === 'explore' ? 'on' : ''}`}
          onClick={() => handleNavClick('explore')}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          Explore
        </button>
        <button
          className={`nv ${tab === 'trendy' ? 'on' : ''}`}
          onClick={() => handleNavClick('trendy')}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
          Trendy
        </button>
        <button
          className={`nv ${tab === 'voices' ? 'on' : ''}`}
          onClick={() => handleNavClick('voices')}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          Voices
        </button>
        <button
          className={`nv ${tab === 'write' ? 'on' : ''}`}
          onClick={() => handleNavClick('write')}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
          </svg>
          Write
        </button>
      </nav>
    </div>
    <div className="cap">Sermon Daily · v7.4 — devotion composer, awareness banner, voice reflections, hashtags hidden</div>
    </>
  );
}
