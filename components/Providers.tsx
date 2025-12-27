'use client';

import { SessionProvider } from 'next-auth/react';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import { ToastProvider } from './common/Toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProviderWrapper>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProviderWrapper>
    </SessionProvider>
  );
}
