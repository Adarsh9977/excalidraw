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
      <div className="flex h-screen w-full rounded-lg overflow-hidden">
        <Sidebar variant='floating' className='bg-black overflow-hidden'>
          <SidebarHeader className=" p-5 bg-black rounded-lg">
            <div className="flex items-center gap-2 justify-center border-b border-dashed border-[#006239] pb-1">
              
              <span className="font-semibold  text-lg text-[#009758]">Whiteboard</span>
            </div>
          </SidebarHeader>

          <SidebarContent className='bg-black rounded-lg'>
            <SidebarMenu className=' flex flex-col justify-start h-full w-full gap-1 py-2 px-2'>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label} className=''>
                    <SidebarMenuButton asChild onClick={() => setActive(item.label)} isActive={active === item.label} tooltip={item.label} className='data-[active=true]:bg-[#006239] data-[active=true]:text-black data-[active=true]:[box-shadow:0_-3px_8px_0_#ffffff60_inset] data-[active=true]:text-white '>
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className=" bg-black rounded-lg overflow-hidden">
            <div className=" border border-[#006239] border-dashed rounded-md p-2 ">
              <SidebarMenu className='gap-0'>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Home">
                  <Link href="/">
                    <Home />
                    <span className=' text-xs'>Back to Home</span>
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
                    <span className=' text-xs'>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="overflow-auto hide-scrollbar">
          <div className="sticky top-0 bg-black backdrop-blur flex justify-end items-center p-4 border-b border-[#006239] border-dashed mr-2">
            <div className="flex items-center gap-4">
              {/* <ThemeToggle /> */}
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
