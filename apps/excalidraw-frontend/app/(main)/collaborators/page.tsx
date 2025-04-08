
import { Suspense } from 'react';
import { UserCard } from '@/components/collaborators/UserCard';

// This would be replaced with actual data fetching
async function getCollaborators() {
  // Simulate API call
  return [
    {
      id: '1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      role: 'Editor',
      avatarUrl: 'https://i.pravatar.cc/150?u=alex'
    },
    {
      id: '2',
      name: 'Sam Smith',
      email: 'sam@example.com',
      role: 'Viewer',
      avatarUrl: 'https://i.pravatar.cc/150?u=sam'
    },
    {
      id: '3',
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      role: 'Editor',
      avatarUrl: 'https://i.pravatar.cc/150?u=jordan'
    },
    {
      id: '4',
      name: 'Taylor Morgan',
      email: 'taylor@example.com',
      role: 'Admin',
      avatarUrl: 'https://i.pravatar.cc/150?u=taylor'
    }
  ];
}

async function getRooms() {
  // Simulate API call
  return [
    { id: '1', name: 'User Flow Diagram', collaboratorsCount: 3 },
    { id: '2', name: 'Product Roadmap', collaboratorsCount: 5 },
    { id: '3', name: 'Website Wireframe', collaboratorsCount: 2 }
  ];
}


import { InviteButton } from '@/components/collaborators/InviteButton';

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
  const rooms = await getRooms();

  return (
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-gradient-to-br from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">
              Collaborators
            </h1>
            <p className="text-muted-foreground mt-1">Manage your team and invite new members</p>
          </div>

          <InviteButton rooms={rooms} />
        </header>

        <Suspense fallback={<CollaboratorsLoading />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {collaborators.map((collaborator) => (
              <UserCard
                key={collaborator.id}
                collaborator={collaborator}
              />
            ))}
          </div>
        </Suspense>
      </div>
  );
}