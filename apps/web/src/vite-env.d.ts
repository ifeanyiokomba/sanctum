/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
  readonly VITE_CLERK_USER_EMAIL: string;
  readonly VITE_CLERK_USER_NAME: string;
  readonly VITE_CLERK_ORG_ID: string;
  readonly VITE_APP_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_PAYSTACK_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}