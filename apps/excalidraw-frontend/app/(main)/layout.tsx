'use client'
import { ReactNode, useState } from 'react';
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
    const [active, setActive] = useState<typeof menuItems[number]['label']>('Dashboard');

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border/50 p-4">
            <div className="flex items-center gap-2">
              <FileEdit className="h-6 w-6 text-purple-800 dark:text-purple-300" />
              <span className="font-bold text-lg text-purple-800 dark:text-purple-300">Whiteboard</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild onClick={() => setActive(item.label)} isActive={active === item.label} tooltip={item.label}>
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
                <SidebarMenuButton asChild tooltip="Logout">
                  <button>
                    <LogOut />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="overflow-auto">
          <div className="flex justify-end items-center p-4 border-b">
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