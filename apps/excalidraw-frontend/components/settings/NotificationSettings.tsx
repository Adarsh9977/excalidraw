'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function NotificationSettings({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    collaboratorUpdates: true,
    securityAlerts: true,
    productUpdates: false,
    desktopNotifications: true,
    soundAlerts: false
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    toast.success('Upcoming Feature: Notification Settings');
  };

  return (
    <Card className="bg-black border border-dashed border-[#006239]">
      <CardHeader>
        <CardTitle className='text-[#009758] text-xl capitalize'>Notifications</CardTitle>
        <CardDescription className='text-neutral-400 text-sm font-light'>
          Control how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive important updates via email
            </p>
          </div>
          <Switch
            id="email-notifications"
            checked={notifications.emailNotifications}
            onCheckedChange={() => handleToggle('emailNotifications')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="collaborator-updates">Collaborator Updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when collaborators make changes
            </p>
          </div>
          <Switch
            id="collaborator-updates"
            checked={notifications.collaboratorUpdates}
            onCheckedChange={() => handleToggle('collaboratorUpdates')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="security-alerts">Security Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications about security events
            </p>
          </div>
          <Switch
            id="security-alerts"
            checked={notifications.securityAlerts}
            onCheckedChange={() => handleToggle('securityAlerts')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="product-updates">Product Updates</Label>
            <p className="text-sm text-muted-foreground">
              Stay informed about new features and updates
            </p>
          </div>
          <Switch
            id="product-updates"
            checked={notifications.productUpdates}
            onCheckedChange={() => handleToggle('productUpdates')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Show notifications on your desktop
            </p>
          </div>
          <Switch
            id="desktop-notifications"
            checked={notifications.desktopNotifications}
            onCheckedChange={() => handleToggle('desktopNotifications')}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sound-alerts">Sound Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Play sound when receiving notifications
            </p>
          </div>
          <Switch
            id="sound-alerts"
            checked={notifications.soundAlerts}
            onCheckedChange={() => handleToggle('soundAlerts')}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave}
          className='bg-[#006239] hover:bg-[#009758] text-white'
        >
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}