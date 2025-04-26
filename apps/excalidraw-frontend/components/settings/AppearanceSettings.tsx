'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export function AppearanceSettings({ userId }: { userId: string }) {
  const { theme, setTheme } = useTheme();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [gridSize, setGridSize] = useState('medium');

  const onToggleForm = () => {
    // Save the settings to the database
    toast.success('Upcoming Feature: Appearance Settings');
  }

  return (
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
          <Switch
            id="dark-mode"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reduced-motion">Reduced Motion</Label>
            <p className="text-sm text-muted-foreground">
              Minimize animations throughout the interface
            </p>
          </div>
          <Switch
            id="reduced-motion"
            checked={reducedMotion}
            onCheckedChange={setReducedMotion}
          />
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Label>Canvas Grid Size</Label>
          <div className="flex gap-2">
            <Button
              variant={gridSize === 'small' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('small')}
              className={gridSize === 'small' ? 'bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white' : ''}
            >
              Small
            </Button>
            <Button
              variant={gridSize === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('medium')}
              className={gridSize === 'medium' ? 'bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white' : ''}
            >
              Medium
            </Button>
            <Button
              variant={gridSize === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('large')}
              className={gridSize === 'large' ? 'bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white' : ''}
            >
              Large
            </Button>
            <Button
              variant={gridSize === 'none' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('none')}
              className={gridSize === 'none' ? 'bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white' : ''}
            >
              None
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onToggleForm}
          className='bg-gradient-to-r from-violet-300 to-purple-400 dark:from-violet-800 dark:to-purple-900 text-black dark:text-white'
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}