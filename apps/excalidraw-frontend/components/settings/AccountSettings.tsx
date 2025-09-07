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
      <Card className='border-dashed border-[#006239] bg-black'>
          <CardHeader>
            <CardTitle className='text-[#009758] text-xl capitalize'>Account Information</CardTitle>
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
                    className='border-dashed focus-visible:ring-[#006239] focus-visible:ring-1'
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
                    className='border-dashed focus-visible:ring-[#006239] focus-visible:ring-1'
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
                  className="w-full min-h-[100px] border-dashed focus-visible:ring-[#006239] focus-visible:ring-1"
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline">Cancel</Button>
            <Button
              className='cursor-pointer bg-[#006239] hover:bg-[#009758] text-white'
              onClick={handleProfileSubmit}
            >
              Save Changes
            </Button>
          </CardFooter>
      </Card>

      <Card className="mt-6 border-dashed border-[#006239] bg-black">
          <CardHeader>
            <CardTitle className='text-[#009758] text-xl capitalize'>Password</CardTitle>
            <CardDescription className='text-neutral-400 text-sm font-light'>
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
                className=''
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
              />
            </div>
          </CardContent>
          <CardFooter className='flex justify-end'>
            <Button 
              type="submit"
              className='bg-[#006239] hover:bg-[#009758] text-white'
            >
              Update Password
            </Button>
          </CardFooter>
      </Card>
    </>
  );
}