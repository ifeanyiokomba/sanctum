'use client';

import { useState } from 'react';
import { usePeoplePermissions } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage } from '@/core/ui';
import { cn, formatDate } from '@/core/utils';

const mockPeople = [
  { id: '1', firstName: 'John', lastName: 'Smith', email: 'john@example.com', phone: '(555) 123-4567', status: 'active', household: 'Smith Family', tags: ['Member', 'Volunteer'], role: 'head', avatar: null },
  { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', phone: '(555) 123-4568', status: 'active', household: 'Smith Family', tags: ['Member'], role: 'spouse', avatar: null },
  { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', phone: '(555) 987-6543', status: 'active', household: 'Johnson Family', tags: ['Member', 'Staff'], role: 'head', avatar: null },
  { id: '4', firstName: 'Sarah', lastName: 'Williams', email: 'sarah@example.com', phone: '(555) 456-7890', status: 'inactive', household: 'Williams Family', tags: ['Visitor'], role: 'head', avatar: null },
  { id: '5', firstName: 'David', lastName: 'Brown', email: 'david@example.com', phone: '(555) 321-0987', status: 'active', household: 'Brown Family', tags: ['Member', 'Leader'], role: 'head', avatar: null },
];

export function PeoplePage() {
  const { canCreate, canManage } = usePeoplePermissions();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredPeople = mockPeople.filter(p => {
    const matchesSearch = p.firstName.toLowerCase().includes(search.toLowerCase()) ||
      p.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">People</h1><p className="text-muted-foreground">Manage members, visitors, and households</p></div>
        <div className="flex items-center gap-2">{canManage && <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-2" />Import</Button>}{canManage && <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export</Button>}{canCreate && <Button><Plus className="h-4 w-4 mr-2" />Add Person</Button>}</div>
      </div>

      <Card><CardContent className="p-4 pt-6"><div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search people..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
        <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-background"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="archived">Archived</option></select></div>
        <div className="flex items-center gap-1 border rounded-lg p-1"><button onClick={() => setViewMode('table')} className={cn('p-2 rounded transition-colors', viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')} aria-label="Table view"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button><button onClick={() => setViewMode('cards')} className={cn('p-2 rounded transition-colors', viewMode === 'cards' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')} aria-label="Card view"><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></button></div>
      </div></CardContent></Card>

      <Card><CardContent className="p-0">{viewMode === 'table' ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Person</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Household</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredPeople.map((person) => (
                <tr key={person.id} className="hover:bg-muted/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={person.avatar || undefined} alt={person.firstName} />
                        <AvatarFallback>{person.firstName[0]}{person.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.firstName} {person.lastName}</p>
                        <p className="text-sm text-muted-foreground">{person.role === 'head' ? 'Head of Household' : person.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {person.email && <a href={`mailto:${person.email}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Mail className="h-3.5 w-3.5" />{person.email}</a>}
                      {person.phone && <span className="flex items-center gap-1 text-sm text-muted-foreground"><Phone className="h-3.5 w-3.5" />{person.phone}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /><span className="text-sm">{person.household}</span></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">{person.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
                  </td>
                  <td className="px-4 py-4"><Badge variant={person.status === 'active' ? 'success' : 'secondary'}>{person.status}</Badge></td>
                  <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="p-1 rounded hover:bg-accent transition-colors"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Details</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Send Message</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredPeople.map((person) => (
            <div key={person.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={person.avatar || undefined} alt={person.firstName} />
                  <AvatarFallback className="text-lg">{person.firstName[0]}{person.lastName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{person.firstName} {person.lastName}</h3>
                    <Badge variant={person.status === 'active' ? 'success' : 'secondary'} className="text-xs">{person.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{person.role === 'head' ? 'Head of Household' : person.role}</p>
                  <p className="text-sm text-muted-foreground">{person.household}</p>
                  <div className="flex flex-wrap gap-1 mt-2">{person.tags.map((tag) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
                  <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                    {person.email && <a href={`mailto:${person.email}`} className="flex items-center gap-1 hover:text-foreground"><Mail className="h-3.5 w-3.5" /></a>}
                    {person.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /></span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}</CardContent></Card>

      {filteredPeople.length === 0 && <Card className="text-center py-12"><CardContent><Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-medium mb-2">No people found</h3><p className="text-muted-foreground mb-4">Get started by adding your first person</p>{canCreate && <Button><Plus className="h-4 w-4 mr-2" />Add Person</Button>}</CardContent></Card>}
    </div>
  );
}