import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/core/ui';
import { AuthProvider } from '@/core/hooks';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import App from './App';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error(
    'Missing VITE_CLERK_PUBLISHABLE_KEY environment variable. '
    + 'Please set it in your .env.local file or in the Keys/API keys tab.'
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          publishableKey={clerkPubKey || ''}
          afterSignInUrl="/dashboard"
          afterSignUpUrl="/onboarding"
        >
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ClerkProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}