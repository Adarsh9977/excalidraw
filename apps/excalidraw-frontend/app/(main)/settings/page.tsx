import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { getUserProfile } from '@/lib/api/users';

export const metadata: Metadata = {
  title: 'Settings | Excalidraw',
  description: 'Manage your Excalidraw account settings and preferences',
};

export default async function SettingsPage() {
  const token = await getAuthToken();
  
  if(!token){
    redirect('/signin');
  }

  const userResponse = await getUserProfile();
  const user = userResponse.data?.user;

  if (!user) {
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
          <AccountSettings initialData={user} />
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings userId={user.id} />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationSettings userId={user.id} />
        </TabsContent>
      </Tabs>
    </main>
  );
}