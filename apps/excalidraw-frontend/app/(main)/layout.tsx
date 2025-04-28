'use client'
import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileEdit, 
  Settings, 
  Users, 
  LogOut,
  Home
} from "lucide-react";
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: ReactNode;
}

const menuItems = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    label: 'Collaborators',
    icon: Users,
    href: '/collaborators'
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings'
  }
]

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [active, setActive] = useState<typeof menuItems[number]['label']>();
  const { logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();


  useEffect(() => {
    const currentMenuItem = menuItems.find(item => pathname.startsWith(item.href));
    if (currentMenuItem) {
      setActive(currentMenuItem.label);
    }
  }, [pathname]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border/50 p-5">
            <div className="flex items-center gap-2 justify-center">
              <FileEdit className="h-6 w-6 text-purple-800 dark:text-purple-300" />
              <span className="font-extrabold tracking-wider text-lg text-purple-800 dark:text-purple-300">Whiteboard</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu className=' flex flex-col justify-start h-full w-full gap-2 py-2 px-2'>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild onClick={() => setActive(item.label)} isActive={active === item.label} tooltip={item.label} className='data-[active=true]:bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900'>
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border/50">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Home />
                    <span>Back to Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Logout" onClick={()=>{
                  logout();
                  router.push('/signin');
                }}>
                  <button>
                    <LogOut />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="overflow-auto hide-scrollbar">
          <div className="sticky top-0 bg-sidebar/30 backdrop-blur flex justify-end items-center p-4 border-b">
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <SidebarTrigger />
            </div>
          </div>
          <main>
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;