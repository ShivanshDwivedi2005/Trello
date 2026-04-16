import { Board, LABEL_COLORS, SAMPLE_MEMBERS, Workspace } from '@/types/kanban';

const sampleBoardsList: Board[] = [
  {
    id: 'board-1',
    title: 'My Trello board',
    background: 'linear-gradient(135deg, #8b6adf 0%, #d56cb8 100%)',
    starred: true,
    recentlyViewed: '2026-04-15T10:00:00Z',
    lists: [
      {
        id: 'list-1', title: 'To Do',
        cards: [
          { id: 'card-1', title: 'Research competitor analysis', description: 'Analyze top 5 competitors and create a comparison matrix.', labels: [LABEL_COLORS[1], LABEL_COLORS[5]], members: [SAMPLE_MEMBERS[0], SAMPLE_MEMBERS[1]], dueDate: '2026-04-20', checklists: [{ id: 'cl-1', title: 'Research Steps', items: [{ id: 'cli-1', text: 'Identify competitors', completed: true }, { id: 'cli-2', text: 'Gather pricing data', completed: false }, { id: 'cli-3', text: 'Compare features', completed: false }] }], coverColor: null, archived: false, createdAt: '2026-04-10' },
          { id: 'card-2', title: 'Design landing page mockup', description: '', labels: [LABEL_COLORS[3]], members: [SAMPLE_MEMBERS[3]], dueDate: null, checklists: [], coverColor: 'hsl(270 50% 55%)', archived: false, createdAt: '2026-04-11' },
          { id: 'card-3', title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment.', labels: [LABEL_COLORS[4]], members: [SAMPLE_MEMBERS[2]], dueDate: '2026-04-25', checklists: [], coverColor: null, archived: false, createdAt: '2026-04-12' },
        ],
      },
      {
        id: 'list-2', title: 'In Progress',
        cards: [
          { id: 'card-4', title: 'Implement user authentication', description: 'Add JWT-based auth with login, register, and password reset.', labels: [LABEL_COLORS[4], LABEL_COLORS[1]], members: [SAMPLE_MEMBERS[2], SAMPLE_MEMBERS[0]], dueDate: '2026-04-18', checklists: [{ id: 'cl-2', title: 'Auth Tasks', items: [{ id: 'cli-4', text: 'Create login form', completed: true }, { id: 'cli-5', text: 'Implement JWT middleware', completed: true }, { id: 'cli-6', text: 'Add password reset flow', completed: false }] }], coverColor: 'hsl(214 80% 52%)', archived: false, createdAt: '2026-04-08' },
          { id: 'card-5', title: 'Fix navigation responsive issues', description: '', labels: [LABEL_COLORS[0]], members: [SAMPLE_MEMBERS[1]], dueDate: '2026-04-16', checklists: [], coverColor: null, archived: false, createdAt: '2026-04-13' },
        ],
      },
      {
        id: 'list-3', title: 'Review',
        cards: [
          { id: 'card-6', title: 'API documentation update', description: 'Update Swagger docs for new endpoints.', labels: [LABEL_COLORS[5]], members: [SAMPLE_MEMBERS[0]], dueDate: null, checklists: [], coverColor: null, archived: false, createdAt: '2026-04-09' },
        ],
      },
      {
        id: 'list-4', title: 'Done',
        cards: [
          { id: 'card-7', title: 'Project setup and boilerplate', description: 'Initial project scaffolding with React, TypeScript, and Tailwind.', labels: [LABEL_COLORS[1]], members: [SAMPLE_MEMBERS[2]], dueDate: '2026-04-05', checklists: [{ id: 'cl-3', title: 'Setup', items: [{ id: 'cli-7', text: 'Init repository', completed: true }, { id: 'cli-8', text: 'Configure ESLint & Prettier', completed: true }, { id: 'cli-9', text: 'Set up Tailwind', completed: true }] }], coverColor: 'hsl(145 63% 42%)', archived: false, createdAt: '2026-04-01' },
          { id: 'card-8', title: 'Database schema design', description: '', labels: [LABEL_COLORS[4]], members: [SAMPLE_MEMBERS[0], SAMPLE_MEMBERS[2]], dueDate: '2026-04-07', checklists: [], coverColor: null, archived: false, createdAt: '2026-04-02' },
        ],
      },
    ],
  },
  {
    id: 'board-2', title: 'project scalar', background: 'linear-gradient(135deg, #3f2ac4 0%, #cc3fa2 100%)', starred: false,
    recentlyViewed: '2026-04-14T15:00:00Z',
    lists: [
      { id: 'list-5', title: 'Ideas', cards: [{ id: 'card-9', title: 'Social media content calendar', description: '', labels: [LABEL_COLORS[1]], members: [SAMPLE_MEMBERS[1]], dueDate: null, checklists: [], coverColor: null, archived: false, createdAt: '2026-04-10' }] },
      { id: 'list-6', title: 'In Progress', cards: [] },
      { id: 'list-7', title: 'Published', cards: [] },
    ],
  },
  {
    id: 'board-3', title: 'Design sprint', background: 'linear-gradient(135deg, #3f2ac4 0%, #cc3fa2 100%)', starred: false,
    recentlyViewed: '2026-04-13T09:00:00Z',
    lists: [
      { id: 'list-8', title: 'Reported', cards: [{ id: 'card-10', title: 'Login page crashes on Safari', description: 'Users report white screen on Safari 17.', labels: [LABEL_COLORS[0]], members: [SAMPLE_MEMBERS[1]], dueDate: '2026-04-17', checklists: [], coverColor: null, archived: false, createdAt: '2026-04-12' }] },
      { id: 'list-9', title: 'Investigating', cards: [] },
      { id: 'list-10', title: 'Fixed', cards: [] },
    ],
  },
  {
    id: 'board-4', title: 'Customer success', background: 'linear-gradient(135deg, #8b6adf 0%, #d56cb8 100%)', starred: false,
    recentlyViewed: '2026-04-12T14:00:00Z',
    lists: [
      { id: 'list-11', title: 'Q2 Goals', cards: [] },
      { id: 'list-12', title: 'Q3 Goals', cards: [] },
    ],
  },
  {
    id: 'board-5', title: 'Launch plan', background: 'linear-gradient(135deg, #0055cc 0%, #579dff 100%)', starred: false,
    lists: [
      { id: 'list-13', title: 'Components', cards: [] },
      { id: 'list-14', title: 'Tokens', cards: [] },
    ],
  },
];

export const sampleWorkspace: Workspace = {
  id: 'ws-1',
  name: 'Trello Workspace',
  description: 'Trello-style workspace dashboard.',
  boards: sampleBoardsList,
  members: [...SAMPLE_MEMBERS],
  labels: [...LABEL_COLORS],
};

export const sampleBoards = sampleBoardsList;
