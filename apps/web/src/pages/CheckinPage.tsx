
import { useState, useEffect } from 'react';
import { useEventPermissions } from '@/core/hooks';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsTrigger, TabsContent, Avatar, AvatarFallback } from '@/core/ui';
import { cn, formatDateTime } from '@/core/utils';
import { Search, CheckCircle, XCircle, Plus, Printer, Settings, UserPlus, AlertTriangle, Bell, Camera, QrCode, Calendar } from 'lucide-react';

const mockCheckins = [
  { id: '1', name: 'Emma Wilson', event: 'Sunday Service - Nursery', time: '08:55 AM', status: 'checked_in', allergies: 'Peanuts', parentPhone: '(555) 123-4567', labelPrinted: true },
  { id: '2', name: 'Liam Johnson', event: 'Sunday Service - Pre-K', time: '08:58 AM', status: 'checked_in', allergies: 'None', parentPhone: '(555) 987-6543', labelPrinted: true },
  { id: '3', name: 'Olivia Brown', event: 'Sunday Service - Nursery', time: '09:02 AM', status: 'checked_in', allergies: 'Dairy', parentPhone: '(555) 456-7890', labelPrinted: false },
  { id: '4', name: 'Noah Davis', event: 'Sunday Service - Elementary', time: '09:05 AM', status: 'waiting', allergies: 'None', parentPhone: '(555) 321-0987', labelPrinted: false },
];

const mockEvents = [
  { id: '1', title: 'Sunday Morning Service', startAt: '2024-01-14T09:00:00', location: 'Main Building', rooms: ['Nursery', 'Pre-K', 'Elementary', 'Youth'] },
  { id: '2', title: 'Wednesday Night Program', startAt: '2024-01-17T18:30:00', location: 'Family Center', rooms: ['Nursery', 'Pre-K', 'Elementary'] },
];

export function CheckinPage() {
  const { } = useEventPermissions();
  const [activeTab, setActiveTab] = useState('kiosk');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(mockEvents[0]);
  const [scanning, setScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState<{ name: string; status: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (lastScanned) {
      const timer = setTimeout(() => setLastScanned(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [lastScanned]);

  const handleScan = (code: string) => {
    setScanning(true);
    setTimeout(() => {
      const child = mockCheckins.find(c => c.id === code);
      if (child) {
        setLastScanned({ name: child.name, status: 'success' });
      } else {
        setLastScanned({ name: 'Unknown', status: 'error' });
      }
      setScanning(false);
    }, 500);
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Check-in</h1>
          <p className="text-muted-foreground">Secure child check-in and attendance tracking</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden sm:flex">
            <TabsTrigger value="kiosk">Kiosk Mode</TabsTrigger>
            <TabsTrigger value="manager">Manager</TabsTrigger>
            <TabsTrigger value="labels">Print Labels</TabsTrigger>
          </Tabs>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-3 rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground">Active Event</label>
                <select
                  value={selectedEvent.id}
                  onChange={(e) => setSelectedEvent(mockEvents.find(ev => ev.id === e.target.value)!)}
                  className="mt-1 w-full sm:w-64 border rounded-lg px-3 py-2 bg-background"
                >
                  {mockEvents.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} - {formatDateTime(ev.startAt)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={selectedEvent.rooms.length > 0 ? 'success' : 'secondary'}>
                {selectedEvent.rooms.length} Rooms Open
              </Badge>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print Roster
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="kiosk" className="mt-4">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>QR/Barcode Scanner</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px]">
                {scanning ? (
                  <div className="text-center">
                    <div className="w-32 h-32 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-lg font-medium">Scanning...</p>
                  </div>
                ) : lastScanned ? (
                  <div className="text-center">
                    <div className={cn('w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4', lastScanned.status === 'success' ? 'bg-green-100' : 'bg-red-100')}>
                      {lastScanned.status === 'success' ? (
                        <CheckCircle className="h-12 w-12 text-green-600" />
                      ) : (
                        <XCircle className="h-12 w-12 text-red-600" />
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{lastScanned.name}</h3>
                    <p className={cn(lastScanned.status === 'success' ? 'text-green-600' : 'text-red-600')}>
                      {lastScanned.status === 'success' ? 'Checked in successfully!' : 'Not found - please verify'}
                    </p>
                    <Button className="mt-4" onClick={() => setLastScanned(null)}>
                      Scan Next
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-48 h-48 border-2 border-dashed border-muted rounded-xl flex items-center justify-center mb-4 relative">
                      <Camera className="h-12 w-12 text-muted-foreground" />
                      <QrCode className="absolute bottom-4 right-4 h-8 w-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-lg font-medium mb-2">Scan QR Code or Barcode</p>
                    <p className="text-muted-foreground mb-6">Or search by name/phone below</p>
                    <div className="w-full max-w-md">
                      <Input
                        placeholder="Type name, phone, or scan code..."
                        onKeyDown={(e) => e.key === 'Enter' && handleScan(e.currentTarget.value)}
                        className="text-center text-lg"
                      />
                    </div>
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <kbd className="px-2 py-1 bg-muted rounded border">Enter</kbd>
                      <span>to scan</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Today's Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-green-100">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Checked In</p>
                        <p className="text-sm text-muted-foreground">247</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-green-600">247</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-yellow-100">
                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">Waiting</p>
                        <p className="text-sm text-muted-foreground">12</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-yellow-600">12</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-100">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Alerts</p>
                        <p className="text-sm text-muted-foreground">3</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Check-ins</CardTitle>
              <div className="flex items-center gap-2">
                <Input placeholder="Search..." className="w-64" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Child</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Room</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Allergies</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Parent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Label</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockCheckins.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((checkin) => (
                      <tr key={checkin.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{checkin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{checkin.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{checkin.event.split(' - ')[1]}</td>
                        <td className="px-4 py-3">{checkin.time}</td>
                        <td className="px-4 py-3">
                          <Badge variant={checkin.allergies !== 'None' ? 'warning' : 'secondary'} className="text-xs">
                            {checkin.allergies}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{checkin.parentPhone}</td>
                        <td className="px-4 py-3">
                          {checkin.labelPrinted ? (
                            <Badge variant="success">Printed</Badge>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Printer className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={checkin.status === 'checked_in' ? 'success' : 'warning'}>
                            {checkin.status.replace('_', ' ')}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manager" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Check-in Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Room management, volunteer assignments, and real-time monitoring coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labels" className="mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Print Labels</CardTitle>
              <Button>
                <Printer className="h-4 w-4 mr-2" />
                Print All
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Label printing interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}