'use client';

import { usePlatformAuth } from '@/core/hooks';
import { usePeoplePermissions, useTransactionPermissions } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/ui';
import { cn, formatCurrency, formatRelativeTime } from '@/core/utils';
import { Users, DollarSign, Calendar, UserCheck, Heart, CheckSquare, Target, TrendingUp } from 'lucide-react';

const stats = [
  { name: 'Total Members', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { name: 'Monthly Giving', value: '$45,670', change: '+8.2%', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
  { name: 'This Week Attendance', value: '892', change: '-3%', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
  { name: 'Active Volunteers', value: '156', change: '+5', icon: UserCheck, color: 'text-orange-600', bg: 'bg-orange-100' }
];

const recentActivity = [
  { type: 'giving', title: 'New recurring donation', detail: '$100/month from Sarah Johnson', time: '2 min ago', icon: Heart, color: 'text-green-600' },
  { type: 'checkin', title: 'Child checked in', detail: 'Emma Wilson - Nursery', time: '5 min ago', icon: CheckSquare, color: 'text-blue-600' },
  { type: 'volunteer', title: 'Volunteer confirmed', detail: 'Mike Chen - Audio/Visual', time: '12 min ago', icon: UserCheck, color: 'text-purple-600' },
  { type: 'people', title: 'New member added', detail: 'The Anderson Family', time: '28 min ago', icon: Users, color: 'text-blue-600' },
  { type: 'event', title: 'Event registration', detail: 'Youth Retreat - 3 new registrations', time: '1 hour ago', icon: Calendar, color: 'text-orange-600' }
];

export function Dashboard() {
  const { user, organization, getOrgPersona } = usePlatformAuth();

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.firstName || 'there'}! Here's what's happening at {organization?.name}.
          </p>
        </div>
<div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                {(getOrgPersona() ?? '').charAt(0).toUpperCase() + (getOrgPersona() ?? '').slice(1)} Mode
              </span>
            </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} vs last month</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bg)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <a href="#" className="text-sm text-primary hover:underline">View all</a>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 last:pb-0 border-b last:border-0">
                  <div className={cn('p-2 rounded-lg', `${activity.color}/10`)}>
                    <activity.icon className={cn('h-5 w-5', activity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Heart className="h-5 w-5" /></div>
              <div><p className="font-medium">Record Giving</p><p className="text-xs text-muted-foreground">Log a new donation</p></div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <div className="p-2 rounded-lg bg-green-100 text-green-600"><Users className="h-5 w-5" /></div>
              <div><p className="font-medium">Add Member</p><p className="text-xs text-muted-foreground">Register new person</p></div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600"><Calendar className="h-5 w-5" /></div>
              <div><p className="font-medium">Create Event</p><p className="text-xs text-muted-foreground">Schedule new event</p></div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600"><CheckSquare className="h-5 w-5" /></div>
              <div><p className="font-medium">Start Check-in</p><p className="text-xs text-muted-foreground">Open check-in kiosk</p></div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <div className="p-2 rounded-lg bg-red-100 text-red-600"><UserCheck className="h-5 w-5" /></div>
              <div><p className="font-medium">Volunteer Schedule</p><p className="text-xs text-muted-foreground">Manage shifts</p></div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors text-left">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-600"><TrendingUp className="h-5 w-5" /></div>
              <div><p className="font-medium">View Reports</p><p className="text-xs text-muted-foreground">Giving & attendance</p></div>
            </button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <a href="/events" className="text-sm text-primary hover:underline">View all</a>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Sunday Morning Service', date: 'Tomorrow, 9:00 AM', location: 'Main Sanctuary', attendees: 450 },
              { name: 'Youth Group', date: 'Wednesday, 6:30 PM', location: 'Youth Room', attendees: 45 },
              { name: "Women's Bible Study", date: 'Thursday, 10:00 AM', location: 'Room 204', attendees: 28 },
              { name: "Men's Breakfast", date: 'Saturday, 8:00 AM', location: 'Fellowship Hall', attendees: 65 }
            ].map((event, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><Calendar className="h-5 w-5 text-primary" /></div>
                  <div>
                    <p className="font-medium">{event.name}</p>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                  </div>
                </div>
                <div className="text-right"><p className="text-sm font-medium">{event.attendees} expected</p></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}