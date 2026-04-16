import { Member, Workspace } from '@/types/kanban';
import { Shield, User } from 'lucide-react';

interface MembersPageProps {
  workspace: Workspace;
}

export default function MembersPage({ workspace }: MembersPageProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-8 py-8">
        <h1 className="text-xl font-bold text-foreground mb-1">Members</h1>
        <p className="text-sm text-muted-foreground mb-6">Members of <span className="font-medium">{workspace.name}</span></p>

        <div className="bg-card rounded-lg border divide-y divide-border">
          <div className="px-4 py-3 flex items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="flex-1">Member</span>
            <span className="w-24 text-center">Role</span>
          </div>
          {workspace.members.map(member => (
            <div key={member.id} className="px-4 py-3 flex items-center gap-4 hover:bg-accent/30 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ backgroundColor: member.color }}>
                  {member.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                </div>
              </div>
              <div className="w-24 flex justify-center">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${member.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {member.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {member.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:opacity-90">
          Invite workspace members
        </button>
      </div>
    </div>
  );
}
