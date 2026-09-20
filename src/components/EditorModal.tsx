import React, { useState, useRef, useEffect } from 'react';
import { Sermon, Devo, DraftItem, SchedItem, PrivateNote } from '../types';
import { CHURCH_DB, YOU } from '../data';

interface EditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLive: () => void;
  onPublishSermon: (sermon: Sermon) => void;
  onSavePrivate: (note: PrivateNote) => void;
  onSaveDraft: (draft: DraftItem) => void;
  onSchedule: (sched: SchedItem) => void;
  onToast: (msg: string) => void;
}

const ECH = Object.keys(CHURCH_DB);
const ESP = ['Pastor Chris Tomlin', 'Mrs. Higgins', 'Bill Johnson'];
const ESUG = ['Worship', 'Prayer', 'Grace', 'Healing', 'Holy Spirit', 'Purpose', 'Discipleship', 'Love'];
const EAU = ['General Sermon', 'Kids Ministry', 'Youth Group', 'Conference'];

export const EditorModal: React.FC<EditorModalProps> = ({
  isOpen,
  onClose,
  onOpenLive,
  onPublishSermon,
  onSavePrivate,
  onSaveDraft,
  onSchedule,
  onToast,
}) => {
  const [title, setTitle] = useState('');
  const [church, setChurch] = useState(YOU.church);
  const [speaker, setSpeaker] = useState('Pastor Chris Tomlin');
  const [tags, setTags] = useState<string[]>(['Faith']);
  const [tagInput, setTagInput] = useState('');
  const [series, setSeries] = useState('');
  const [audience, setAudience] = useState('General Sermon');
  const [privacy, setPrivacy] = useState<'public' | 'church' | 'private'>('public');
  const [dateVal, setDateVal] = useState('');
  const [timeVal, setTimeVal] = useState('10:00');
  const [savingStatus, setSavingStatus] = useState<'Saved' | 'Saving…'>('Saved');

  // Share sheet state
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [schedBoxOpen, setSchedBoxOpen] = useState(false);
  const [schedWhen, setSchedWhen] = useState('');
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successChurchName, setSuccessChurchName] = useState('');
  const [successSubtitle, setSuccessSubtitle] = useState('');

  // Floating selection toolbar
  const [showSelBar, setShowSelBar] = useState(false);
  const [selBarPos, setSelBarPos] = useState({ x: 0, y: 0 });

  // Scripture popover
  const [showScripturePop, setShowScripturePop] = useState(false);
  const [scriptureInput, setScriptureInput] = useState('');
  const savedRangeRef = useRef<Range | null>(null);

  const noteRef = useRef<HTMLDivElement>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = new Date();
    setDateVal(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    );
  }, []);

  const countWords = (): number => {
    const text = noteRef.current ? noteRef.current.innerText.trim() : '';
    return text ? text.split(/\s+/).length : 0;
  };

  const markDirty = () => {
    setSavingStatus('Saving…');
    setTimeout(() => {
      setSavingStatus('Saved');
    }, 800);
  };

  const handleSelectionChange = () => {
    if (!isOpen || isShareSheetOpen) {
      setShowSelBar(false);
      return;
    }
    const sel = document.getSelection();
    if (!sel || !sel.rangeCount || sel.isCollapsed) {
      setShowSelBar(false);
      return;
    }
    const r = sel.getRangeAt(0);
    if (!noteRef.current || !noteRef.current.contains(r.commonAncestorContainer)) {
      setShowSelBar(false);
      return;
    }
    const rect = r.getBoundingClientRect();
    const stage = document.querySelector('.stage')?.getBoundingClientRect();
    if (!stage || (rect.width === 0 && rect.height === 0)) {
      setShowSelBar(false);
      return;
    }
    let x = rect.left + rect.width / 2 - stage.left - 85;
    x = Math.max(10, Math.min(x, stage.width - 180));
    let y = rect.top - stage.top - 54;
    if (y < 60) y = rect.bottom - stage.top + 10;
    setSelBarPos({ x, y });
    setShowSelBar(true);
  };

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  });

  const handleFormat = (cmd: string) => {
    if (cmd === 'h3') {
      document.execCommand('formatBlock', false, 'h3');
    } else {
      document.execCommand(cmd, false);
    }
    markDirty();
  };

  const openScripturePop = () => {
    const sel = document.getSelection();
    if (sel && sel.rangeCount && noteRef.current?.contains(sel.getRangeAt(0).startContainer)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    } else {
      savedRangeRef.current = null;
    }
    setShowScripturePop(true);
  };

  const handleAddScripture = () => {
    const ref = scriptureInput.trim();
    if (!ref) {
      onToast('Type a reference, e.g. John 3:16');
      return;
    }
    if (noteRef.current) {
      noteRef.current.focus();
      if (savedRangeRef.current) {
        const sel = document.getSelection();
        if (sel) {
          sel.removeAllRanges();
          sel.addRange(savedRangeRef.current);
        }
      }
      document.execCommand('insertHTML', false, `<span class="scripture" data-ref="${ref}">${ref}</span>&nbsp;`);
    }
    setScriptureInput('');
    setShowScripturePop(false);
    markDirty();
  };

  const handleAddCustomTag = () => {
    const t = tagInput.replace(/^#/, '').trim();
    if (!t) return;
    if (tags.includes(t)) {
      onToast('Already added');
      return;
    }
    setTags([...tags, t]);
    setTagInput('');
  };

  const handlePublish = () => {
    if (countWords() === 0) {
      onToast('Jot down even a verse or two before sharing');
      return;
    }
    const plain = (noteRef.current?.innerText || '').replace(/\s+/g, ' ').trim();
    const words = countWords();
    const firstLine = plain.split('\n')[0]?.slice(0, 52) || '';
    const finalTitle = title.trim() || firstLine || 'Untitled note';

    if (privacy === 'private') {
      const pNote: PrivateNote = {
        id: `u${Date.now()}`,
        title: finalTitle,
        html: noteRef.current?.innerHTML || '',
        date: 'Today',
      };
      onSavePrivate(pNote);
      setSuccessChurchName('Your private notes');
      setSuccessSubtitle('Saved privately. Only you can see it — find it in your Profile.');
    } else {
      const newSermon: Sermon = {
        id: `u${Date.now()}`,
        by: 'you',
        church,
        speaker,
        series,
        focus: audience === 'Kids Ministry' ? 'Kids' : audience === 'Youth Group' ? 'Teens' : 'Adults',
        kidsart: audience === 'Kids Ministry' ? 'lion' : undefined,
        title: finalTitle,
        excerpt: plain.slice(0, 150) || '…',
        tags: tags.slice(0, 4),
        date: 'Just now',
        read: `${Math.max(1, Math.round(words / 200))} min read`,
        amen: 0,
        media: null,
        time: timeVal,
        cat: audience,
        chOnly: privacy === 'church',
        body: [noteRef.current?.innerHTML || '<p>(empty)</p>'],
        refl: [],
      };
      onPublishSermon(newSermon);
      setSuccessChurchName(church);
      setSuccessSubtitle(
        privacy === 'church'
          ? `Shared with ${church} members only.`
          : 'Your post is now live in the community feed.'
      );
    }
    setIsSuccess(true);
  };

  const handleFinishSuccess = () => {
    setIsSuccess(false);
    setIsShareSheetOpen(false);
    onClose();
    setTitle('');
    if (noteRef.current) noteRef.current.innerHTML = '';
    setTags(['Faith']);
    setSeries('');
    setPrivacy('public');
  };

  if (!isOpen) return null;

  const notePlainText = noteRef.current ? noteRef.current.innerText.trim() : '';
  const firstLine = notePlainText.split('\n')[0]?.slice(0, 52) || '';
  const previewTitle = title.trim() || firstLine || 'Untitled note';

  return (
    <div className="edview open">
      <div className="topbar">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <b style={{ font: '700 15px var(--sans)' }}>New Feed Post</b>
          <span className={`save-status ${savingStatus === 'Saving…' ? 'saving' : ''}`}>
            <span className="dot"></span>
            <span>{savingStatus}</span>
          </span>
        </div>
        <button className="qa" onClick={onOpenLive} style={{ marginRight: '6px' }}>⚡ Live</button>
        <button className="btn-share" onClick={() => setIsShareSheetOpen(true)}>Share</button>
      </div>

      <div className="editor" ref={editorContainerRef} onScroll={() => setShowSelBar(false)}>
        <input
          className="title-input"
          value={title}
          onChange={(e) => { setTitle(e.target.value); markDirty(); }}
          placeholder="Sermon title…"
        />
        <div
          ref={noteRef}
          className="note"
          contentEditable
          suppressContentEditableWarning
          data-ph="What did the preacher speak today? Key scriptures, quotes, revelations…"
          onInput={markDirty}
        />
        <div className="quick">
          <button className="qa" onMouseDown={(e) => e.preventDefault()} onClick={openScripturePop}>
            📖 Scripture
          </button>
          <button
            className="qa"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              if (noteRef.current) {
                noteRef.current.focus();
                document.execCommand('formatBlock', false, 'h3');
                markDirty();
              }
            }}
          >
            ☰ Sub-topic
          </button>
          <button className="qa" onClick={() => onToast('Photo & file picker opens here')}>
            📷 Media
          </button>
        </div>
      </div>

      {/* Floating Selection Toolbar */}
      {showSelBar && (
        <div
          className="selbar show"
          style={{ left: `${selBarPos.x}px`, top: `${selBarPos.y}px` }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <button className="sb" onClick={() => handleFormat('bold')}>B</button>
          <button className="sb i" onClick={() => handleFormat('italic')}>I</button>
          <button className="sb" onClick={() => handleFormat('insertUnorderedList')}>≡</button>
          <button className="sb" onClick={() => handleFormat('h3')}>H</button>
        </div>
      )}

      {/* Scripture Popover */}
      {showScripturePop && (
        <div className="pop show">
          <input
            value={scriptureInput}
            onChange={(e) => setScriptureInput(e.target.value)}
            placeholder="e.g. John 3:16 or Psalm 23"
            onKeyDown={(e) => e.key === 'Enter' && handleAddScripture()}
            autoFocus
          />
          <button onClick={handleAddScripture}>Add</button>
        </div>
      )}

      {/* Details bar */}
      <div className="details-bar" onClick={() => setIsShareSheetOpen(true)}>
        <div className="db-icon">📍</div>
        <div className="db-text">
          <div className="db-t1">
            {church} · {speaker}
          </div>
          <div className="db-t2">
            {tags.slice(0, 2).map(t => `#${t}`).join(' ')} · {countWords()} words
          </div>
        </div>
        <span style={{ color: 'var(--ink-3)' }}>›</span>
      </div>

      {/* Share Sheet Backdrop & Sheet */}
      <div
        className={`backdrop ${isShareSheetOpen ? 'open' : ''}`}
        style={{ zIndex: 40 }}
        onClick={() => setIsShareSheetOpen(false)}
      />
      <div className={`sheet ${isShareSheetOpen ? 'open' : ''}`} style={{ zIndex: 45 }}>
        <div className="grabber" />
        <div className="sheet-head">
          <h2>Share to Feed</h2>
          <button className="icon-btn" onClick={() => setIsShareSheetOpen(false)}>✕</button>
        </div>

        {isSuccess ? (
          <div className="success">
            <div className="ring">✓</div>
            <div className="s-title">Shared to {successChurchName}</div>
            <p className="s-sub">{successSubtitle}</p>
            <div className="s-btns">
              <button className="ghost" onClick={handleFinishSuccess}>View in feed</button>
              <button className="btn-primary small" onClick={handleFinishSuccess}>Done</button>
            </div>
          </div>
        ) : (
          <>
            <div className="sheet-body">
              <div className="sec-label" style={{ marginTop: '14px' }}>Destination</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--paper)', border: '1px solid var(--line)', padding: '5px 12px', borderRadius: '999px', font: '600 12.5px var(--sans)', color: 'var(--ink)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)' }} />
                Community & Church Feed Post
              </div>

              {/* Live Preview Card */}
              <div className="feed-cap">How it appears in feed <span className="live"><i />LIVE</span></div>
              <div className="feed-card">
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div className="myav" style={{ width: '38px', height: '38px' }}>U</div>
                  <div>
                    <div className="fc-church">{church}</div>
                    <div className="fc-meta">
                      {dateVal} · {timeVal} · {speaker}
                    </div>
                  </div>
                </div>
                <div className="fc-title">{previewTitle}</div>
                <div className={`fc-ex ${!notePlainText ? 'empty' : ''}`}>
                  {notePlainText || 'Your post text will appear here…'}
                </div>
                <div className="fc-tags">
                  {series && <span className="fc-tag">{series}</span>}
                  {privacy !== 'public' && (
                    <span className="fc-tag">{privacy === 'private' ? '🔒 Private' : 'Church only'}</span>
                  )}
                  {tags.map((t, idx) => (
                    <span key={idx} className="fc-tag">#{t}</span>
                  ))}
                </div>
              </div>

              <div className="sec-label">Church</div>
              <div className="chips">
                {ECH.map((ch) => (
                  <button
                    key={ch}
                    className={`chip ${church === ch ? 'on' : ''}`}
                    onClick={() => setChurch(ch)}
                  >
                    {church === ch ? '✓ ' : ''}{ch}
                  </button>
                ))}
              </div>

              <div className="sec-label">Preacher / Speaker</div>
                  <div className="chips">
                    {ESP.map((sp) => (
                      <button
                        key={sp}
                        className={`chip ${speaker === sp ? 'on' : ''}`}
                        onClick={() => setSpeaker(sp)}
                      >
                        {speaker === sp ? '✓ ' : ''}{sp}
                      </button>
                    ))}
                  </div>

                  <div className="sec-label">Date &amp; Service Time</div>
                  <div className="row2">
                    <input
                      className="field"
                      type="date"
                      value={dateVal}
                      onChange={(e) => setDateVal(e.target.value)}
                    />
                    <input
                      className="field"
                      type="time"
                      value={timeVal}
                      onChange={(e) => setTimeVal(e.target.value)}
                    />
                  </div>

                  <div className="sec-label">Tags</div>
              <div className="chips">
                {tags.map((t) => (
                  <button
                    key={t}
                    className="chip on"
                    onClick={() => setTags(tags.filter(x => x !== t))}
                  >
                    #{t} ✕
                  </button>
                ))}
              </div>
              <div className="addrow">
                <input
                  className="field"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add custom tag…"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                />
                <button className="btn-add" onClick={handleAddCustomTag}>Add</button>
              </div>
              <div className="chips" style={{ marginTop: '10px' }}>
                {ESUG.filter(s => !tags.includes(s)).map((sug) => (
                  <button
                    key={sug}
                    className="chip"
                    onClick={() => setTags([...tags, sug])}
                  >
                    + #{sug}
                  </button>
                ))}
              </div>

              <div className="sec-label">Sermon Series</div>
              <input
                className="field"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
                list="seriesDatalist"
                placeholder="e.g. Identity &amp; Destiny"
              />
              <datalist id="seriesDatalist">
                <option>Heart of Worship</option>
                <option>Heroes of Faith</option>
                <option>Identity &amp; Destiny</option>
                <option>Grace &amp; Truth</option>
                <option>Kingdom Economics</option>
                <option>Kingdom Kids</option>
              </datalist>

              <div className="sec-label">Audience / Category</div>
              <div className="chips">
                {EAU.map((au) => (
                  <button
                    key={au}
                    className={`chip ${audience === au ? 'on' : ''}`}
                    onClick={() => setAudience(au)}
                  >
                    {audience === au ? '✓ ' : ''}{au}
                  </button>
                ))}
              </div>

              <div className="sec-label">Privacy</div>
              <div className="chips">
                {(['public', 'church', 'private'] as const).map((p) => {
                  const label = p === 'public' ? '🌍 Public' : p === 'church' ? '⛪ Church only' : '🔒 Private';
                  return (
                    <button
                      key={p}
                      className={`chip ${privacy === p ? 'on' : ''}`}
                      onClick={() => setPrivacy(p)}
                    >
                      {privacy === p ? '✓ ' : ''}{label}
                    </button>
                  );
                })}
              </div>

              <div className="sec-label">Media Links (optional)</div>
              <input className="field" placeholder="▶ Video link (YouTube or MP4)" style={{ marginBottom: '8px' }} />
              <input className="field" placeholder="🎤 Audio link (MP3 / Podcast)" />
            </div>

            <div className="sheet-actions">
              <button className="btn-primary" onClick={handlePublish}>
                Share to Feed
              </button>

              {schedBoxOpen && (
                <div style={{ marginTop: '10px' }}>
                  <div className="row2">
                    <input
                      className="field"
                      type="datetime-local"
                      value={schedWhen}
                      onChange={(e) => setSchedWhen(e.target.value)}
                    />
                    <button
                      className="btn-add"
                      style={{ borderRadius: '12px', padding: '11px 0' }}
                      onClick={() => {
                        if (!schedWhen) {
                          onToast('Pick a date & time first');
                          return;
                        }
                        onSchedule({
                          when: schedWhen,
                          title: title.trim() || firstLine || 'Untitled note',
                          by: 'you',
                          church: church.trim() || 'Hope Chapel',
                          html: noteRef.current?.innerHTML || '',
                        });
                        setSchedBoxOpen(false);
                        onToast(`Scheduled for ${new Date(schedWhen).toLocaleString()}`);
                        handleFinishSuccess();
                      }}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              )}

              {!confirmDiscard ? (
                <div className="quiet-row">
                  <button
                    className="quiet"
                    onClick={() => {
                      onSaveDraft({
                        title: title.trim() || 'Untitled draft',
                        html: noteRef.current?.innerHTML || '',
                        date: 'Today',
                      });
                      onToast('Draft saved — see your Profile');
                      setIsShareSheetOpen(false);
                    }}
                  >
                    Save as draft
                  </button>
                  <button className="quiet" onClick={() => setSchedBoxOpen(!schedBoxOpen)}>
                    Schedule
                  </button>
                  <button className="quiet danger" onClick={() => setConfirmDiscard(true)}>
                    Discard
                  </button>
                </div>
              ) : (
                <div className="confirm-row">
                  Discard this note?
                  <button
                    className="quiet danger"
                    onClick={() => {
                      setTitle('');
                      if (noteRef.current) noteRef.current.innerHTML = '';
                      setConfirmDiscard(false);
                      setIsShareSheetOpen(false);
                      onToast('Draft discarded');
                    }}
                  >
                    Yes, discard
                  </button>
                  <button className="quiet" onClick={() => setConfirmDiscard(false)}>
                    Keep writing
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
