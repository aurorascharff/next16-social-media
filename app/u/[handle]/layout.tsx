import { RelativeNavLink } from '@/components/ui/relative-nav-link';

const profileLinkClass =
  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm tracking-tight transition-colors not-aria-[current=page]:hover:bg-card dark:not-aria-[current=page]:hover:bg-card-dark aria-[current=page]:bg-accent/10 aria-[current=page]:text-accent aria-[current=page]:dark:bg-accent/15 aria-[current=page]:font-bold aria-[current=page]:dark:text-blue-400';

// Experimental layout trying RelativeNavLink (PR #96068 preview build).
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav
        className="border-divider/70 dark:border-divider-dark/70 flex gap-1 border-b p-2"
        aria-label="Profile pages"
        data-testid="relative-nav"
      >
        <RelativeNavLink href="/u/[handle]" segment={null} className={profileLinkClass}>
          Posts
        </RelativeNavLink>
        <RelativeNavLink href="/u/[handle]/followers" segment="followers" className={profileLinkClass}>
          Followers
        </RelativeNavLink>
      </nav>
      {children}
    </div>
  );
}
