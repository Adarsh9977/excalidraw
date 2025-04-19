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
      <Card className="h-full overflow-hidden border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all py-0">
        <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30 flex flex-row items-center gap-4 p-4 sm:p-6">
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
            <CardTitle className="text-base sm:text-lg text-violet-800 dark:text-violet-300">
              {collaborator.name}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{collaborator.role}</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Mail size={14} className="text-violet-500 flex-shrink-0" />
            <span className="truncate">{collaborator.email}</span>
          </div>
          <div className='flex items-center gap-2 text-xs sm:text-sm text-muted-foreground'>
            <Activity size={14} className="text-violet-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{collaborator.roomName}</span>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 p-4 sm:p-6">

          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white text-xs sm:text-sm"
              >
                <Users size={14} className="mr-1" /> {isMobile ? 'Manage' : 'Manage Access'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Access Level</h4>
                <Select defaultValue={collaborator.role.toLowerCase()} onValueChange={handleRoleChange}>
                  <SelectTrigger>
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
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                  onClick={handleUpdate}
                >
                  Update Role
                </Button>
                <div className="pt-2">
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