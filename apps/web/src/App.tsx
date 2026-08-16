import { Routes, Route, Navigate } from 'react-router-dom';
import { usePlatformAuth } from './core/hooks';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './pages/Dashboard';
import { PeoplePage } from './pages/PeoplePage';
import { EventsPage } from './pages/EventsPage';
import { GivingPage } from './pages/GivingPage';
import { CheckinPage } from './pages/CheckinPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { SignInPage } from './pages/SignInPage';
import { LoadingScreen } from './components/ui/LoadingScreen';

function MainLayout() {
  const { isLoaded, isSignedIn } = usePlatformAuth();

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  if (!isSignedIn) {
    return <SignInPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/people" element={<PeoplePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/giving" element={<GivingPage />} />
            <Route path="/checkin" element={<CheckinPage />} />
            <Route path="/volunteers" element={<VolunteersPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <MainLayout />;
}