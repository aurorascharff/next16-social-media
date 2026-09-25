'use client';

import { AlertTriangle } from 'lucide-react';
import { catchError, type ErrorInfo } from 'next/error';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

function ErrorFallback(props: { title?: string; compact?: boolean }, { retry }: ErrorInfo) {
  const [isPending, startTransition] = useTransition();

  if (props.compact) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-4 text-center">
        <AlertTriangle className="text-danger h-4 w-4" />
        <p className="text-gray text-xs">{props.title ?? 'Something went wrong'}</p>
        <Button
          onClick={() => startTransition(() => retry())}
          disabled={isPending}
          aria-busy={isPending}
          size="sm"
          variant="secondary"
        >
          {isPending && <Spinner />}
          {isPending ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
      <AlertTriangle className="text-danger h-6 w-6" />
      <p className="text-sm font-medium text-black dark:text-white">{props.title ?? 'Something went wrong'}</p>
      <Button
        onClick={() => startTransition(() => retry())}
        disabled={isPending}
        aria-busy={isPending}
        size="sm"
        variant="secondary"
      >
        {isPending && <Spinner />}
        {isPending ? 'Retrying…' : 'Try again'}
      </Button>
    </div>
  );
}

export default catchError(ErrorFallback);
