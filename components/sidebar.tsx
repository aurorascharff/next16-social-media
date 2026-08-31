import { Bell, Bookmark, Home, Search, User } from 'lucide-react';
import { Suspense } from 'react';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { DropMark } from '@/components/ui/drop-mark';
import ErrorBoundary from '@/components/ui/error-boundary';
import { GitHubIcon } from '@/components/ui/github-icon';
import { NavLinkSkeleton } from '@/components/ui/nav-link';
import { NavLinkSegments as NavLink } from '@/components/ui/nav-link-segments';
import { PrefetchLink } from '@/components/ui/prefetch-link';
import { Skeleton } from '@/components/ui/skeleton';
import { NewDropModal } from '@/features/drop/components/composer-modal';
import { NotificationsBadge } from '@/features/notifications/components/notifications-badge';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';
import { UserSwitcher } from '@/features/user/components/user-switcher';
import { getAllUsers, getCurrentUser, getCurrentUserHandle } from '@/features/user/user-queries';
import type { Route } from 'next';

const sidebarLinkClass =
  'flex items-center justify-center gap-4 rounded-lg p-2.5 text-base tracking-tight lg:justify-start lg:px-3 not-aria-[current=page]:hover:bg-card dark:not-aria-[current=page]:hover:bg-card-dark aria-[current=page]:bg-accent/10 aria-[current=page]:text-accent aria-[current=page]:dark:bg-accent/15 aria-[current=page]:font-bold aria-[current=page]:dark:text-blue-400 aria-[current=page]:[&_svg]:stroke-[2.5]';

export function Sidebar() {
  return (
    <aside className="peer group/sidebar sticky top-0 hidden h-dvh flex-col items-center gap-4 overflow-y-auto overscroll-y-contain px-2 py-5 sm:flex lg:items-stretch lg:px-6">
      <div className="flex items-center justify-between gap-1 px-2 pb-2">
        <PrefetchLink
          href="/"
          className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight text-black dark:text-white"
          aria-label="Drop home"
        >
          <DropMark size={28} className="text-black dark:text-white" />
          <span className="hidden lg:inline">drop</span>
        </PrefetchLink>
        <a
          href="https://github.com/aurorascharff/next16-social-media"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray hidden rounded-full p-1.5 transition-colors hover:text-black lg:inline-flex dark:hover:text-white"
          aria-label="View source on GitHub"
        >
          <GitHubIcon className="size-4" />
        </a>
      </div>
      <div className="hidden lg:block">
        <ErrorBoundary title="Your profile is offline" compact>
          <Suspense fallback={<SidebarProfilePillSkeleton />}>
            <SidebarProfilePill />
          </Suspense>
        </ErrorBoundary>
      </div>
      <nav className="flex flex-1 flex-col gap-1.5 text-sm font-medium">
        <NavLink href="/" aria-label="Home" className={sidebarLinkClass}>
          <Home className="h-5 w-5" />
          <span className="hidden lg:inline">Home</span>
        </NavLink>
        <NavLink href="/search" aria-label="Search" className={sidebarLinkClass}>
          <Search className="h-5 w-5" />
          <span className="hidden lg:inline">Search</span>
        </NavLink>
        <NavLink href="/bookmarks" aria-label="Bookmarks" className={sidebarLinkClass}>
          <Bookmark className="h-5 w-5" />
          <span className="hidden lg:inline">Bookmarks</span>
        </NavLink>
        <NavLink href="/notifications" aria-label="Activity" className={sidebarLinkClass}>
          <Bell className="h-5 w-5" />
          <span className="hidden lg:inline">Activity</span>
          <NotificationsBadge />
        </NavLink>
        <Suspense
          fallback={
            <NavLinkSkeleton className={sidebarLinkClass}>
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Profile</span>
            </NavLinkSkeleton>
          }
        >
          {getCurrentUserHandle().then(handle => (
            <NavLink href={`/u/${handle}` as Route} aria-label="Profile" className={sidebarLinkClass}>
              <User className="h-5 w-5" />
              <span className="hidden lg:inline">Profile</span>
            </NavLink>
          ))}
        </Suspense>
        <div className="hidden pt-2 lg:block">
          <NewDropModal
            avatar={
              <Suspense fallback={<UserAvatarSkeleton size="md" />}>
                <CurrentUserAvatar />
              </Suspense>
            }
          />
        </div>
      </nav>
      <div className="hidden lg:block">
        <SidebarFooter />
      </div>
    </aside>
  );
}

function SidebarFooter() {
  return (
    <div className="px-2">
      <ThemeToggle variant="inline" />
    </div>
  );
}

async function SidebarProfilePill() {
  const [user, allUsers] = await Promise.all([getCurrentUser(), getAllUsers()]);
  if (!user) return null;

  return <UserSwitcher currentHandle={user.handle} users={allUsers} />;
}

function SidebarProfilePillSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg px-2 py-1.5" aria-hidden>
      <UserAvatarSkeleton size="sm" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Skeleton className="h-5.25 w-20 rounded" />
        <Skeleton className="h-3.75 w-14 rounded" />
      </div>
    </div>
  );
}
