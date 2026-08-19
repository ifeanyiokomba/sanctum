import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformAuth } from '@/core/hooks';
import { Button, Card, CardContent, Input, Label } from '@/core/ui';
import { ArrowRight, ArrowLeft, CheckCircle, Building2, Users, Heart, Briefcase } from 'lucide-react';
import { cn } from '@/core/utils';

const PERSONAS = [
  { id: 'church' as const, name: 'Church', icon: Building2, description: 'Manage members, giving, check-in, volunteers, and ministries', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'school' as const, name: 'School', icon: Users, description: 'Student records, grades, attendance, parent portal, fees', color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'ngo' as const, name: 'Nonprofit', icon: Heart, description: 'Donor management, fundraising, grants, programs, outcomes', color: 'text-red-600', bg: 'bg-red-100' },
  { id: 'sme' as const, name: 'Business', icon: Briefcase, description: 'Finance, inventory, sales, projects, HR, e-invoicing', color: 'text-purple-600', bg: 'bg-purple-100' },
];

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'persona', title: 'Organization Type' },
  { id: 'details', title: 'Details' },
  { id: 'complete', title: 'Complete' },
];

export function OnboardingPage() {
  const { user, organization } = usePlatformAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState<'church' | 'school' | 'ngo' | 'sme'>('church');
  const [orgName, setOrgName] = useState('');
  const [orgSlug, setOrgSlug] = useState('');

  const step = ONBOARDING_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const goNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePersonaSelect = (persona: typeof selectedPersona) => {
    setSelectedPersona(persona);
    goNext();
  };

  const handleComplete = () => {
    // In production, this would save the organization settings to the backend
    // For now, navigate to the dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-card rounded-2xl border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Setup Wizard</h1>
              <p className="text-sm text-muted-foreground">
                {step.title} — Step {currentStep + 1} of {ONBOARDING_STEPS.length}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              {ONBOARDING_STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center gap-1">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                    i < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : i === currentStep
                        ? 'bg-primary/20 text-primary border-2 border-primary'
                        : 'bg-muted text-muted-foreground'
                  )}>
                    {i < currentStep ? <CheckCircle className="h-5 w-5" /> : i + 1}
                  </div>
                  {i < ONBOARDING_STEPS.length - 1 && (
                    <div className={cn('h-1 w-12', i < currentStep ? 'bg-primary' : 'bg-muted')} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / (ONBOARDING_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to Sanctum</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                The unified operating platform for mission-driven organizations.
                Let&apos;s get you set up in just a few minutes.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-8">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-left',
                      selectedPersona === p.id
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:border-muted'
                    )}
                    onClick={() => handlePersonaSelect(p.id)}
                  >
                    <div className={cn('p-2 rounded-lg w-fit', p.bg)}>
                      <p.icon className={cn('h-6 w-6', p.color)} />
                    </div>
                    <h3 className="font-medium mt-2">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Persona selection (same as welcome but for re-selection) */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Organization Type</h2>
              <p className="text-muted-foreground">Choose the type that best describes your organization.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-left',
                      selectedPersona === p.id
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                        : 'border-transparent hover:border-muted'
                    )}
                    onClick={() => setSelectedPersona(p.id)}
                  >
                    <div className={cn('p-2 rounded-lg w-fit', p.bg)}>
                      <p.icon className={cn('h-6 w-6', p.color)} />
                    </div>
                    <h3 className="font-medium mt-2">{p.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                    {selectedPersona === p.id && (
                      <CheckCircle className="h-5 w-5 text-primary mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Organization Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => {
                      setOrgName(e.target.value);
                      if (!orgSlug) {
                        setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                      }
                    }}
                    placeholder="e.g., Grace Community Church"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgSlug">URL Slug</Label>
                  <Input
                    id="orgSlug"
                    value={orgSlug}
                    onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    placeholder="grace-community-church"
                  />
                  <p className="text-sm text-muted-foreground">
                    Your platform URL: <code className="bg-muted px-1 py-0.5 rounded">sanctum.app/{orgSlug || 'your-org'}</code>
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Your First Name</Label>
                    <Input id="firstName" defaultValue={user?.firstName || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Your Last Name</Label>
                    <Input id="lastName" defaultValue={user?.lastName || ''} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} disabled />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {currentStep === 3 && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {orgName || 'Your organization'} has been configured with {selectedPersona} mode.
              </p>
              <div className="p-4 rounded-xl bg-muted/50 text-left max-w-md mx-auto space-y-2">
                <p className="font-medium">{orgName || 'Organization Name'}</p>
                <p className="text-sm text-muted-foreground">
                  Mode: {selectedPersona.charAt(0).toUpperCase() + selectedPersona.slice(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  URL: sanctum.app/{orgSlug || 'your-org'}
                </p>
              </div>
              <Button size="lg" onClick={handleComplete}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={goBack} disabled={isFirst}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {!isLast && currentStep !== 0 && (
              <Button onClick={goNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {isLast && (
              <Button onClick={handleComplete}>
                Complete
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
