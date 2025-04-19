import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

export const metadata: Metadata = {
  title: 'Settings | Excalidraw',
  description: 'Manage your Excalidraw account settings and preferences',
};

export default async function SettingsPage() {
  const token = await getAuthToken();
  
  if(!token){
    redirect('/signin');
  }

  return (
    <main className="p-4 sm:p-6 space-y-6 sm:space-y-8 bg-gradient-to-br from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent min-h-screen">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-500 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
      </header>

      <Tabs defaultValue="account" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 bg-violet-200/20 dark:bg-violet-800/20">
          <TabsTrigger value="account" className='data-[state=active]:bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900'>Account</TabsTrigger>
          <TabsTrigger value="appearance" className='data-[state=active]:bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900'>Appearance</TabsTrigger>
          <TabsTrigger value="notifications" className='data-[state=active]:bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900'>Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
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
                    <Input id="name" placeholder="Your name" className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0' />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" className='focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0' />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    className="w-full min-h-[100px] rounded-md border focus-visible:border-violet-800 focus-visible:ring-0 focus-visible:ring-offset-0 px-3 py-2 text-sm dark:bg-input/30"
                    placeholder="Tell us about yourself"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button className='bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'>Save Changes</Button>
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
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className='bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'>Update Password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <Card className="bg-gradient-to-r from-violet-300/20 to-purple-100/20 dark:from-violet-900/10 dark:to-purple-700/10">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how Excalidraw looks for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch id="dark-mode" className='data-[state=checked]:bg-gradient-to-r from-violet-800 to-purple-900 dark:from-violet-400 dark:to-purple-400' />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduced Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations throughout the interface
                  </p>
                </div>
                <Switch id="reduced-motion" className='data-[state=checked]:bg-gradient-to-r from-violet-800 to-purple-900 dark:from-violet-400 dark:to-purple-400' />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Canvas Grid Size</Label>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Small</Button>
                  <Button variant="outline" size="sm">Medium</Button>
                  <Button variant="outline" size="sm">Large</Button>
                  <Button variant="outline" size="sm">None</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className='bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card className="bg-gradient-to-r from-violet-300/20 to-purple-100/20 dark:from-violet-900/10 dark:to-purple-700/10">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch id="email-notifications" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="collaboration-notifications">Collaboration Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone comments or edits your drawings
                  </p>
                </div>
                <Switch id="collaboration-notifications" />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="marketing-notifications">Marketing Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news about new features and updates
                  </p>
                </div>
                <Switch id="marketing-notifications" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className='bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}