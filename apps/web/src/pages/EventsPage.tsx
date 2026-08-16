'use client';

import { useState } from 'react';
import { useEventPermissions } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from '@/core/ui';
import { cn, formatDate, formatDateTime } from '@/core/utils';
import { Plus, Search, Calendar, MapPin, Users, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Clock, Filter } from 'lucide-react';

const mockEvents = [
  { id: '1', title: 'Sunday Morning Service', startAt: '2024-01-14T09:00:00', endAt: '2024-01-14T10:30:00', location: 'Main Sanctuary', category: 'Service', capacity: 500, registrations: 420, status: 'upcoming' },
  { id: '2', title: 'Youth Group', startAt: '2024-01-17T18:30:00', endAt: '2024-01-17T20:00:00', location: 'Youth Room', category: 'Ministry', capacity: 60, registrations: 45, status: 'upcoming' },
  { id: '3', title: "Women's Bible Study", startAt: '2024-01-18T10:00:00', endAt: '2024-01-18T11:30:00', location: 'Room 204', category: 'Study', capacity: 30, registrations: 22, status: 'upcoming' },
  { id: '4', title: 'Christmas Eve Service', startAt: '2023-12-24T17:00:00', endAt: '2023-12-24T18:30:00', location: 'Main Sanctuary', category: 'Service', capacity: 600, registrations: 580, status: 'completed' },
  { id: '5', title: "Men's Breakfast", startAt: '2024-01-20T08:00:00', endAt: '2024-01-20T09:30:00', location: 'Fellowship Hall', category: 'Fellowship', capacity: 80, registrations: 55, status: 'upcoming' },
];

export function EventsPage() {
  const { canCreate } = useEventPermissions();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filteredEvents = mockEvents.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Events</h1><p className="text-muted-foreground">Manage services, classes, and gatherings</p></div>
        <div className="flex items-center gap-2">{canCreate && <Button><Plus className="h-4 w-4 mr-2" />Create Event</Button>}</div>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(d => new Date(d.setMonth(d.getMonth() - 1)))}><ChevronLeft className="h-4 w-4" /></Button>
              <span className="px-4 font-medium">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(d => new Date(d.setMonth(d.getMonth() + 1)))}><ChevronRight className="h-4 w-4" /></Button>
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <button onClick={() => setView('list')} className={cn('p-2 rounded transition-colors', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')}><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg></button>
              <button onClick={() => setView('calendar')} className={cn('p-2 rounded transition-colors', view === 'calendar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent')}><Calendar className="h-4 w-4" /></button>
            </div>
          </div>

          {view === 'list' ? (
            <div className="space-y-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10"><Calendar className="h-6 w-6 text-primary" /></div>
                    <div><h3 className="font-medium">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDateTime(event.startAt)}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{event.registrations}/{event.capacity}</span>
                    </div></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={event.status === 'upcoming' ? 'success' : 'secondary'}>{event.status}</Badge>
                    <Badge variant="secondary">{event.category}</Badge>
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="aspect-square"><div className="text-center py-12 text-muted-foreground"><Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>Calendar view coming soon</p></div></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}