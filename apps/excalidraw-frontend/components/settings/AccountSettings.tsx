'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { updateUserProfile } from '@/lib/api/users';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

interface AccountSettingsProps {
  initialData: {
    id: string;
    name: string;
    email: string;
    bio?: string;
  }
}

const UpdatedDataSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  bio: z.string({ message: 'Bio is too long' }).max(200)
});

export function AccountSettings({ initialData }: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    bio: initialData.bio || ''
  });
  const router = useRouter();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = UpdatedDataSchema.safeParse(formData);
    console.log(data);
    
    if (!data.success) {
      toast.error('Invalid data');
      return;
    }
    const res = await updateUserProfile(data.data);
    if(res.status === 200) {
        router.refresh();
        toast.success('Profile updated successfully');
    } else {
        toast.error(res.data);
    }
    // Add your profile update logic here
  };

  const handlePasswordSubmit = async (e: any) => {
    e.preventDefault();
    // Add your password update logic here
    toast.success('Upcoming Feature: Password Update');
  };

  return (
    <>
      <Card className='bg-gradient-to-r from-violet-300/20 to-purple-100/20 dark:from-violet-900/10 dark:to-purple-700/10'>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your account details and personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your name"
                    className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Your email"
                    className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0'
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full min-h-[100px] rounded-md border focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-sm dark:bg-input/30"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline">Cancel</Button>
            <Button
              className='cursor-pointer bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'
              onClick={handleProfileSubmit}
            >
              Save Changes
            </Button>
          </CardFooter>
      </Card>

      <Card className="mt-6 bg-gradient-to-r from-violet-300/20 to-purple-100/20 dark:from-violet-900/10 dark:to-purple-700/10">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input 
                id="current-password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input 
                id="new-password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input 
                id="confirm-password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0'
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit"
              className='bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'
            >
              Update Password
            </Button>
          </CardFooter>
      </Card>
    </>
  );
}