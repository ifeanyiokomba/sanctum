
import { useState } from 'react';
import { useEventPermissions } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/ui';
import { cn, formatDate, formatDateTime } from '@/core/utils';
import { UserCheck, Calendar, Plus, Search, Filter, Clock, UserPlus, Mail, Phone, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const mockShifts = [
  { id: '1', role: 'Audio/Visual', event: 'Sunday Service', date: '2024-01-14', time: '8:00 AM - 11:00 AM', volunteers: ['Mike Chen', 'Sarah Kim'], needed: 3, status: 'open' },
  { id: '2', role: 'Greeters', event: 'Sunday Service', date: '2024-01-14', time: '8:30 AM - 9:15 AM', volunteers: ['John Davis'], needed: 4, status: 'open' },
  { id: '3', role: 'Nursery', event: 'Sunday Service', date: '2024-01-14', time: '8:45 AM - 10:30 AM', volunteers: ['Emily Wilson', 'Lisa Brown', 'Amy Taylor'], needed: 3, status: 'filled' },
  { id: '4', role: 'Coffee Team', event: 'Sunday Service', date: '2024-01-14', time: '9:30 AM - 11:00 AM', volunteers: [], needed: 2, status: 'open' },
  { id: '5', role: 'Setup Crew', event: 'Wednesday Night', date: '2024-01-17', time: '5:30 PM - 6:30 PM', volunteers: ['Mark Johnson'], needed: 2, status: 'open' },
];

const mockVolunteers = [
  { id: '1', name: 'Mike Chen', email: 'mike@example.com', phone: '(555) 111-2222', roles: ['Audio/Visual', 'Setup'], status: 'active', lastServed: '2024-01-07' },
  { id: '2', name: 'Sarah Kim', email: 'sarah@example.com', phone: '(555) 222-3333', roles: ['Audio/Visual', 'Greeter'], status: 'active', lastServed: '2024-01-07' },
  { id: '3', name: 'John Davis', email: 'john@example.com', phone: '(555) 333-4444', roles: ['Greeter'], status: 'active', lastServed: '2024-01-07' },
  { id: '4', name: 'Emily Wilson', email: 'emily@example.com', phone: '(555) 444-5555', roles: ['Nursery'], status: 'active', lastServed: '2024-01-07' },
];

export function VolunteersPage() {
  const { canCreate } = useEventPermissions();
  const [activeTab, setActiveTab] = useState('schedule');
  const [search, setSearch] = useState('');
  const [currentWeek, setCurrentWeek] = useState(new Date());

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">Volunteers</h1><p className="text-muted-foreground">Manage schedules, roles, and volunteer coordination</p></div><div className="flex items-center gap-2">{canCreate && <Button><Plus className="h-4 w-4 mr-2" />Add Volunteer</Button>}</div></div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="schedule">Schedule</TabsTrigger><TabsTrigger value="volunteers">Volunteers</TabsTrigger><TabsTrigger value="roles">Roles</TabsTrigger><TabsTrigger value="communication">Communication</TabsTrigger></TabsList>

        <TabsContent value="schedule" className="mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"><div className="flex items-center gap-2"><Button variant="outline" size="sm" onClick={() => setCurrentWeek(d => new Date(d.setDate(d.getDate() - 7)))}><ChevronLeft className="h-4 w-4" /></Button><span className="font-medium px-4">{currentWeek.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(currentWeek.getTime() + 6 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span><Button variant="outline" size="sm" onClick={() => setCurrentWeek(d => new Date(d.setDate(d.getDate() + 7)))}><ChevronRight className="h-4 w-4" /></Button></div><div className="flex items-center gap-2"><Input placeholder="Search shifts..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} /><Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button></div></div>
          <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-muted/50"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Role</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Event</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date & Time</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Volunteers</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th><th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th></tr></thead><tbody className="divide-y">{mockShifts.filter(s => s.role.toLowerCase().includes(search.toLowerCase()) || s.event.toLowerCase().includes(search.toLowerCase())).map((shift) => (<tr key={shift.id} className="hover:bg-muted/50"><td className="px-4 py-3 font-medium">{shift.role}</td><td className="px-4 py-3">{shift.event}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{formatDate(shift.date)} • {shift.time}</span></div></td><td className="px-4 py-3"><div className="flex items-center gap-2">{shift.volunteers.map((v, i) => (<Badge key={i} variant="secondary" className="text-xs">{v}</Badge>))}{shift.volunteers.length < shift.needed && <Badge variant="outline" className="text-xs">{shift.needed - shift.volunteers.length} needed</Badge>}</div></td><td className="px-4 py-3"><Badge variant={shift.status === 'filled' ? 'success' : 'warning'}>{shift.status}</Badge></td><td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">Manage</Button></td></tr>))}</tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="volunteers" className="mt-4">
          <div className="flex items-center gap-2 mb-4"><Input placeholder="Search volunteers..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} />{canCreate && <Button><UserPlus className="h-4 w-4 mr-2" />Add Volunteer</Button>}</div>
          <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-muted/50"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Volunteer</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Contact</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Roles</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Served</th><th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th></tr></thead><tbody className="divide-y">{mockVolunteers.filter(v => v.name.toLowerCase().includes(search.toLowerCase())).map((vol) => (<tr key={vol.id} className="hover:bg-muted/50"><td className="px-4 py-3 font-medium">{vol.name}</td><td className="px-4 py-3"><div className="space-y-1 text-sm text-muted-foreground"><a href={`mailto:${vol.email}`}>{vol.email}</a><span>{vol.phone}</span></div></td><td className="px-4 py-3"><div className="flex flex-wrap gap-1">{vol.roles.map((r) => <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>)}</div></td><td className="px-4 py-3"><Badge variant={vol.status === 'active' ? 'success' : 'secondary'}>{vol.status}</Badge></td><td className="px-4 py-3">{formatDate(vol.lastServed)}</td><td className="px-4 py-3 text-right"><Button variant="ghost" size="sm">View</Button></td></tr>))}</tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="roles" className="mt-4"><Card><CardContent className="p-6"><p className="text-muted-foreground">Role definitions, requirements, and training tracking coming soon...</p></CardContent></Card></TabsContent>
        <TabsContent value="communication" className="mt-4"><Card><CardContent className="p-6"><p className="text-muted-foreground">Volunteer messaging, reminders, and announcements coming soon...</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}