'use client';

import { usePlatformAuth } from '@/core/hooks';
import { Bell, Search, Sun, Moon, ChevronDown, Globe, Settings, Heart, UserCheck, Calendar } from 'lucide-react';
import { cn } from '@/core/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/core/ui';
import { useState, useEffect } from 'react';
import { Toaster } from '@/core/ui';

export function Header() {
  const { user, getOrgPersona, isOrgAdmin, isSuperAdmin } = usePlatformAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => { setIsOnline(navigator.onLine); const handleOnline = () => setIsOnline(true); const handleOffline = () => setIsOnline(false); window.addEventListener('online', handleOnline); window.addEventListener('offline', handleOffline); return () => { window.removeEventListener('online', handleOnline); window.removeEventListener('offline', handleOffline); }; }, []);

  useEffect(() => { const stored = localStorage.getItem('theme') as 'light' | 'dark' | null; const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; const initial = stored || (prefersDark ? 'dark' : 'light'); setTheme(initial); document.documentElement.classList.toggle('dark', initial === 'dark'); }, []);

  const toggleTheme = () => { const newTheme = theme === 'light' ? 'dark' : 'light'; setTheme(newTheme); localStorage.setItem('theme', newTheme); document.documentElement.classList.toggle('dark', newTheme === 'dark'); };

  const persona = getOrgPersona();
  const personaLabels: Record<string, string> = { church: 'Church', school: 'School', ngo: 'Nonprofit', sme: 'Business' };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-1 lg:max-w-md">
          <div className="relative flex-1 hidden sm:block"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="search" placeholder="Search people, events, giving..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-9 rounded-lg border bg-background pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" aria-label="Global search" /></div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full text-xs" role="status"><span className={cn('h-1.5 w-1.5 rounded-full', isOnline ? 'bg-green-500' : 'bg-red-500')} />{isOnline ? 'Online' : 'Offline'}</div>
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-accent transition-colors" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}</button>

          <DropdownMenu><DropdownMenuTrigger asChild><button className="relative p-2 rounded-lg hover:bg-accent transition-colors" aria-label="Notifications"><Bell className="h-5 w-5" /><span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">3</span></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-80"><DropdownMenuLabel>Notifications</DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem className="text-sm py-2" inset><div className="flex items-start gap-3"><div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><Heart className="h-4 w-4 text-primary" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium">New donation received</p><p className="text-xs text-muted-foreground">$500 from John Smith</p><p className="text-xs text-muted-foreground">2 min ago</p></div></div></DropdownMenuItem><DropdownMenuItem className="text-sm py-2" inset><div className="flex items-start gap-3"><div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><UserCheck className="h-4 w-4 text-green-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium">Volunteer confirmed</p><p className="text-xs text-muted-foreground">Sarah Johnson for Sunday Service</p><p className="text-xs text-muted-foreground">15 min ago</p></div></div></DropdownMenuItem><DropdownMenuItem className="text-sm py-2" inset><div className="flex items-start gap-3"><div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0"><Calendar className="h-4 w-4 text-yellow-600" /></div><div className="flex-1 min-w-0"><p className="text-sm font-medium">Event reminder</p><p className="text-xs text-muted-foreground">Youth Group starts in 1 hour</p><p className="text-xs text-muted-foreground">1 hour ago</p></div></div></DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem className="text-center text-sm py-2">View all notifications</DropdownMenuItem></DropdownMenuContent></DropdownMenu>

          <DropdownMenu><DropdownMenuTrigger asChild><button className="flex items-center gap-2 p-1 rounded-lg hover:bg-accent transition-colors">{user?.imageUrl ? <img src={user.imageUrl} alt="" className="h-8 w-8 rounded-full" /> : <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-medium text-primary">{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span></div>}<span className="hidden lg:block text-sm font-medium">{user?.firstName || 'User'}</span><ChevronDown className="h-4 w-4 text-muted-foreground lg:hidden" /></button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuLabel className="font-normal"><div className="flex flex-col"><span className="font-medium">{user?.firstName} {user?.lastName}</span><span className="text-xs text-muted-foreground">{user?.email}</span></div></DropdownMenuLabel><DropdownMenuSeparator /><DropdownMenuItem><Globe className="mr-2 h-4 w-4" />Switch Organization</DropdownMenuItem>{(isOrgAdmin || isSuperAdmin) && <> <DropdownMenuSeparator /><DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Organization Settings</DropdownMenuItem></>}<DropdownMenuSeparator /><DropdownMenuItem className="text-destructive focus:text-destructive">Sign out</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
        </div>
      </div>

      {persona && <div className="border-t px-4 py-1 bg-muted/50 hidden lg:block"><span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{personaLabels[persona] || persona}</span>Mode</span></div>}

      <Toaster />
    </header>
  );
}
