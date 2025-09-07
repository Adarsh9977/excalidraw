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
    <div className="p-6 space-y-6 bg-black from-violet-50/30 to-transparent dark:from-violet-950/20 dark:to-transparent min-h-screen">
      <header className="space-y-1">
        <h1 className="text-3xl font-medium text-white">My Whiteboards</h1>
        <p className="text-neutral-400 font-light text-sm ">Create and manage your collaborative drawing boards</p>
      </header>
      <DashboardClient initialBoards={boards.data} />
    </div>
  );
};

export default Dashboard;