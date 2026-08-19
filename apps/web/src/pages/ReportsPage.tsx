
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Input } from '@/core/ui';
import { cn, formatCurrency, formatDate } from '@/core/utils';
import { Download, Plus, Filter, Users, DollarSign, FileText, UserPlus, UserCheck, BarChart3, Search, Calendar, TrendingUp, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const mockReports = [
  { id: '1', name: 'Weekly Attendance', type: 'Attendance', lastRun: '2024-01-12', schedule: 'Weekly', format: 'PDF' },
  { id: '2', name: 'Monthly Giving Summary', type: 'Giving', lastRun: '2024-01-01', schedule: 'Monthly', format: 'PDF' },
  { id: '3', name: 'Volunteer Hours Report', type: 'Volunteers', lastRun: '2024-01-10', schedule: 'Monthly', format: 'CSV' },
  { id: '4', name: 'New Members This Month', type: 'People', lastRun: '2024-01-11', schedule: 'Monthly', format: 'PDF' },
  { id: '5', name: 'Fund Balances', type: 'Finance', lastRun: '2024-01-12', schedule: 'Weekly', format: 'XLSX' },
];

const mockKPIs = [
  { label: 'Avg Weekly Attendance', value: '892', trend: '+2.1%', icon: Users, color: 'text-blue-600' },
  { label: 'Monthly Giving', value: '$45,670', trend: '+8.2%', icon: DollarSign, color: 'text-green-600' },
  { label: 'New Members (30d)', value: '23', trend: '+15%', icon: UserPlus, color: 'text-purple-600' },
  { label: 'Volunteer Rate', value: '42%', trend: '+3%', icon: UserCheck, color: 'text-orange-600' },
];

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [search, setSearch] = useState('');

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"><div><h1 className="text-3xl font-bold tracking-tight">Reports</h1><p className="text-muted-foreground">View and manage reports, dashboards, and analytics</p></div><div className="flex items-center gap-2"><Button><Plus className="h-4 w-4 mr-2" />Create Report</Button></div></div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="dashboard">Dashboard</TabsTrigger><TabsTrigger value="reports">Reports</TabsTrigger><TabsTrigger value="builder">Builder</TabsTrigger><TabsTrigger value="scheduled">Scheduled</TabsTrigger></TabsList>

        <TabsContent value="dashboard" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{mockKPIs.map((kpi) => (<Card key={kpi.label}><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">{kpi.label}</p><p className="text-3xl font-bold mt-1">{kpi.value}</p><p className="text-xs text-green-600 mt-1">{kpi.trend} vs last period</p></div><div className="p-3 rounded-xl bg-primary/10"><kpi.icon className={cn('h-6 w-6', kpi.color)} /></div></div></CardContent></Card>))}</div>
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card><CardHeader><CardTitle>Attendance Trend (12 Weeks)</CardTitle></CardHeader><CardContent><div className="h-64 flex items-end justify-around p-4">{[450, 520, 480, 610, 580, 720, 690, 810, 780, 890, 870, 892].map((val, i) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-primary rounded-t transition-all hover:bg-primary/80" style={{ height: `${(val / 900) * 100}%` }} /><span className="text-xs text-muted-foreground mt-2">W{i + 1}</span></div>))}</div></CardContent></Card>
            <Card><CardHeader><CardTitle>Giving Trend (12 Months)</CardTitle></CardHeader><CardContent><div className="h-64 flex items-end justify-around p-4">{[32, 35, 38, 42, 39, 45, 48, 44, 47, 50, 46, 45].map((val, i) => (<div key={i} className="flex-1 flex flex-col items-center"><div className="w-full bg-green-600 rounded-t transition-all hover:bg-green-500" style={{ height: `${(val / 55) * 100}%` }} /><span className="text-xs text-muted-foreground mt-2">{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span></div>))}</div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <div className="flex items-center gap-2 mb-4"><Input placeholder="Search reports..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} /><Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button></div>
          <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-muted/50"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Report</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Type</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Last Run</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Schedule</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Format</th><th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Actions</th></tr></thead><tbody className="divide-y">{mockReports.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map((report) => (<tr key={report.id} className="hover:bg-muted/50"><td className="px-4 py-3 font-medium">{report.name}</td><td className="px-4 py-3"><Badge variant="secondary">{report.type}</Badge></td><td className="px-4 py-3">{formatDate(report.lastRun)}</td><td className="px-4 py-3">{report.schedule}</td><td className="px-4 py-3">{report.format}</td><td className="px-4 py-3 text-right"><Button variant="ghost" size="sm"><FileText className="h-4 w-4" /></Button><Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button></td></tr>))}</tbody></table></div></CardContent></Card>
        </TabsContent>

        <TabsContent value="builder" className="mt-4"><Card><CardContent className="p-6"><p className="text-muted-foreground">Drag-and-drop report builder coming soon...</p></CardContent></Card></TabsContent>
        <TabsContent value="scheduled" className="mt-4"><Card><CardContent className="p-6"><p className="text-muted-foreground">Scheduled report management coming soon...</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}