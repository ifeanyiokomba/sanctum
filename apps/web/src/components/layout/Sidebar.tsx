
import { NavLink, useLocation } from 'react-router-dom';
import { usePlatformAuth } from '@/core/hooks';
import { LayoutDashboard, Users, Calendar, Heart, CheckSquare, UserCheck, BarChart3, Settings, Menu, X, Building2, Home } from 'lucide-react';
import { cn } from '@/core/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Giving', href: '/giving', icon: Heart },
  { name: 'Check-in', href: '/checkin', icon: CheckSquare },
  { name: 'Volunteers', href: '/volunteers', icon: UserCheck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings }
];

export function Sidebar() {
  const { user, organization, getOrgPersona, signOut } = usePlatformAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const persona = getOrgPersona();
  const orgName = organization?.name || 'Organization';

  return (
    <>
      <button className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border shadow" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu"><Menu className="h-6 w-6" /></button>

      <aside className={cn('fixed lg:static inset-y-0 left-0 z-40 bg-card border-r transition-all duration-300', collapsed ? 'w-16' : 'w-64', mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')} aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold text-lg"><Building2 className="h-6 w-6 text-primary" /><span>Sanctum</span></NavLink>}
          <button className={cn('p-1.5 rounded-lg hover:bg-accent transition-colors', collapsed && 'mx-auto')} onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>{collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}</button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {!collapsed && <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">MAIN NAVIGATION</div>}
          <nav aria-label="Main"><ul className="space-y-0.5" role="list">{navigation.map((item) => { const isActive = location.pathname === item.href; return <li key={item.name}><NavLink to={item.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', isActive ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground', collapsed && 'justify-center')} aria-current={isActive ? 'page' : undefined} title={collapsed ? item.name : undefined} onClick={() => setMobileOpen(false)}><item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />{!collapsed && <span>{item.name}</span>}</NavLink></li>; })}</ul></nav>

          {!collapsed && persona && <div className="mt-6 pt-4 border-t"><div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">MODE</div><div className="px-3 py-1"><span className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"><Home className="h-3 w-3" />{persona.charAt(0).toUpperCase() + persona.slice(1)}</span></div></div> }
        </div>

        <div className="p-3 border-t">{!collapsed ? (<div className="space-y-2"><div className="px-3 py-2"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ACCOUNT</p></div><div className="flex items-center gap-3 px-3 py-2"><div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">{user?.imageUrl ? <img src={user.imageUrl} alt="" className="h-8 w-8 rounded-full" /> : <span className="text-sm font-medium text-primary">{user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>}</div><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{user?.firstName || user?.email}</p><p className="text-xs text-muted-foreground truncate">{orgName}</p></div></div><button onClick={() => { signOut(); window.location.href = '/'; }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-accent rounded-lg transition-colors"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg><span>Sign out</span></button></div>) : (<button onClick={() => { signOut(); window.location.href = '/'; }} className="mx-auto p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-accent transition-colors" title="Sign out"><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg></button>)}</div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
    </>
  );
}
