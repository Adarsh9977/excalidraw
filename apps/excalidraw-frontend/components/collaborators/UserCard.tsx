'use client'

import { motion } from 'framer-motion';
import { Mail, Link, Users, Activity, Router } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Collaborator, updateUserRole } from '@/lib/api/users';
import { useRouter } from 'next/navigation';


interface UserCardProps {
  collaborator: Collaborator;
}

export const UserCard = ({ collaborator }: UserCardProps) => {
  const isMobile = useIsMobile();
  const [selectedRole, setSelectedRole] = useState(collaborator.role.toLowerCase());
  const router = useRouter();

  const handleRoleChange = (newRole: string) => {
    setSelectedRole(newRole);
  };

  const handleUpdate = async () => {
    try {
      // This would be replaced with an actual API call
      const res = await updateUserRole(collaborator.userId, collaborator.roomId, selectedRole);
      if(res.status === 200) {
        router.refresh();
        toast.success(`Updated ${collaborator.name}'s role to ${selectedRole}`);
      } else {
        toast.error('Failed to update role');
      }
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleRemove = async () => {
    try {
      // This would be replaced with an actual API call
      console.log('Removing user', collaborator.name);
      toast.success(`Removed ${collaborator.name} from collaborators`);
    } catch (error) {
      toast.error('Failed to remove user');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden border-[#006239] hover:border-[#009758] dark:hover:border-[#009758] border-dashed py-0 bg-black">
        <CardHeader className="flex flex-row items-center gap-4 p-4 sm:p-6 border-b border-dashed border-b-[#006239]">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md flex-shrink-0">
            {collaborator.avatar ? <img
              src={collaborator.avatar}
              alt={collaborator.name}
              className="h-full w-full object-cover"
            /> : (
              <div className="h-full w-full bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center">
                {collaborator.name[0]}
              </div>
            )}
          </div>
          <div>
            <CardTitle className="text-base sm:text-lg text-[#009758] font-medium">
              {collaborator.name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{collaborator.role}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Mail size={14} className="text-[#009758] flex-shrink-0" />
            <span className="truncate">{collaborator.email}</span>
          </div>
          <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
            <Activity size={14} className="text-[#009758] flex-shrink-0" />
            <span className="text-xs sm:text-sm">{collaborator.roomName}</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 border-t border-dashed border-t-[#006239] p-4 sm:p-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                className="w-full sm:w-auto bg-[#006239] hover:bg-[#009758] text-white text-xs sm:text-sm"
              >
                <Users size={14} className="mr-1" /> {isMobile ? 'Manage' : 'Manage Access'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3 border border border-dashed">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Access Level</h4>
                <Select defaultValue={collaborator.role.toLowerCase()} onValueChange={handleRoleChange}>
                  <SelectTrigger className='w-full focus-visible:ring-[#006239] border border-dashed'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  className="w-full bg-[#006239] hover:bg-[#009758] text-white mt-3"
                  onClick={handleUpdate}
                >
                  Update Role
                </Button>
                <div>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={handleRemove}
                  >
                    Remove User
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    </motion.div>
  );
};