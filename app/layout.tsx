import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Suspense } from 'react';
import { SWRConfig, preload } from 'swr';
import { DemoToolbar } from '@/components/demo/demo-toolbar';
import { BoundaryProvider } from '@/components/internal/boundary';
import { MobileTabBar } from '@/components/mobile-nav';
import { OfflineIndicator } from '@/components/offline-indicator';
import { NavLinkScript } from '@/components/scripts/nav-link-script';
import { Sidebar } from '@/components/sidebar';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { Toaster } from '@/components/toaster';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import ErrorBoundary from '@/components/ui/error-boundary';
import { getUnreadNotificationCount } from '@/features/notifications/notifications-queries';
import { TrendingTags, TrendingTagsSkeleton } from '@/features/tag/components/trending-tags';
import { WhoToFollow, WhoToFollowSkeleton } from '@/features/user/components/who-to-follow';
import { UNREAD_KEY } from '@/lib/swr';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: [
    { color: '#ffffff', media: '(prefers-color-scheme: light)' },
    { color: '#000000', media: '(prefers-color-scheme: dark)' },
  ],
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  description: 'A dev-flavored social network.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : 'http://localhost:3000'),
  ),
  openGraph: {
    siteName: 'Drop',
    type: 'website',
  },
  title: {
    default: 'Drop',
    template: '%s · Drop',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const unread = preload(UNREAD_KEY, () => getUnreadNotificationCount());
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-[100dvh] flex-col bg-white text-black antialiased dark:bg-black dark:text-white">
        <ThemeProvider>
          <BoundaryProvider>
            <OfflineIndicator />
            <SWRConfig value={{ cacheData: unread }}>
              <AppGrid>
                <Sidebar />
                <MainColumn>{children}</MainColumn>
                <RightSidebar>
                  <ErrorBoundary title="Tags unavailable" compact>
                    <AnimatedSuspense fallback={<TrendingTagsSkeleton />}>
                      <TrendingTags />
                      <ErrorBoundary title="No suggestions" compact>
                        <AnimatedSuspense fallback={<WhoToFollowSkeleton />}>
                          <WhoToFollow />
                        </AnimatedSuspense>
                      </ErrorBoundary>
                    </AnimatedSuspense>
                  </ErrorBoundary>
                </RightSidebar>
              </AppGrid>
              <MobileTabBar />
            </SWRConfig>
            <div className="demo-toggles fixed top-4 right-4 z-50 hidden items-start gap-2 sm:flex lg:top-6 lg:right-6">
              <Suspense fallback={null}>
                <DemoToolbar />
              </Suspense>
            </div>
            <Toaster />
            <NavLinkScript />
          </BoundaryProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

function AppGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 pt-[env(safe-area-inset-top)] pr-[env(safe-area-inset-right)] pl-[env(safe-area-inset-left)] sm:grid-cols-[4.5rem_minmax(0,1fr)] lg:grid-cols-[17.5rem_minmax(0,1fr)] xl:grid-cols-[17.5rem_minmax(0,38rem)_20rem]">
      {children}
    </div>
  );
}

function MainColumn({ children }: { children: React.ReactNode }) {
  return (
    <main className="sm:border-divider/70 dark:sm:border-divider-dark/70 min-w-0 transition-opacity peer-has-data-pending:opacity-50 sm:border-x">
      {children}
    </main>
  );
}

function RightSidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="sticky top-0 hidden h-dvh flex-col gap-4 overflow-y-auto overscroll-y-contain px-4 py-5 xl:flex xl:pt-20">
      {children}
    </aside>
  );
}
