'use client';

import { usePlatformAuth } from '@/core/hooks';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/core/ui';
import { Building2, ArrowRight } from 'lucide-react';

export function OnboardingPage() {
  const { user } = usePlatformAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-card rounded-2xl border shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b bg-muted/50">
          <h1 className="text-xl font-bold">Setup Wizard</h1>
          <p className="text-sm text-muted-foreground">Welcome to Sanctum - Let's get you set up</p>
        </div>
        <div className="p-6 space-y-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Building2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Welcome to Sanctum</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The unified operating platform for mission-driven organizations.
          </p>
          <Button size="lg" onClick={() => {}}>
            <ArrowRight className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}