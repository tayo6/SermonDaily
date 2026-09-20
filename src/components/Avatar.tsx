import React, { useState } from 'react';
import { Contributor } from '../types';

interface AvatarProps {
  contributor?: Contributor | null;
  name?: string;
  ini?: string;
  col?: string;
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  contributor,
  name,
  ini,
  col,
  avatarUrl,
  size = 'md',
  className = '',
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  const resolvedName = contributor?.name || name || 'User';
  const resolvedIni = contributor?.ini || ini || resolvedName.substring(0, 2).toUpperCase();
  const resolvedCol = contributor?.col || col || '#7D5E45';
  const resolvedUrl = contributor?.avatarUrl || avatarUrl;

  const sizeClass = size === 'xs' ? 'xs' : size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : '';

  return (
    <span
      className={`av ${sizeClass} ${className}`.trim()}
      style={{ background: resolvedCol }}
      title={resolvedName}
      onClick={onClick}
    >
      {resolvedUrl && !hasError ? (
        <img
          src={resolvedUrl}
          alt={resolvedName}
          className="av-img"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{resolvedIni}</span>
      )}
    </span>
  );
};
