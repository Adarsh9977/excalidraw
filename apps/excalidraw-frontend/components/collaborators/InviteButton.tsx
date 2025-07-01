'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InviteModal } from '@/components/collaborators/InviteModal';
import { toast } from 'sonner';
import { Board } from '@/lib/api/boards';
import { InviteUserToRoom, User } from '@/lib/api/users';

interface InviteButtonProps {
  rooms: Board[];
  users: User[];
}

export function InviteButton({ rooms, users }: InviteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleInvite = async (roomId: string, userId: string, role:string) => {
    const user = users.find(u => u.id === userId);
    if (!user) {
      toast.error('User not found');
      return;
    }

    const res = await InviteUserToRoom(userId, roomId, role);
    if (res?.status === 200) {
      toast.success(`Invitation sent to ${user?.name}`);
    } else {
      toast.error('Failed to send invitation');
    }
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
