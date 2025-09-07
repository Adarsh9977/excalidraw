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
    <Card className="bg-black border border-dashed border-[#006239]">
      <CardHeader>
        <CardTitle className='text-[#009758] text-xl capitalize'>Appearance</CardTitle>
        <CardDescription className='text-neutral-400 text-sm font-light'> 
          Customize how Excalidraw looks for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              className={gridSize === 'small' ? 'bg-[#006239] hover:bg-[#009758] text-white' : ''}
            >
              Small
            </Button>
            <Button
              variant={gridSize === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('medium')}
              className={gridSize === 'medium' ? 'bg-[#006239] hover:bg-[#009758] text-white' : ''}
            >
              Medium
            </Button>
            <Button
              variant={gridSize === 'large' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('large')}
              className={gridSize === 'large' ? 'bg-[#006239] hover:bg-[#009758] text-white' : ''}
            >
              Large
            </Button>
            <Button
              variant={gridSize === 'none' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setGridSize('none')}
              className={gridSize === 'none' ? 'bg-[#006239] hover:bg-[#009758] text-white' : ''}
            >
              None
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onToggleForm}
          className='bg-[#006239] hover:bg-[#009758] text-white'
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}