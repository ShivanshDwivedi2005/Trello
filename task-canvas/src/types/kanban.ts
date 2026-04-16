export interface Member {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  color: string;
  email?: string;
  role?: 'admin' | 'member';
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: Label[];
  members: Member[];
  dueDate: string | null;
  checklists: Checklist[];
  coverColor: string | null;
  archived: boolean;
  createdAt: string;
}

export interface List {
  id: string;
  title: string;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  background: string;
  lists: List[];
  starred: boolean;
  recentlyViewed?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  boards: Board[];
  members: Member[];
  labels: Label[];
}

export const LABEL_COLORS: Label[] = [
  { id: 'l1', name: 'Bug', color: 'var(--label-red)' },
  { id: 'l2', name: 'Feature', color: 'var(--label-green)' },
  { id: 'l3', name: 'Urgent', color: 'var(--label-orange)' },
  { id: 'l4', name: 'Design', color: 'var(--label-purple)' },
  { id: 'l5', name: 'Backend', color: 'var(--label-blue)' },
  { id: 'l6', name: 'Review', color: 'var(--label-yellow)' },
];

export const SAMPLE_MEMBERS: Member[] = [
  { id: 'm1', name: 'Shiva B', avatar: '', initials: 'SB', color: '#44546f', email: 'shiva@example.com', role: 'admin' },
  { id: 'm2', name: 'Sarah Chen', avatar: '', initials: 'SC', color: '#579dff', email: 'sarah@example.com', role: 'member' },
  { id: 'm3', name: 'Mike Davis', avatar: '', initials: 'MD', color: '#4bce97', email: 'mike@example.com', role: 'member' },
  { id: 'm4', name: 'Emma Wilson', avatar: '', initials: 'EW', color: '#9f8fef', email: 'emma@example.com', role: 'member' },
];

export const BOARD_BACKGROUNDS = [
  'linear-gradient(135deg, #8b6adf 0%, #d56cb8 100%)',
  'linear-gradient(135deg, #3f2ac4 0%, #cc3fa2 100%)',
  'linear-gradient(135deg, #246a00 0%, #4bce97 100%)',
  'linear-gradient(135deg, #0055cc 0%, #579dff 100%)',
  'linear-gradient(135deg, #c25100 0%, #f5cd47 100%)',
  'linear-gradient(135deg, #ae2e24 0%, #f87462 100%)',
  'linear-gradient(135deg, #5e4db2 0%, #9f8fef 100%)',
  'linear-gradient(135deg, #164b35 0%, #4bce97 100%)',
];
