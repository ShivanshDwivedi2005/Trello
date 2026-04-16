import { useState } from 'react';
import { Search, Briefcase, Palette, GraduationCap, Code, Megaphone, Building, User, Zap, Package, FolderKanban, Laptop, ShoppingCart, HeadphonesIcon, UsersRound, Globe, Copy, Eye } from 'lucide-react';

const CATEGORIES = [
  { id: 'business', name: 'Business', icon: Briefcase },
  { id: 'design', name: 'Design', icon: Palette },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'engineering', name: 'Engineering', icon: Code },
  { id: 'marketing', name: 'Marketing', icon: Megaphone },
  { id: 'hr', name: 'HR & Operations', icon: Building },
  { id: 'personal', name: 'Personal', icon: User },
  { id: 'productivity', name: 'Productivity', icon: Zap },
  { id: 'product', name: 'Product management', icon: Package },
  { id: 'project', name: 'Project management', icon: FolderKanban },
  { id: 'remote', name: 'Remote work', icon: Laptop },
  { id: 'sales', name: 'Sales', icon: ShoppingCart },
  { id: 'support', name: 'Support', icon: HeadphonesIcon },
  { id: 'team', name: 'Team management', icon: UsersRound },
];

const FEATURED = [
  { id: 'business', name: 'Business', color: 'hsl(40 90% 65%)', icon: Briefcase },
  { id: 'design', name: 'Design', color: 'hsl(0 70% 60%)', icon: Palette },
  { id: 'education', name: 'Education', color: 'hsl(145 50% 55%)', icon: GraduationCap },
  { id: 'engineering', name: 'Engineering', color: 'hsl(200 70% 50%)', icon: Code },
  { id: 'marketing', name: 'Marketing', color: 'hsl(280 50% 55%)', icon: Megaphone },
  { id: 'project', name: 'Project Management', color: 'hsl(200 60% 45%)', icon: FolderKanban },
  { id: 'remote', name: 'Remote Work', color: 'hsl(210 70% 55%)', icon: Globe },
];

const TEMPLATES = [
  { id: 't1', name: 'My Tasks | Trello', author: 'Trello Team', desc: 'Track all your to-dos in your own, private Trello board.', copies: 0, views: 4, bg: 'linear-gradient(135deg, hsl(25 90% 55%), hsl(40 90% 60%))' },
  { id: 't2', name: 'New Hire Onboarding', author: 'Trello Team', desc: 'Help new employees start strong with this onboarding template.', copies: 18300, views: 131500, bg: 'linear-gradient(135deg, hsl(145 50% 40%), hsl(170 60% 45%))' },
  { id: 't3', name: 'Tier List', author: 'Trello Engineering Team', desc: 'Use this template to create a tier list for anything you want.', copies: 2900, views: 23300, bg: 'linear-gradient(135deg, hsl(200 60% 50%), hsl(220 70% 55%))' },
];

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Category sidebar */}
      <div className="w-48 shrink-0 border-r border-sidebar-border overflow-y-auto py-4 px-2 hidden lg:block">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
              activeCategory === cat.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          {/* Featured categories */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Featured categories</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find template"
                className="pl-8 pr-3 py-1.5 w-48 rounded border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
            {FEATURED.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className="flex flex-col items-center gap-2 group">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105" style={{ background: cat.color }}>
                  <cat.icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs text-center text-muted-foreground">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* New and notable templates */}
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">New and notable templates</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {TEMPLATES.map(t => (
              <div key={t.id} className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-shadow cursor-pointer group">
                <div className="h-28 relative" style={{ background: t.bg }}>
                  <div className="absolute bottom-3 left-3 w-10 h-10 rounded bg-primary flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-foreground mb-0.5">{t.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">by {t.author}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{t.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Copy className="w-3 h-3" />{formatCount(t.copies)}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatCount(t.views)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
