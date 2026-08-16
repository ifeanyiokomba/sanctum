# Fix Dashboard.tsx - add missing lucide imports
$content = Get-Content apps\web\src\pages\Dashboard.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ cn, formatCurrency, formatRelativeTime \} from', 'import { cn, formatCurrency, formatRelativeTime } from'
    $content = $content -replace 'import \{ cn, formatCurrency, formatRelativeTime \} from', 'import { Users, DollarSign, Calendar, UserCheck, Heart, CheckSquare, Target, TrendingUp } from "lucide-react";`nimport { cn, formatCurrency, formatRelativeTime } from'
}
Set-Content apps\web\src\pages\Dashboard.tsx $content

# Fix EventsPage.tsx
$content = Get-Content apps\web\src\pages\EventsPage.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ cn, formatDateTime \} from', 'import { Plus, Search, Calendar, MapPin, Users, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Clock, Filter } from "lucide-react";`nimport { cn, formatDateTime } from'
}
Set-Content apps\web\src\pages\EventsPage.tsx $content

# Fix GivingPage.tsx
$content = Get-Content apps\web\src\pages\GivingPage.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ Card, CardContent, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent \} from', 'import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from'
    $content = $content -replace 'import \{ cn, formatCurrency, formatDate \} from', 'import { DollarSign, Heart, TrendingUp, Download, Plus, Filter, Search, CreditCard, Banknote, Recycle } from "lucide-react";`nimport { cn, formatCurrency, formatDate } from'
}
Set-Content apps\web\src\pages\GivingPage.tsx $content

# Fix CheckinPage.tsx
$content = Get-Content apps\web\src\pages\CheckinPage.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsTrigger, TabsContent, Avatar, AvatarFallback \} from', 'import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsTrigger, TabsContent, Avatar, AvatarFallback } from'
    $content = $content -replace 'import \{ cn, formatDateTime \} from', 'import { Search, CheckCircle, XCircle, Plus, Printer, Settings, UserPlus, AlertTriangle, Bell, Camera, QrCode, Calendar } from "lucide-react";`nimport { cn, formatDateTime } from'
}
Set-Content apps\web\src\pages\CheckinPage.tsx $content

# Fix PeoplePage.tsx
$content = Get-Content apps\web\src\pages\PeoplePage.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ cn \} from', 'import { Plus, Search, Filter, MoreVertical, Mail, Phone, MapPin, UserPlus, Download, Upload, Eye, Edit, Trash2, Users } from "lucide-react";`nimport { cn } from'
}
Set-Content apps\web\src\pages\PeoplePage.tsx $content

# Fix ReportsPage.tsx
$content = Get-Content apps\web\src\pages\ReportsPage.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ cn, formatDate \} from', 'import { Download, Plus, Filter, Users, DollarSign, FileText, UserPlus, UserCheck } from "lucide-react";`nimport { cn, formatDate } from'
}
Set-Content apps\web\src\pages\ReportsPage.tsx $content

# Fix VolunteersPage.tsx
$content = Get-Content apps\web\src\pages\VolunteersPage.tsx
if ($content -notmatch 'from.*lucide-react') {
    $content = $content -replace 'import \{ cn, formatDate \} from', 'import { UserCheck, Calendar, Plus, Search, Filter, Clock, UserPlus, Mail, Phone, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";`nimport { cn, formatDate } from'
}
Set-Content apps\web\src\pages\VolunteersPage.tsx $content

# Fix GivingPage.tsx - add CardHeader back
$content = Get-Content apps\web\src\pages\GivingPage.tsx
if ($content -notmatch 'CardHeader') {
    $content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent \} from', 'import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from'
}
Set-Content apps\web\src\pages\GivingPage.tsx $content

# Fix EventsPage.tsx - add CardHeader back
$content = Get-Content apps\web\src\pages\EventsPage.tsx
if ($content -notmatch 'CardHeader') {
    $content = $content -replace 'import \{ Card, CardContent, Button, Input, Badge \} from', 'import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge } from'
    $content = $content -replace 'import \{ cn, formatDateTime \} from', 'import { cn, formatDate, formatDateTime } from'
}
Set-Content apps\web\src\pages\EventsPage.tsx $content

# Fix PeoplePage.tsx
$content = Get-Content apps\web\src\pages\PeoplePage.tsx
if ($content -notmatch 'CardHeader') {
    $content = $content -replace 'import \{ Card, CardContent, Button, Input, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage \} from', 'import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage } from'
}
Set-Content apps\web\src\pages\PeoplePage.tsx $content

# Fix GivingPage.tsx - fix CardHeader in JSX
$content = Get-Content apps\web\src\pages\GivingPage.tsx
$content = $content -replace '<Card><CardContent className="p-6">', '<Card><CardHeader><CardTitle>Fund Balances</CardTitle></CardHeader><CardContent className="p-6">'
$content = $content -replace '<Card><CardContent className="p-6"><div className="space-y-3">', '<Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle>Recent Transactions</CardTitle><a href="#" className="text-sm text-primary hover:underline">View all</a></CardHeader><CardContent><div className="space-y-3">'
Set-Content apps\web\src\pages\GivingPage.tsx $content

echo "Lucide imports fixed!"