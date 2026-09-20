import React, { useState, useRef } from 'react';

interface LiveCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (html: string) => void;
  onToast: (msg: string) => void;
}

export const LiveCapture: React.FC<LiveCaptureProps> = ({
  isOpen,
  onClose,
  onTransfer,
  onToast,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showPop, setShowPop] = useState(false);
  const [scrInput, setScrInput] = useState('');
  const noteRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleMicClick = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
        recognitionRef.current = null;
      }
      setIsRecording(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      onToast('Voice input not supported in this browser');
      return;
    }

    const rec = new SR();
    rec.lang = navigator.language || 'en-US';
    rec.continuous = true;
    rec.interimResults = false;

    rec.onresult = (ev: any) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        if (ev.results[i].isFinal) {
          if (noteRef.current) {
            noteRef.current.focus();
            document.execCommand('insertText', false, ev.results[i][0].transcript + ' ');
          }
        }
      }
    };

    rec.onend = () => setIsRecording(false);
    rec.onerror = () => setIsRecording(false);

    try {
      rec.start();
      recognitionRef.current = rec;
      setIsRecording(true);
    } catch (e) {
      setIsRecording(false);
    }
  };

  const handleAddScripture = () => {
    const ref = scrInput.trim();
    if (!ref) {
      onToast('Type a reference');
      return;
    }
    if (noteRef.current) {
      noteRef.current.focus();
      document.execCommand(
        'insertHTML',
        false,
        `<span class="scripture">${ref}</span>&nbsp;`
      );
    }
    setScrInput('');
    setShowPop(false);
  };

  const handleDone = () => {
    const html = noteRef.current ? noteRef.current.innerHTML.trim() : '';
    if (html) {
      onTransfer(html);
      if (noteRef.current) noteRef.current.innerHTML = '';
      onToast('Added to your note');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="livecap open">
      <div className="ftop">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div className="flabel">Live capture · big type, zero friction</div>
      </div>
      <div
        ref={noteRef}
        className="lcnote"
        contentEditable
        suppressContentEditableWarning
      />
      {showPop && (
        <div className="pop show" style={{ bottom: '110px', zIndex: 20 }}>
          <input
            value={scrInput}
            onChange={(e) => setScrInput(e.target.value)}
            placeholder="e.g. John 3:16"
            onKeyDown={(e) => e.key === 'Enter' && handleAddScripture()}
            autoFocus
          />
          <button onClick={handleAddScripture}>Add</button>
        </div>
      )}
      <div className="lcbar">
        <button className="lcbtn" onClick={() => setShowPop(!showPop)}>
          <span className="cir">📖</span>Scripture
        </button>
        <button className={`lcbtn ${isRecording ? 'rec' : ''}`} onClick={handleMicClick}>
          <span className="cir">🎤</span>
          <span>{isRecording ? 'Listening…' : 'Voice'}</span>
        </button>
        <button className="lcbtn" onClick={handleDone}>
          <span className="cir" style={{ background: 'var(--accent)', color: '#fff', border: 'none' }}>✓</span>
          To note
        </button>
      </div>
    </div>
  );
};
