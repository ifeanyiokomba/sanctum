'use client';

import { useState } from 'react';
import { useTransactionPermissions, useFundPermissions } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/ui';
import { cn, formatCurrency, formatDate } from '@/core/utils';
import { DollarSign, Heart, TrendingUp, Download, Plus, Filter, Search, CreditCard, Banknote, Recycle } from 'lucide-react';

const mockTransactions = [
  { id: '1', date: '2024-01-10', type: 'income', amount: 50000, fund: 'General Fund', donor: 'John Smith', method: 'Online', status: 'completed' },
  { id: '2', date: '2024-01-10', type: 'income', amount: 25000, fund: 'Missions Fund', donor: 'Jane Doe', method: 'Check', status: 'completed' },
  { id: '3', date: '2024-01-09', type: 'income', amount: 10000, fund: 'Building Fund', donor: 'Anonymous', method: 'Cash', status: 'completed' },
  { id: '4', date: '2024-01-09', type: 'income', amount: 75000, fund: 'General Fund', donor: 'Mike Johnson', method: 'Online', status: 'completed' },
  { id: '5', date: '2024-01-08', type: 'income', amount: 15000, fund: 'Benevolence', donor: 'Sarah Williams', method: 'Online', status: 'pending' },
];

const mockFunds = [
  { name: 'General Fund', balance: 125000, budget: 200000, color: 'bg-blue-500' },
  { name: 'Missions Fund', balance: 45000, budget: 100000, color: 'bg-green-500' },
  { name: 'Building Fund', balance: 78000, budget: 150000, color: 'bg-orange-500' },
  { name: 'Benevolence', balance: 12000, budget: 50000, color: 'bg-red-500' },
];

export function GivingPage() {
  const { canCreate: canCreateTrans } = useTransactionPermissions();
  const { canCreate: canCreateFund } = useFundPermissions();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const totalGiving = mockTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const thisMonth = mockTransactions.filter(t => t.type === 'income' && t.date.startsWith('2024-01')).reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = mockTransactions.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-3xl font-bold tracking-tight">Giving</h1><p className="text-muted-foreground">Track donations, manage funds, and reconcile transactions</p></div>
        <div className="flex items-center gap-2"><Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>{canCreateTrans && <Button><Plus className="h-4 w-4 mr-2" />Record Giving</Button>}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Giving (YTD)</p><p className="text-3xl font-bold mt-1">{formatCurrency(totalGiving)}</p></div><div className="p-3 rounded-xl bg-green-100"><DollarSign className="h-6 w-6 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">This Month</p><p className="text-3xl font-bold mt-1">{formatCurrency(thisMonth)}</p></div><div className="p-3 rounded-xl bg-blue-100"><TrendingUp className="h-6 w-6 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Pending</p><p className="text-3xl font-bold mt-1">{pendingCount}</p></div><div className="p-3 rounded-xl bg-yellow-100"><Heart className="h-6 w-6 text-yellow-600" /></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="transactions">Transactions</TabsTrigger><TabsTrigger value="funds">Funds</TabsTrigger><TabsTrigger value="donors">Donors</TabsTrigger></TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <Card><CardHeader><CardTitle>Fund Balances</CardTitle></CardHeader><CardContent>
            <div className="space-y-4">{mockFunds.map((fund) => (<div key={fund.name}><div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><div className={cn('h-3 w-3 rounded', fund.color)} /><span className="font-medium">{fund.name}</span></div><span className="font-medium">{formatCurrency(fund.balance)} / {formatCurrency(fund.budget)}</span></div><div className="h-2 bg-muted rounded-full overflow-hidden"><div className={cn('h-full rounded-full', fund.color)} style={{ width: `${Math.min(100, (fund.balance / fund.budget) * 100)}%` }} /></div></div>))}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Recent Transactions</CardTitle><a href="#" className="text-sm text-primary hover:underline">View all</a></CardHeader><CardContent>
            <div className="space-y-3">{mockTransactions.slice(0, 5).map((tx) => (<div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0"><div className="flex items-center gap-3"><div className={cn('p-2 rounded-lg', tx.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600')}>{tx.method === 'Online' ? <CreditCard className="h-4 w-4" /> : tx.method === 'Check' ? <Banknote className="h-4 w-4" /> : <Recycle className="h-4 w-4" />}</div><div><p className="font-medium">{tx.donor}</p><p className="text-xs text-muted-foreground">{tx.fund} • {formatDate(tx.date)}</p></div></div><div className="text-right"><p className={cn('font-medium', tx.type === 'income' ? 'text-green-600' : 'text-red-600')}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</p><Badge variant={tx.status === 'completed' ? 'success' : 'warning'} className="text-xs">{tx.status}</Badge></div></div>))}</div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <div className="mt-4"><div className="flex gap-4 mb-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" /></div><Button variant="outline"><Filter className="h-4 w-4 mr-2" />Filter</Button></div>
          <Card><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b bg-muted/50"><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Donor</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Fund</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Method</th><th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">Amount</th><th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th></tr></thead><tbody className="divide-y">{mockTransactions.map((tx) => (<tr key={tx.id} className="hover:bg-muted/50"><td className="px-4 py-3">{formatDate(tx.date)}</td><td className="px-4 py-3 font-medium">{tx.donor}</td><td className="px-4 py-3">{tx.fund}</td><td className="px-4 py-3">{tx.method}</td><td className="px-4 py-3 text-right font-medium text-green-600">+{formatCurrency(tx.amount)}</td><td className="px-4 py-3"><Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>{tx.status}</Badge></td></tr>))}</tbody></table></div></CardContent></Card></div>
        </TabsContent>

        <TabsContent value="funds">
          <div className="mt-4 flex justify-between items-center"><Card className="flex-1"><CardContent className="p-6"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{mockFunds.map((fund) => (<div key={fund.name} className="p-4 border rounded-lg"><div className="flex items-center gap-2 mb-2"><div className={cn('h-3 w-3 rounded', fund.color)} /><span className="font-medium">{fund.name}</span></div><p className="text-2xl font-bold">{formatCurrency(fund.balance)}</p><p className="text-sm text-muted-foreground">Budget: {formatCurrency(fund.budget)}</p><div className="h-2 bg-muted rounded-full overflow-hidden mt-2"><div className={cn('h-full rounded-full', fund.color)} style={{ width: `${Math.min(100, (fund.balance / fund.budget) * 100)}%` }} /></div></div>))}</div></CardContent></Card>{canCreateFund && <Button><Plus className="h-4 w-4 mr-2" />Add Fund</Button>}</div>
        </TabsContent>

        <TabsContent value="donors"><div className="mt-4"><Card><CardContent className="p-6"><p className="text-muted-foreground">Donor management coming soon...</p></CardContent></Card></div></TabsContent>
      </Tabs>
    </div>
  );
}