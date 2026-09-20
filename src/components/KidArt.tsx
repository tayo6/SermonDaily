import React from 'react';

export const KidArt: React.FC<{ kind?: string }> = ({ kind }) => {
  const sun = (
    <>
      <circle cx="168" cy="22" r="14" fill="#FFD166" />
      <circle cx="168" cy="22" r="20" fill="#FFD166" opacity=".35" />
    </>
  );

  if (kind === 'ark') {
    return (
      <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <rect width="200" height="120" fill="#BFE3F2" />
        {sun}
        <path d="M0 40 A45 45 0 0 1 90 40 L90 55 L0 55 Z" fill="#F4A259" opacity=".55" />
        <path d="M0 52 A34 34 0 0 1 68 52 L68 60 L0 60Z" fill="#E76F51" opacity=".5" />
        <path d="M20 78 Q40 70 60 78 T100 78 T140 78 T180 78 T220 78 V120 H20Z" fill="#5FA8D3" />
        <path d="M55 78 L55 58 L110 58 L110 78Z" fill="#8B5E34" />
        <rect x="72" y="64" width="10" height="9" fill="#F1EDE7" />
        <rect x="88" y="64" width="10" height="9" fill="#F1EDE7" />
        <path d="M46 78 L82 46 L118 78Z" fill="#A47148" />
      </svg>
    );
  }

  if (kind === 'sheep') {
    return (
      <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <rect width="200" height="120" fill="#D8EFD3" />
        {sun}
        <path d="M0 86 Q50 78 100 86 T200 86 V120 H0Z" fill="#8FCB9B" />
        <ellipse cx="88" cy="74" rx="34" ry="24" fill="#fff" />
        <circle cx="118" cy="62" r="12" fill="#4A403A" />
        <circle cx="114" cy="59" r="1.8" fill="#fff" />
        <circle cx="122" cy="59" r="1.8" fill="#fff" />
        <rect x="72" y="92" width="6" height="14" fill="#4A403A" />
        <rect x="96" y="92" width="6" height="14" fill="#4A403A" />
        <ellipse cx="150" cy="90" rx="14" ry="9" fill="#fff" opacity=".9" />
      </svg>
    );
  }

  if (kind === 'whale') {
    return (
      <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <rect width="200" height="120" fill="#CDEBF5" />
        {sun}
        <path d="M0 84 Q50 74 100 84 T200 84 V120 H0Z" fill="#4C86A8" />
        <ellipse cx="100" cy="80" rx="58" ry="26" fill="#3D6E8F" />
        <path d="M150 70 Q166 52 178 58 Q170 66 158 74Z" fill="#3D6E8F" />
        <path d="M70 66 Q90 44 96 30 Q104 46 96 66Z" fill="#9FD3E8" opacity=".9" />
        <circle cx="70" cy="76" r="4" fill="#fff" />
        <path d="M56 88 Q66 94 78 90" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  if (kind === 'lion') {
    return (
      <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <rect width="200" height="120" fill="#FDEBD2" />
        {sun}
        <path d="M0 88 Q50 80 100 88 T200 88 V120 H0Z" fill="#E9C46A" />
        <circle cx="100" cy="58" r="30" fill="#E76F51" />
        <circle cx="100" cy="58" r="20" fill="#F4A261" />
        <circle cx="93" cy="54" r="3" fill="#4A403A" />
        <circle cx="107" cy="54" r="3" fill="#4A403A" />
        <path d="M96 63 Q100 67 104 63" stroke="#4A403A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <path d="M70 96 Q75 88 80 96M84 98 Q90 88 96 98M104 98 Q110 88 116 98" stroke="#2E5F52" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <rect width="200" height="120" fill="#FFE9B8" />
      {sun}
      <path d="M0 90 Q50 82 100 90 T200 90 V120 H0Z" fill="#F4A259" />
      <circle cx="60" cy="52" r="16" fill="#fff" />
      <circle cx="80" cy="48" r="12" fill="#fff" />
      <path d="M130 60 q10 -12 24 -6" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
};
