'use client';

import { SessionProvider } from 'next-auth/react';
import ThemeProviderWrapper from './ThemeProviderWrapper';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProviderWrapper>
        {children}
      </ThemeProviderWrapper>
    </SessionProvider>
  );
}
