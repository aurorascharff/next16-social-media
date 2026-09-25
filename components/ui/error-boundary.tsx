'use client';

import { AlertTriangle } from 'lucide-react';
import { catchError, type ErrorInfo } from 'next/error';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

function RetryButton({ retry }: { retry: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => startTransition(() => retry())}
      size="sm"
      variant="secondary"
    >
      {isPending && <Spinner />}
      {isPending ? 'Retrying…' : 'Try again'}
    </Button>
  );
}

function ErrorFallback(props: { title?: string; compact?: boolean }, { retry }: ErrorInfo) {
  if (props.compact) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
        <AlertTriangle className="text-danger h-4 w-4" />
        <p className="text-gray text-xs">{props.title ?? 'Something went wrong'}</p>
        <RetryButton retry={retry} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <AlertTriangle className="text-danger h-6 w-6" />
      <p className="text-sm font-medium text-black dark:text-white">{props.title ?? 'Something went wrong'}</p>
      <RetryButton retry={retry} />
    </div>
  );
}

export default catchError(ErrorFallback);
