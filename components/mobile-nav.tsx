import { Bell, Bookmark, Home, Search, User } from 'lucide-react';
import { Suspense } from 'react';
import { NavLinkSkeleton } from '@/components/ui/nav-link';
import { NavLinkSegments as NavLink } from '@/components/ui/nav-link-segments';
import { getCurrentUserHandle } from '@/features/user/user-queries';
import type { Route } from 'next';

const mobileTabClass =
  'flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors text-gray not-aria-[current=page]:hover:text-black dark:not-aria-[current=page]:hover:text-white aria-[current=page]:text-accent aria-[current=page]:font-bold aria-[current=page]:[&_svg]:stroke-[2.5]';

export function MobileTabBar() {
  return (
    <div className="h-[calc(3.625rem+env(safe-area-inset-bottom))] shrink-0 sm:hidden">
      <nav
        aria-label="Primary"
        style={{ viewTransitionName: 'mobile-nav' }}
        className="border-divider/70 dark:border-divider-dark/70 fixed inset-x-0 bottom-0 z-40 flex border-t bg-white pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] sm:hidden dark:bg-black"
      >
        <NavLink href="/" aria-label="Home" className={mobileTabClass}>
          <Home className="h-5 w-5" />
          <span>Home</span>
        </NavLink>
        <NavLink href="/search" aria-label="Search" className={mobileTabClass}>
          <Search className="h-5 w-5" />
          <span>Search</span>
        </NavLink>
        <NavLink href={'/notifications' as Route} aria-label="Activity" className={mobileTabClass}>
          <Bell className="h-5 w-5" />
          <span>Activity</span>
        </NavLink>
        <NavLink href="/bookmarks" aria-label="Saved" className={mobileTabClass}>
          <Bookmark className="h-5 w-5" />
          <span>Saved</span>
        </NavLink>
        <Suspense
          fallback={
            <NavLinkSkeleton className={mobileTabClass}>
              <User className="h-5 w-5" />
              <span>Profile</span>
            </NavLinkSkeleton>
          }
        >
          {getCurrentUserHandle().then(handle => (
            <NavLink href={`/u/${handle}` as Route} aria-label="Profile" className={mobileTabClass}>
              <User className="h-5 w-5" />
              <span>Profile</span>
            </NavLink>
          ))}
        </Suspense>
      </nav>
    </div>
  );
}
