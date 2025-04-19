
import { Suspense } from 'react';
import { UserCard } from '@/components/collaborators/UserCard';
import { InviteButton } from '@/components/collaborators/InviteButton';
import { getMyBoards } from '@/lib/api/boards';
import { getCollaborators, getUsers } from '@/lib/api/users';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

// Add metadata for SEO
export const metadata: Metadata = {
  title: 'Manage Collaborators',
  description: 'Manage your team members and invite new collaborators to your Excalidraw projects',
  keywords: 'excalidraw, collaborators, team management, drawing collaboration',
  openGraph: {
    title: 'Manage Your Excalidraw Collaborators',
    description: 'Invite and manage team members for real-time collaboration on your Excalidraw projects',
    type: 'website',
  }
};

function CollaboratorsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-[200px] rounded-lg bg-gradient-to-r from-violet-100/20 to-purple-100/20 animate-pulse"
        />
      ))}
    </div>
  );
}

export default async function CollaboratorsPage() {
  const collaborators = await getCollaborators();
  const rooms = await getMyBoards();
  const users = await getUsers();
  const token = await getAuthToken();

  console.log('collaborators', collaborators);
  
  if(!token){
    redirect('/signin');
  }

  return (
      <main className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-gradient-to-br from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">
              Collaborators
            </h1>
            <p className="text-muted-foreground mt-1">Manage your team and invite new members</p>
          </div>

          <InviteButton rooms={rooms.data} users={users.data} />
        </header>

        <section aria-label="Collaborator list">
          <Suspense fallback={<CollaboratorsLoading />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {collaborators.data.length>0 && collaborators.data.map((collaborator, index) => (
                <UserCard
                  key={index}
                  collaborator={collaborator}
                />
              ))}
            </div>
            {collaborators.data.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-2 w-full py-24">
                  <h2 className="text-violet-800 font-bold text-2xl">No collaborators yet</h2>
                  <p className="text-muted-foreground text-xl">Invite your teammates to join</p>
                </div>
              )}
          </Suspense>
        </section>
      </main>
  );
}