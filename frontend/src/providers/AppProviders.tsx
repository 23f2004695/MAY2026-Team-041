import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'framer-motion';
import { Toaster } from 'sonner';

import { ChatbotWidget } from '@/components/layout';

import { ActiveSectionProvider } from './ActiveSectionProvider';
import { AuthProvider } from './AuthProvider';
import { LanguageProvider } from './LanguageProvider';
import { ThemeProvider } from './ThemeProvider';

export interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* reduceMotion="user" makes every Framer Motion animation site-wide honor prefers-reduced-motion */}
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <ThemeProvider>
            <AuthProvider>
              <ActiveSectionProvider>
                {children}
                <ChatbotWidget />
                <Toaster richColors closeButton position="top-right" />
              </ActiveSectionProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
