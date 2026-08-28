'use client';

import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Boundary } from '@/components/internal/boundary';

type Props = {
  title?: string;
  children?: React.ReactNode;
  back?: boolean;
};

export function PageHeader({ title, children, back }: Props) {
  const router = useRouter();
  return (
    <Boundary label="PageHeader">
      <header
        className="border-divider/70 dark:border-divider-dark/70 sticky top-0 z-30 flex items-center gap-3 border-b bg-white/70 px-4 py-4 backdrop-blur-md backdrop-saturate-150 sm:px-5 dark:bg-black/70"
        style={{ viewTransitionName: 'page-header' }}
      >
        {back ? (
          <button
            type="button"
            aria-label="Go back"
            onClick={() => {
              router.back();
            }}
            className="text-gray -ml-1 rounded-full p-1 transition-colors hover:text-black dark:hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : null}
        {title ? <h1 className="text-lg font-bold tracking-tight">{title}</h1> : null}
        {children}
      </header>
    </Boundary>
  );
}
