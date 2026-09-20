import React, { useState, useEffect, useRef } from 'react';
import { Sermon } from '../types';
import { getContributor, KGRAD } from '../data';
import {
  BkBigIcon,
  BkSmIcon,
  ShareIcon,
  HeartIcon,
  CommIcon,
  CardIcon,
  PlayIcon,
  PauseIcon,
  MicIcon,
  PinIcon,
  UserIcon,
  CalIcon,
  ClockIcon,
  VerIcon,
} from './Icons';
import { Mic, Square, Trash2, Volume2, Play as LPlay, Pause as LPause } from 'lucide-react';
import { KidArt } from './KidArt';

// Waveform audio pill for fellowship voice reflections matching v7.4
const RfAudioPill: React.FC<{
  audioUrl?: string;
  duration?: number;
}> = ({ audioUrl, duration = 4 }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bars = [10, 14, 8, 16, 12, 6, 15, 9, 13, 7];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioUrl || audioUrl === 'demo') {
      const next = !isPlaying;
      setIsPlaying(next);
      if (next) {
        setTimeout(() => setIsPlaying(false), (duration || 4) * 1000);
      }
      return;
    }
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          setIsPlaying(true);
          setTimeout(() => setIsPlaying(false), (duration || 4) * 1000);
        });
      } else {
        setIsPlaying(true);
        setTimeout(() => setIsPlaying(false), (duration || 4) * 1000);
      }
    }
  };

  return (
    <div
      className={`rf-audio ${isPlaying ? 'playing' : ''}`}
      onClick={handleToggle}
    >
      {audioUrl && audioUrl !== 'demo' && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
        />
      )}
      <button type="button" className="rfap">
        {isPlaying ? '❚❚' : '▶'}
      </button>
      <div className="rfw">
        {bars.map((h, idx) => (
          <i key={idx} style={{ height: `${h}px` }} />
        ))}
      </div>
      <em>{duration}s</em>
    </div>
  );
};

// Reusable voice note player for sermon reflection audio notes
const VoiceNotePlayer: React.FC<{
  src: string;
  duration?: number;
  label?: string;
}> = ({ src, duration: initialDuration, label }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => {
      if (!initialDuration && audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [src, initialDuration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="vn-player">
      <audio ref={audioRef} src={src} preload="metadata" />
      <button
        type="button"
        className="vn-play-btn"
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause voice note' : 'Play voice note'}
      >
        {isPlaying ? <LPause className="w-3.5 h-3.5 fill-current" /> : <LPlay className="w-3.5 h-3.5 fill-current ml-0.5" />}
      </button>
      <div className="vn-track-wrap">
        <div className="vn-header-row">
          <span className="vn-label">
            <Volume2 className="w-3 h-3 text-accent" />
            {label || 'Voice Note'}
          </span>
          <span className="vn-time">
            {format(currentTime)} / {format(duration || 0)}
          </span>
        </div>
        <div className="vn-progress-bar" onClick={handleSeek}>
          <div className="vn-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
};

interface ReaderModalProps {
  post: Sermon | null;
  onClose: () => void;
  allSermons: Sermon[];
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isFollowingAuthor: boolean;
  onToggleFollowAuthor: (authorId: string) => void;
  isAmen: boolean;
  onToggleAmen: (id: string) => void;
  onOpenCard: (post: Sermon) => void;
  onOpenVerse: (ref: string) => void;
  onOpenSeries: (seriesName: string) => void;
  onOpenAnotherPost: (id: string) => void;
  onAddReflection: (postId: string, text: string, audioUrl?: string, audioDuration?: number) => void;
  onToast: (msg: string) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  post,
  onClose,
  allSermons,
  isBookmarked,
  onToggleBookmark,
  isFollowingAuthor,
  onToggleFollowAuthor,
  isAmen,
  onToggleAmen,
  onOpenCard,
  onOpenVerse,
  onOpenSeries,
  onOpenAnotherPost,
  onAddReflection,
  onToast,
}) => {
  const [textSize, setTextSize] = useState<1 | 2 | 3>(1);
  const [reflText, setReflText] = useState('');

  // Voice note recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<{
    url: string;
    duration: number;
    blob: Blob;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingDurationRef = useRef(0);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const duration = 372; // 6:12
  const bodyRef = useRef<HTMLDivElement>(null);

  const cleanupRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setRecordingDuration(0);
    recordingDurationRef.current = 0;
  };

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setSpeed(1);
    setReflText('');
    cleanupRecording();
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
  }, [post?.id]);

  useEffect(() => {
    return () => {
      cleanupRecording();
      if (recordedAudio?.url) {
        URL.revokeObjectURL(recordedAudio.url);
      }
    };
  }, []);

  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev + 0.25 * speed >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 0.25 * speed;
        });
      }, 250);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, speed, duration]);

  if (!post) return null;

  const author = getContributor(post.by);
  const isKids = post.focus === 'Kids';
  const moreInSeries = !isKids && post.series
    ? allSermons.filter(s => s.series === post.series && s.id !== post.id && s.focus !== 'Kids')
    : [];

  const handleTextSizeCycle = () => {
    const next = textSize === 1 ? 2 : textSize === 2 ? 3 : 1;
    setTextSize(next);
    onToast(`Text size: ${next}`);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setCurrentTime(duration * ratio);
  };

  const handleSpeedCycle = () => {
    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    setSpeed(next);
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        onToast('Microphone access not supported on this browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mime = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const url = URL.createObjectURL(blob);
        const finalDuration = recordingDurationRef.current || 1;
        setRecordedAudio({
          url,
          duration: finalDuration,
          blob,
        });
        setIsRecording(false);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      setRecordingDuration(0);
      recordingDurationRef.current = 0;
      setIsRecording(true);
      mediaRecorder.start(200);

      recordTimerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          const next = prev + 1;
          recordingDurationRef.current = next;
          if (next >= 120) {
            stopRecording();
          }
          return next;
        });
      }, 1000);
      onToast('Recording voice note… Speak into your microphone');
    } catch (err: any) {
      console.error('Error starting recording:', err);
      onToast('Microphone access denied or unavailable');
      setIsRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const stopRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const cancelRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.onstop = () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
      mediaRecorderRef.current.stop();
    } else if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
    setRecordingDuration(0);
    recordingDurationRef.current = 0;
  };

  const discardRecordedAudio = () => {
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
    onToast('Voice note discarded');
  };

  const handleMicToggle = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    if (recordedAudio) {
      discardRecordedAudio();
    }
    await startRecording();
  };

  const handlePostReflection = () => {
    const v = reflText.trim();
    if (!v && !recordedAudio) {
      onToast('Write a thought or record a voice note first');
      return;
    }
    onAddReflection(post.id, v, recordedAudio?.url, recordedAudio?.duration);
    setReflText('');
    setRecordedAudio(null);
    onToast(recordedAudio ? 'Voice reflection added to sermon' : 'Reflection shared');
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  };

  // Click interceptor for scriptures in body
  const handleBodyClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const scriptureEl = target.closest('.scripture');
    if (scriptureEl) {
      const ref = scriptureEl.getAttribute('data-ref') || scriptureEl.textContent || '';
      if (ref) onOpenVerse(ref);
    }
  };

  const sizeClass = textSize === 2 ? 'sz2' : textSize === 3 ? 'sz3' : '';

  return (
    <div id="reader" className={`full open ${sizeClass}`}>
      <div className="ftop">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div className="flabel">{post.series || 'Sermon Notes'}</div>
        <button
          className="icon-btn"
          onClick={handleTextSizeCycle}
          style={{ font: '700 12.5px var(--sans)', letterSpacing: '.02em' }}
        >
          Aa
        </button>
        <button
          className={`icon-btn ${isBookmarked ? 'on' : ''}`}
          onClick={() => {
            onToggleBookmark(post.id);
            onToast(isBookmarked ? 'Removed from library' : 'Saved to your library');
          }}
        >
          <BkBigIcon />
        </button>
        <button className="icon-btn" onClick={() => onToast('Share link copied')}>
          <ShareIcon />
        </button>
      </div>

      <div className="fbody" id="rBody" ref={bodyRef} onClick={handleBodyClick}>
        {isKids ? (
          <>
            <div
              className="kart"
              style={{
                height: '160px',
                borderRadius: '18px',
                overflow: 'hidden',
                background: KGRAD[post.kidsart || 'lion'] || KGRAD.lion,
              }}
            >
              <KidArt kind={post.kidsart || 'lion'} />
            </div>
            <div className="byline" style={{ margin: '16px 0 2px' }}>
              <span className="av" style={{ background: author.col }}>{author.ini}</span>
              <div className="by-mid">
                <div className="by-name">
                  {author.name}
                  {author.ver && <VerIcon />}
                </div>
                <div className="by-meta" style={{ textTransform: 'uppercase', letterSpacing: '.05em', fontSize: '11px' }}>
                  {post.church} · {post.date}
                </div>
              </div>
              {post.by !== 'you' && (
                <button
                  className={`follow solid ${isFollowingAuthor ? 'on' : ''}`}
                  onClick={() => onToggleFollowAuthor(post.by)}
                >
                  {isFollowingAuthor ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
            <h1 className="r-title" style={{ fontFamily: 'var(--sans)', fontWeight: 800 }}>
              {post.title}
            </h1>
            <div className="rb-k">
              {post.body.map((b, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: b }} />
              ))}
            </div>
            {post.memory && (
              <div className="memcard">
                <span>MEMORY VERSE</span>
                <br />
                <span
                  className="scripture"
                  onClick={() => onOpenVerse(post.memory!)}
                  style={{ display: 'inline-block', marginTop: '8px', font: '700 21px var(--serif)', padding: '6px 12px', cursor: 'pointer' }}
                >
                  {post.memory}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="byline" style={{ marginBottom: '2px' }}>
              <span className="av" style={{ background: author.col }}>{author.ini}</span>
              <div className="by-mid">
                <div className="by-name">
                  {author.name}
                  {author.ver && <VerIcon />}
                </div>
                <div className="by-meta" style={{ textTransform: 'uppercase', letterSpacing: '.05em', fontSize: '11px' }}>
                  {post.church}
                </div>
              </div>
              {post.by !== 'you' && (
                <button
                  className={`follow solid ${isFollowingAuthor ? 'on' : ''}`}
                  onClick={() => onToggleFollowAuthor(post.by)}
                >
                  {isFollowingAuthor ? 'Following' : 'Follow Writer'}
                </button>
              )}
            </div>
            <h1 className="r-title">{post.title}</h1>
            <div className="meta-grid">
              <div className="mg">
                <span><UserIcon /> Preacher</span>
                <b>{post.speaker}</b>
              </div>
              <div className="mg">
                <span><PinIcon /> Church</span>
                <b>{post.church}</b>
              </div>
              <div className="mg">
                <span><CalIcon /> Sermon date</span>
                <b>{post.date}</b>
              </div>
              <div className="mg">
                <span><ClockIcon /> Time &amp; category</span>
                <b>{post.time || '10:00 AM'} ({post.cat || 'General'})</b>
              </div>
            </div>

            <div className="tagrow">
              {post.tags.map((t, idx) => (
                <span key={idx} className="m-tag">#{t}</span>
              ))}
              <span className="m-tag doc">{author.doc}</span>
              <span className={`fp f-${post.focus === 'Kids' ? 'k' : post.focus === 'Teens' ? 't' : 'a'}`}>
                {post.focus}
              </span>
            </div>

            <div className="rb">
              {post.body.map((b, i) => (
                <div key={i} dangerouslySetInnerHTML={{ __html: b }} />
              ))}
            </div>

            {moreInSeries.length > 0 && (
              <div className="more-ser" id="moreSer">
                <h3 onClick={() => post.series && onOpenSeries(post.series)}>
                  <BkSmIcon /> More in series: {post.series} ›
                </h3>
                {moreInSeries.map((m) => (
                  <div key={m.id} className="msr" onClick={() => onOpenAnotherPost(m.id)}>
                    <div className="m1">
                      <span>{m.date}</span>
                      <span>{m.speaker}</span>
                    </div>
                    <div className="m2">{m.title}</div>
                    <div className="m3">{m.excerpt.replace(/<[^>]*>/g, '').slice(0, 80)}…</div>
                  </div>
                ))}
              </div>
            )}

            {post.media?.a && (
              <div className={`player ${isPlaying ? 'playing' : ''}`} id="apl">
                <button className="pl-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="pl-mid">
                  <div className="pl-row">
                    <span className="pl-live"><i></i>PREACHER AUDIO</span>
                    <span className="pl-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                  <div className="pl-prog" onClick={handleSeek}>
                    <i style={{ width: `${(currentTime / duration) * 100}%` }}></i>
                  </div>
                </div>
                <button className="pl-speed" onClick={handleSpeedCycle}>{speed}x</button>
              </div>
            )}

            {post.media?.v && (
              <div className="vblock" onClick={() => onToast('Video playback opens here')}>
                <div className="vplay"><PlayIcon /></div>
                <div className="vbar">
                  <span>0:00</span>
                  <span>HD · FULLSCREEN</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Reflections */}
        <section className="refl" id="reflSec">
          <div className="rf-head">
            <h3>Reflections</h3>
            <span className="rf-count" id="rfCount">
              {(post.refl || []).length} reflection{(post.refl || []).length === 1 ? '' : 's'}
            </span>
          </div>
          <div id="rfList">
            {(post.refl && post.refl.length > 0) ? (
              post.refl.map((r, i) => {
                const rAuthor = getContributor(r.by);
                const audUrl = r.audio || r.audioUrl;
                const dur = r.dur || r.audioDuration || 4;
                return (
                  <div key={i} className="rf-item">
                    <span className="av sm" style={{ background: rAuthor.col }}>{rAuthor.ini}</span>
                    <div className="rf-body">
                      <div className="rf-n">
                        {rAuthor.name}
                        {r.by === 'you' && <span>you</span>}
                      </div>
                      {r.txt && <div className="rf-t">{r.txt}</div>}
                      {audUrl && (
                        <RfAudioPill audioUrl={audUrl} duration={dur} />
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rf-empty">Be the first to share how this word spoke to you.</p>
            )}
          </div>

          <div className="rf-input">
            <textarea
              id="rfTxt"
              rows={2}
              placeholder="Write a reflection or speak your heart…"
              value={reflText}
              onChange={(e) => setReflText(e.target.value)}
              disabled={isRecording}
            />
            <div className="rf-actions">
              <button
                type="button"
                className={`micbtn ${isRecording ? 'rec' : ''}`}
                id="rfMic"
                title="Record voice reflection"
                onClick={handleMicToggle}
              >
                {isRecording ? '⏹' : '🎤'}
              </button>
              <div className="rm-state" id="rmState">
                {isRecording
                  ? `● Recording 0:${String(recordingDuration).padStart(2, '0')} — tap ⏹ to stop`
                  : recordedAudio
                  ? `Voice ready (${recordedAudio.duration}s) — add words or share`
                  : 'Tap to record a voice note'}
              </div>
              <button
                type="button"
                className="follow solid"
                id="rfPost"
                onClick={handlePostReflection}
                disabled={isRecording}
              >
                Share
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="fbar">
        <button
          className={`act amen ${isAmen ? 'on pop' : ''}`}
          onClick={() => onToggleAmen(post.id)}
        >
          <HeartIcon filled={isAmen} />
          <b>{post.amen + (isAmen ? 1 : 0)}</b>
        </button>
        <button
          className="act"
          onClick={() => {
            const sec = document.getElementById('reflSec');
            if (sec) sec.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <CommIcon />
          <b>{(post.refl || []).length}</b>
        </button>
        <span style={{ flex: 1 }} />
        <button className="act" onClick={() => onOpenCard(post)}>
          <CardIcon /> Card
        </button>
        <button className="act" onClick={() => onToast('Share link copied')}>
          <ShareIcon />
        </button>
      </div>
    </div>
  );
};
