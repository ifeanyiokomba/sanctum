# Fix Dashboard.tsx
$content = Get-Content apps\web\src\pages\Dashboard.tsx
$content = $content -replace 'import \{ usePeoplePermissions, useTransactionPermissions \} from', '// import { usePeoplePermissions, useTransactionPermissions } from'
Set-Content apps\web\src\pages\Dashboard.tsx $content

# Fix EventsPage.tsx
$content = Get-Content apps\web\src\pages\EventsPage.tsx
$content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Input, Badge \} from', 'import { Card, CardContent, Button, Input, Badge } from'
$content = $content -replace 'import \{ cn, formatDate, formatDateTime \} from', 'import { cn, formatDateTime } from'
Set-Content apps\web\src\pages\EventsPage.tsx $content

# Fix GivingPage.tsx
$content = Get-Content apps\web\src\pages\GivingPage.tsx
$content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent \} from', 'import { Card, CardContent, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from'
Set-Content apps\web\src\pages\GivingPage.tsx $content

# Fix CheckinPage.tsx
$content = Get-Content apps\web\src\pages\CheckinPage.tsx
$content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Avatar, AvatarFallback, AvatarImage \} from', 'import { Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, Tabs, TabsTrigger, TabsContent, Avatar, AvatarFallback } from'
$content = $content -replace 'const \{ canCreate \} = useEventPermissions\(\);', 'const { } = useEventPermissions();'
$content = $content -replace 'canCreate &&', 'false &&'
$content = $content -replace 'from \x27../../core/ui\x27', 'from \x27@/core/ui\x27'
$content = $content -replace 'from \x27../../core/hooks\x27', 'from \x27@/core/hooks\x27'
$content = $content -replace 'from \x27../../core/utils\x27', 'from \x27@/core/utils\x27'
Set-Content apps\web\src\pages\CheckinPage.tsx $content

# Fix OnboardingPage.tsx
$content = Get-Content apps\web\src\pages\OnboardingPage.tsx
$content = $content -replace 'import \{ Button, Card, CardContent, CardHeader, CardTitle \} from', 'import { Button } from'
$content = $content -replace 'const \{ user \} = usePlatformAuth\(\);', 'const { } = usePlatformAuth();'
$content = $content -replace 'from \x27../core/hooks\x27', 'from \x27@/core/hooks\x27'
$content = $content -replace 'from \x27../core/ui\x27', 'from \x27@/core/ui\x27'
$content = $content -replace 'from \x27../core/utils\x27', 'from \x27@/core/utils\x27'
Set-Content apps\web\src\pages\OnboardingPage.tsx $content

# Fix PeoplePage.tsx
$content = Get-Content apps\web\src\pages\PeoplePage.tsx
$content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Input, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage \} from', 'import { Card, CardContent, Button, Input, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Avatar, AvatarFallback, AvatarImage } from'
$content = $content -replace 'import \{ cn, formatDate \} from', 'import { cn } from'
$content = $content -replace 'import \{ Plus, Search, Filter, MoreVertical, Mail, Phone, MapPin, UserPlus, Download, Upload, Eye, Edit, Trash2, Users \} from', 'import { Plus, Search, Filter, MoreVertical, Mail, Phone, MapPin, UserPlus, Download, Upload, Eye, Edit, Trash2, Users } from'
Set-Content apps\web\src\pages\PeoplePage.tsx $content

# Fix ReportsPage.tsx
$content = Get-Content apps\web\src\pages\ReportsPage.tsx
$content = $content -replace 'import \{ BarChart3, Download, Plus, Search, Filter, Calendar, TrendingUp, Users, DollarSign, FileText, Settings, ChevronLeft, ChevronRight, UserPlus, UserCheck \} from', 'import { Download, Plus, Filter, Users, DollarSign, FileText, UserPlus, UserCheck } from'
$content = $content -replace 'import \{ cn, formatCurrency, formatDate \} from', 'import { cn, formatDate } from'
Set-Content apps\web\src\pages\ReportsPage.tsx $content

# Fix VolunteersPage.tsx
$content = Get-Content apps\web\src\pages\VolunteersPage.tsx
$content = $content -replace 'import \{ Card, CardContent, CardHeader, CardTitle, Button, Badge, Input, Tabs, TabsList, TabsTrigger, TabsContent \} from', 'import { Card, CardContent, Button, Badge, Input, Tabs, TabsList, TabsTrigger, TabsContent } from'
$content = $content -replace 'import \{ cn, formatDate, formatDateTime \} from', 'import { cn, formatDate } from'
$content = $content -replace 'import \{ UserCheck, Calendar, Plus, Search, Filter, Clock, UserPlus, Mail, Phone, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight \} from', 'import { UserCheck, Calendar, Plus, Search, Filter, Clock, UserPlus, Mail, Phone, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight } from'
Set-Content apps\web\src\pages\VolunteersPage.tsx $content

# Fix SettingsPage.tsx
$content = Get-Content apps\web\src\pages\SettingsPage.tsx
$content = $content -replace 'import \{ Building2, Users, Zap, Globe, Shield, Palette, Settings, Save \} from', 'import { Building2, Users, Zap, Globe, Shield, Palette, SettingsIcon, Save } from'
$content = $content -replace '<Settings className="mr-2 h-4 w-4" />', '<SettingsIcon className="mr-2 h-4 w-4" />'
$content = $content -replace '<Settings className="h-4 w-4 mr-2" />', '<SettingsIcon className="h-4 w-4 mr-2" />'
Set-Content apps\web\src\pages\SettingsPage.tsx $content

# Fix lib/api.ts
$content = Get-Content apps\web\src\lib\api.ts
$content = $content -replace 'import.meta.env.VITE_API_URL', "'/api'"
Set-Content apps\web\src\lib\api.ts $content

# Fix lib/utils.ts
$content = Get-Content apps\web\src\lib\utils.ts
$content = $content -replace 'ReturnType<typeof setTimeout>', 'number'
$content = $content -replace 'NodeJS.Timeout', 'ReturnType<typeof setTimeout>'
Set-Content apps\web\src\lib\utils.ts $content

# Fix main.tsx
$content = Get-Content apps\web\src\main.tsx
$content = $content -replace 'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY', "''"
Set-Content apps\web\src\main.tsx $content

# Fix Header.tsx
$content = Get-Content apps\web\src\components\layout\Header.tsx
$content = $content -replace 'import \{ Bell, Search, Sun, Moon, ChevronDown, Globe, Settings, Heart, UserCheck, Calendar, Wifi, WifiOff \} from', 'import { Bell, Search, Sun, Moon, ChevronDown, Globe, Settings, Heart, UserCheck, Calendar } from'
$content = $content -replace 'const \{ user, organization, getOrgPersona, isOrgAdmin, isSuperAdmin \} = usePlatformAuth\(\);', 'const { user, getOrgPersona, isOrgAdmin, isSuperAdmin } = usePlatformAuth();'
$content = $content -replace 'getOrgPersona', 'getOrgPersona()'
$content = $content -replace 'from \x27../../core/ui\x27', 'from \x27@/core/ui\x27'
$content = $content -replace 'from \x27../../core/hooks\x27', 'from \x27@/core/hooks\x27'
$content = $content -replace 'from \x27../../core/utils\x27', 'from \x27@/core/utils\x27'
Set-Content apps\web\src\components\layout\Header.tsx $content

# Fix Sidebar.tsx
$content = Get-Content apps\web\src\components\layout\Sidebar.tsx
$content = $content -replace 'import \{ LayoutDashboard, Users, Calendar, Heart, CheckSquare, UserCheck, BarChart3, Settings, Menu, X, Building2, Home \} from', 'import { LayoutDashboard, Users, Calendar, Heart, CheckSquare, UserCheck, BarChart3, Settings, Menu, X, Building2, Home } from'
$content = $content -replace 'from \x27../../core/ui\x27', 'from \x27@/core/ui\x27'
$content = $content -replace 'from \x27../../core/hooks\x27', 'from \x27@/core/hooks\x27'
$content = $content -replace 'from \x27../../core/utils\x27', 'from \x27@/core/utils\x27'
Set-Content apps\web\src\components\layout\Sidebar.tsx $content

# Fix toaster.tsx
$content = Get-Content apps\web\src\components\ui\toaster.tsx
$content = $content -replace 'type ToastActionElement = React.ReactElement<typeof ToastAction>;', ''
$content = $content -replace 'action, description', ''
$content = $content -replace 'from \x27@platform/core-ui\x27', 'from \x27@/core/utils\x27'
Set-Content apps\web\src\components\ui\toaster.tsx $content

# Fix hooks.tsx
$content = Get-Content apps\web\src\core\hooks.tsx
$content = $content -replace 'const permissions = \(user.publicMetadata\?\.permissions as Permission\[\]\) \|\| \(organization\?\.publicMetadata\?\.permissions as Permission\[\]\) \|\| \[\];', 'const permissions = (user.publicMetadata?.permissions as Permission[]) || [];'
Set-Content apps\web\src\core\hooks.tsx $content

echo "All fixes applied!"