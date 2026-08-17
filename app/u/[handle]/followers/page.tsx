import { Suspense } from 'react';

// Experimental route for trying RelativeNavLink (see components/ui/relative-nav-link.tsx).
export default function FollowersPage({ params }: { params: Promise<{ handle: string }> }) {
  return (
    <Suspense fallback={<p className="p-4">Loading followers…</p>}>
      <Followers params={params} />
    </Suspense>
  );
}

async function Followers({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return <p className="p-4">Followers of @{handle}</p>;
}
