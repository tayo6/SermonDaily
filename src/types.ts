export interface Contributor {
  id: string;
  name: string;
  ini: string;
  col: string;
  church: string;
  doc: string;
  loc: string;
  focus: string[];
  notes: number;
  followers: number;
  bio?: string;
  ver?: boolean;
}

export interface ChurchInfo {
  region: string;
  city: string;
  st?: string;
  co: string;
  pastor?: string;
  role?: string;
  doc: string;
  desc: string;
  home?: boolean;
}

export interface Sermon {
  id: string;
  by: string;
  church: string;
  speaker: string;
  series?: string;
  focus: string;
  kidsart?: 'ark' | 'sheep' | 'whale' | 'lion';
  memory?: string;
  title: string;
  excerpt: string;
  tags: string[];
  date: string;
  read: string;
  amen: number;
  media?: { v?: number; a?: number } | null;
  time?: string;
  cat?: string;
  chOnly?: boolean;
  body: string[];
  refl?: Array<{ by: string; txt?: string; audio?: string; dur?: number; audioUrl?: string; audioDuration?: number }>;
}

export interface Devo {
  id: string;
  by: string;
  title: string;
  scr?: string;
  text: string;
  time: string;
  amen: number;
  bg?: number | string;
}

export interface NotificationItem {
  t: 'note' | 'amen' | 'devo' | 'follow';
  by: string;
  pid?: string;
  txt: string;
  time: string;
}

export interface DraftItem {
  title: string;
  html: string;
  date: string;
}

export interface SchedItem {
  id?: string;
  when: number | string;
  title: string;
  by?: string;
  church?: string;
  html?: string;
}

export interface PrivateNote {
  id: string;
  title: string;
  html: string;
  date: string;
}
