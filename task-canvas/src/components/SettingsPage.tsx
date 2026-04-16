import { useState } from 'react';
import { Workspace } from '@/types/kanban';

interface SettingsPageProps {
  workspace: Workspace;
  onSave: (name: string, description: string) => void;
}

export default function SettingsPage({ workspace, onSave }: SettingsPageProps) {
  const [name, setName] = useState(workspace.name);
  const [description, setDescription] = useState(workspace.description);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(name, description);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-xl font-bold text-foreground mb-6">Workspace settings</h1>

        <div className="bg-card rounded-lg border p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Workspace name</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Add a description for your workspace..." />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Workspace visibility</label>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-md text-sm bg-primary text-primary-foreground font-medium">Private</button>
              <button className="px-4 py-2 rounded-md text-sm bg-accent text-accent-foreground hover:opacity-80">Public</button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Private — Only workspace members can see and edit workspace boards.</p>
          </div>

          <hr className="border-border" />

          <div className="flex items-center justify-between">
            <button onClick={handleSave} className="px-6 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
              {saved ? '✓ Saved!' : 'Save'}
            </button>
            <button className="px-4 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10">
              Delete this workspace?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
