
import { SignIn } from '@clerk/clerk-react';
import { Building2 } from 'lucide-react';

export function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome to Sanctum</h1>
          <p className="text-muted-foreground mt-2">Unified operating platform for mission-driven organizations</p>
        </div>

        <div className="bg-card border rounded-2xl p-8">
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
                card: 'shadow-none border-none bg-transparent',
                headerTitle: 'text-2xl font-bold',
                headerSubtitle: 'text-muted-foreground',
                socialButtonsBlockButton: 'border border-muted hover:bg-muted',
              },
              variables: {
                colorPrimary: '#2563eb',
                colorBackground: 'transparent',
                colorInputBackground: 'hsl(var(--background))',
                colorInputText: 'hsl(var(--foreground))',
              }
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            redirectUrl="/onboarding"
          />
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>By continuing, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.</p>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Need help? <a href="#" className="text-primary hover:underline">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
}