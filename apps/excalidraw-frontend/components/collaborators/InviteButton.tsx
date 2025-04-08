'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InviteModal } from '@/components/collaborators/InviteModal';
import { toast } from 'sonner';

interface InviteButtonProps {
  rooms: Array<{ id: string; name: string; collaboratorsCount: number }>;
  users: Array<{ id: string; name: string; email: string }>;
}

export function InviteButton({ rooms, users }: InviteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInvite = async (roomId: string, userId: string) => {
    // This would be replaced with an actual API call
    const user = users.find(u => u.id === userId);
    console.log('Inviting user', userId, 'to room', roomId);
    toast.success(`Invitation sent to ${user?.name}`);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="whitespace-nowrap gap-2 bg-violet-600 hover:bg-violet-700 text-white"
      >
        <UserPlus size={16} />
        <span className="hidden sm:inline">Invite User</span>
        <span className="sm:hidden">Invite</span>
      </Button>

      <InviteModal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        rooms={rooms}
        users={users}
        onInvite={handleInvite}
      />
    </>
  );
}