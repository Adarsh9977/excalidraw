'use server'
import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { getBoards } from '@/lib/api/boards';
import { getAuthToken } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function Dashboard() {
  const boards = await getBoards();
  const token = await getAuthToken();


  if(!token){
    redirect('/signin');
  }

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent min-h-screen">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 to-purple-400 dark:bg-gradient-to-r dark:from-violet-600 dark:to-purple-300 bg-clip-text text-transparent">My Whiteboards</h1>
        <p className="text-muted-foreground mt-1">Create and manage your collaborative drawing boards</p>
      </header>
      <DashboardClient initialBoards={boards.data} />
    </div>
  );
};

export default Dashboard;