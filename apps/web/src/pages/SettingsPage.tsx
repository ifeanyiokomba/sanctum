'use client';

import { usePlatformAuth } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent } from '@/core/ui';
import { Building2, Users, Zap, Globe, Shield, Palette, Settings, Save } from 'lucide-react';

export function SettingsPage() {
  const { organization } = usePlatformAuth();

  return (
    <div className="space-y-6 animate-in max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Settings</h1><p className="text-muted-foreground">Manage your organization settings and preferences</p></div>
        <Button><Save className="h-4 w-4 mr-2" />Save Changes</Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general"><Building2 className="h-4 w-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="people"><Users className="h-4 w-4 mr-2" />People</TabsTrigger>
          <TabsTrigger value="features"><Zap className="h-4 w-4 mr-2" />Features</TabsTrigger>
          <TabsTrigger value="integrations"><Globe className="h-4 w-4 mr-2" />Integrations</TabsTrigger>
          <TabsTrigger value="compliance"><Shield className="h-4 w-4 mr-2" />Compliance</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="h-4 w-4 mr-2" />Branding</TabsTrigger>
          <TabsTrigger value="advanced"><Settings className="h-4 w-4 mr-2" />Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <Card><CardHeader><CardTitle>Organization Information</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="orgName">Organization Name</Label><Input id="orgName" defaultValue={organization?.name} /></div><div className="space-y-2"><Label htmlFor="orgSlug">Slug</Label><Input id="orgSlug" defaultValue={organization?.slug} disabled /></div></div>
            <div className="space-y-2"><Label htmlFor="orgAddress">Address</Label><Input id="orgAddress" placeholder="123 Main St, City, State 12345" /></div>
            <div className="space-y-2"><Label htmlFor="orgPhone">Phone</Label><Input id="orgPhone" type="tel" placeholder="(555) 123-4567" /></div>
            <div className="space-y-2"><Label htmlFor="orgEmail">Email</Label><Input id="orgEmail" type="email" placeholder="info@organization.org" /></div>
            <div className="space-y-2"><Label htmlFor="orgWebsite">Website</Label><Input id="orgWebsite" type="url" placeholder="https://organization.org" /></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="people" className="mt-6 space-y-6"><Card><CardHeader><CardTitle>Vocabulary Customization</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-muted-foreground">Customize terminology for your organization type.</p><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label htmlFor="person">Person Label</Label><Input id="person" defaultValue="Member" /></div><div className="space-y-2"><Label htmlFor="household">Household Label</Label><Input id="household" defaultValue="Household" /></div><div className="space-y-2"><Label htmlFor="transaction">Transaction Label</Label><Input id="transaction" defaultValue="Transaction" /></div><div className="space-y-2"><Label htmlFor="group">Group Label</Label><Input id="group" defaultValue="Group" /></div><div className="space-y-2"><Label htmlFor="event">Event Label</Label><Input id="event" defaultValue="Event" /></div></div></CardContent></Card></TabsContent>

        <TabsContent value="features" className="mt-6 space-y-6"><Card><CardHeader><CardTitle>Feature Flags</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Giving & Donations</p></div><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Child Check-in</p></div><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Groups & Ministries</p></div><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Volunteer Management</p></div><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Events & Calendar</p></div><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Grades & Attendance</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Inventory</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Projects & Grants</p></div><input type="checkbox" className="h-4 w-4" /></div>
        </CardContent></Card></TabsContent>

        <TabsContent value="integrations" className="mt-6 space-y-6"><Card><CardHeader><CardTitle>Connected Integrations</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10">S</div><div><p className="font-medium">Stripe</p><p className="text-sm text-muted-foreground">Payments</p></div></div><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Connected</span></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10">T</div><div><p className="font-medium">Twilio</p><p className="text-sm text-muted-foreground">SMS</p></div></div><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Connected</span></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10">S</div><div><p className="font-medium">SendGrid</p><p className="text-sm text-muted-foreground">Email</p></div></div><span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Connected</span></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10">Q</div><div><p className="font-medium">QuickBooks</p><p className="text-sm text-muted-foreground">Accounting</p></div></div><span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Available</span></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10">P</div><div><p className="font-medium">Planning Center</p><p className="text-sm text-muted-foreground">Church Mgmt</p></div></div><span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Available</span></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/10">G</div><div><p className="font-medium">Google Workspace</p><p className="text-sm text-muted-foreground">Productivity</p></div></div><span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Available</span></div>
        </CardContent></Card></TabsContent>

        <TabsContent value="compliance" className="mt-6 space-y-6"><Card><CardHeader><CardTitle>Compliance Settings</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">Child Safety</p><p className="text-sm text-muted-foreground">Background checks, secure check-in, abuse prevention</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">PCI DSS</p><p className="text-sm text-muted-foreground">Payment card data security standards</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">FERPA</p><p className="text-sm text-muted-foreground">Student privacy and education records</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">COPPA</p><p className="text-sm text-muted-foreground">Children's online privacy protection</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">GAAP/FASB</p><p className="text-sm text-muted-foreground">Fund accounting and financial reporting</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">SOX</p><p className="text-sm text-muted-foreground">Financial controls and audit trails</p></div><input type="checkbox" className="h-4 w-4" /></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div className="flex-1"><p className="font-medium">HIPAA</p><p className="text-sm text-muted-foreground">Health information privacy</p></div><input type="checkbox" className="h-4 w-4" /></div>
        </CardContent></Card></TabsContent>

        <TabsContent value="branding" className="mt-6 space-y-6"><Card><CardHeader><CardTitle>Branding & Appearance</CardTitle></CardHeader><CardContent className="space-y-6"><div><Label>Logo</Label><div className="flex items-center gap-4 mt-2"><div className="h-20 w-20 border rounded-lg bg-muted flex items-center justify-center">Logo</div><Button variant="outline">Upload Logo</Button></div></div><div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Primary Color</Label><Input type="color" defaultValue="#2563eb" /></div><div className="space-y-2"><Label>Secondary Color</Label><Input type="color" defaultValue="#64748b" /></div></div></CardContent></Card></TabsContent>

        <TabsContent value="advanced" className="mt-6 space-y-6"><Card><CardHeader><CardTitle>Advanced Settings</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg"><div><p className="font-medium">Data Residency</p><p className="text-sm text-muted-foreground">Choose where your data is stored</p></div><select className="border rounded-lg px-3 py-2"><option>US East (Virginia)</option><option>US West (Oregon)</option><option>EU (Frankfurt)</option><option>EU (Ireland)</option></select></div>
          <div className="flex items-center justify-between p-4 border rounded-lg"><div><p className="font-medium">Session Timeout</p><p className="text-sm text-muted-foreground">Auto-logout after inactivity</p></div><select className="border rounded-lg px-3 py-2"><option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>8 hours</option><option>Never</option></select></div>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-destructive/10"><div><p className="font-medium text-destructive">Delete Organization</p><p className="text-sm text-muted-foreground">Permanently delete all data</p></div><Button variant="destructive">Delete</Button></div>
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}