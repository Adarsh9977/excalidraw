
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";

export function Navbar () {
  return (
    <nav className="w-full py-4 px-6 md:px-8 bg-violet-400 dark:bg-violet-900 relative z-1">
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
          
          <div>
            <ThemeToggle />
          </div>
          
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  );
}
