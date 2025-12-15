'use client';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";import { useRouter } from "next/navigation";
;

export function Navbar ({ token }: { token: string | null }) {
  const router = useRouter();

  return (
    <nav className="w-full py-4 px-6 md:px-8 bg-neutral-800/20 border-b fixed top-0 z-50 backdrop-blur-2xl ">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary dark:text-primary">Whiteboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex space-x-6">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Contact</Button>
          </div>
          
          <Button onClick={()=>{
            if(token){
              router.push('/dashboard');
            }else{
              router.push('/signin');
            }
          }}>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
