'use client'

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Board } from '@/lib/api/boards';

interface Room {
  id: string;
  name: string;
  collaboratorsCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface InviteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Board[];
  users: User[];
  onInvite: (roomId: string, userId: string, role: string) => void;
}

export const InviteModal = ({ isOpen, onOpenChange, rooms, users, onInvite }: InviteModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('viewer');

  const handleInvite = () => {
    if (!selectedRoom) {
      toast.error('Please select a room');
      return;
    }

    if (!selectedUser) {
      toast.error('Please select a user');
      return;
    }

    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    onInvite(selectedRoom, selectedUser, selectedRole);
    setSelectedUser('');
    setSelectedRoom('');
    setSelectedRole('viewer');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-md border-violet-200 dark:border-violet-800">
        <DialogHeader>
          <DialogTitle>Invite a Collaborator</DialogTitle>
          <DialogDescription>
            Select a room and enter an email to invite a new collaborator.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="room">Select Room</Label>
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger id="room" className="w-full focus-visible:ring-violet-500">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room, index) => (
                  <SelectItem key={index} value={room.id}>
                    {room.slug}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user">Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user" className="w-full focus-visible:ring-violet-500">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger id="role" className="w-full focus-visible:ring-violet-500">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} className="bg-violet-600 hover:bg-violet-700 text-white">
            <Send size={16} className="mr-2" />
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};