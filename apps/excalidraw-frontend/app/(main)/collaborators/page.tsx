
import { Suspense } from 'react';
import { UserCard } from '@/components/collaborators/UserCard';

// This would be replaced with actual data fetching


import { InviteButton } from '@/components/collaborators/InviteButton';
import { getMyBoards } from '@/lib/api/boards';
import { getCollaborators, getUsers } from '@/lib/api/users';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

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

  console.log(collaborators);
  if(!token){
    redirect('/signin');
  }


  return (
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-gradient-to-br from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent min-h-screen">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">
              Collaborators
            </h1>
            <p className="text-muted-foreground mt-1">Manage your team and invite new members</p>
          </div>

          <InviteButton rooms={rooms} users={users} />
        </header>

        <Suspense fallback={<CollaboratorsLoading />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {collaborators.length>0 && collaborators.map((collaborator, index) => (
              <UserCard
                key={index}
                collaborator={collaborator}
              />
            ))}
          </div>
          {collaborators.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 w-full py-24">
                <p className="text-violet-800 font-bold text-2xl">No collaborators yet</p>
                <p className="text-muted-foreground text-xl">Invite your teammates to join</p>
              </div>
            )}
        </Suspense>
      </div>
  );
}