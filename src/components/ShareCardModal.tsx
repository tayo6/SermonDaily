import React, { useEffect, useState } from 'react';
import { Sermon } from '../types';
import { seriesPair } from '../data';

interface ShareCardModalProps {
  post: Sermon | null;
  onClose: () => void;
  onToast: (msg: string) => void;
}

function wrapTxt(ctx: CanvasRenderingContext2D, text: string, maxW: number, maxLines: number): string[] {
  const words = String(text).split(' ');
  const lines: string[] = [];
  let cur = '';
  words.forEach(w => {
    const t = cur ? cur + ' ' + w : w;
    if (ctx.measureText(t).width > maxW && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = t;
    }
  });
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const sliced = lines.slice(0, maxLines);
    sliced[maxLines - 1] = sliced[maxLines - 1].replace(/\s?\S*$/, '…');
    return sliced;
  }
  return lines;
}

function drawCard(p: Sermon): string {
  const pair = seriesPair(p.series);
  const cv = document.createElement('canvas');
  cv.width = 1080;
  cv.height = 1350;
  const x = cv.getContext('2d');
  if (!x) return '';

  const g = x.createLinearGradient(0, 0, 1080, 1350);
  g.addColorStop(0, pair[0]);
  g.addColorStop(1, pair[1]);
  x.fillStyle = g;
  x.fillRect(0, 0, 1080, 1350);

  x.fillStyle = 'rgba(0,0,0,.16)';
  x.fillRect(0, 0, 1080, 1350);

  x.strokeStyle = '#fff';
  x.lineWidth = 12;
  x.lineJoin = 'round';
  x.beginPath();
  x.moveTo(540, 340);
  x.bezierCurveTo(498, 286, 420, 270, 358, 292);
  x.lineTo(358, 208);
  x.bezierCurveTo(420, 186, 498, 202, 540, 252);
  x.bezierCurveTo(582, 202, 660, 186, 722, 208);
  x.lineTo(722, 292);
  x.bezierCurveTo(660, 270, 582, 286, 540, 340);
  x.closePath();
  x.stroke();

  x.beginPath();
  x.moveTo(540, 252);
  x.lineTo(540, 340);
  x.stroke();

  x.fillStyle = '#fff';
  x.textAlign = 'center';
  x.font = '700 40px Inter, Arial, sans-serif';
  x.fillText('S E R M O N S T A C K', 540, 412);

  x.font = '700 32px Inter, Arial';
  x.globalAlpha = 0.85;
  x.fillText(p.church.toUpperCase(), 540, 530);
  x.globalAlpha = 1;

  x.font = '700 92px Georgia, serif';
  const tl = wrapTxt(x, p.title, 880, 3);
  tl.forEach((l, i) => {
    x.fillText(l, 540, 690 + i * 108);
  });

  x.font = '500 40px Inter, Arial';
  x.globalAlpha = 0.9;
  x.fillText(p.speaker + '  ·  ' + p.date, 540, 760 + (tl.length - 1) * 108);
  x.globalAlpha = 1;

  x.strokeStyle = 'rgba(255,255,255,.5)';
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(440, 880);
  x.lineTo(640, 880);
  x.stroke();

  x.font = 'italic 42px Georgia, serif';
  const cleanExcerpt = p.excerpt.replace(/<[^>]*>/g, '').replace(/…$/, '');
  wrapTxt(x, '“' + cleanExcerpt + '”', 860, 3).forEach((l, i) => {
    x.fillText(l, 540, 960 + i * 58);
  });

  x.fillStyle = '#241E18';
  x.fillRect(0, 1210, 1080, 140);

  x.fillStyle = '#fff';
  x.font = '700 34px Inter, Arial';
  x.fillText('Read the full note on Sermon Daily', 540, 1290);

  return cv.toDataURL('image/png');
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  post,
  onClose,
  onToast,
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    if (post) {
      setDataUrl(drawCard(post));
    }
  }, [post]);

  if (!post) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'sermondaily-card.png';
    a.click();
    onToast('Card downloaded');
  };

  const handleCopy = () => {
    const txt = `${post.title} — ${post.speaker} at ${post.church}\nVia Sermon Daily`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(() => {
        onToast('Caption copied');
      });
    }
  };

  return (
    <div className="full open" style={{ zIndex: 64 }}>
      <div className="ftop">
        <button className="icon-btn" onClick={onClose}>←</button>
        <div className="flabel">WhatsApp share card</div>
        <span style={{ width: '38px' }} />
      </div>
      <div className="fbody">
        <p className="cs-bio">
          Sized 4:5 for WhatsApp status &amp; forwarding. Rendered on-device — nothing leaves your phone.
        </p>
        <div className="cardwrap">
          {dataUrl && <img src={dataUrl} alt="Share card" />}
        </div>
        <button className="btn-primary" onClick={handleDownload} style={{ marginTop: '14px' }}>
          ⬇ Download PNG
        </button>
        <button className="ghost" onClick={handleCopy} style={{ width: '100%', marginTop: '10px' }}>
          Copy caption text
        </button>
      </div>
    </div>
  );
};
