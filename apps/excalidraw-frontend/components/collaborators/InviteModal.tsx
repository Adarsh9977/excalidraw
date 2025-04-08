'use client'

import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Room {
  id: string;
  name: string;
  collaboratorsCount: number;
}

interface InviteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rooms: Room[];
  onInvite: (roomId: string, email: string) => void;
}

export const InviteModal = ({ isOpen, onOpenChange, rooms, onInvite }: InviteModalProps) => {
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [inviteEmail, setInviteEmail] = useState<string>('');

  const handleInvite = () => {
    if (!selectedRoom) {
      toast.error('Please select a room');
      return;
    }

    if (!inviteEmail || !inviteEmail.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    onInvite(selectedRoom, inviteEmail);
    setInviteEmail('');
    setSelectedRoom('');
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
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="collaborator@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="focus-visible:ring-violet-500"
            />
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