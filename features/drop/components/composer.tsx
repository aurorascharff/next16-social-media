import { Plus } from 'lucide-react';

import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { NewDropModal } from '@/features/drop/components/composer-modal';
import { QuickDropForm } from '@/features/drop/components/quick-drop-form';
import { CurrentUserAvatar, UserAvatarSkeleton } from '@/features/user/components/user-avatar';

export function DropComposer() {
  return (
    <>
      <QuickDropForm
        avatar={
          <AnimatedSuspense fallback={<UserAvatarSkeleton size="md" />}>
            <CurrentUserAvatar />
          </AnimatedSuspense>
        }
      />
      <div className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.75rem)] z-50 sm:right-6 sm:bottom-6 lg:hidden">
        <NewDropModal
          onOpenTrigger={
            <span
              aria-label="New drop"
              className="bg-accent hover:bg-accent-hover flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg sm:w-auto sm:gap-2 sm:px-5"
            >
              <Plus className="h-6 w-6" />
              <span className="hidden text-sm font-semibold sm:inline">New drop</span>
            </span>
          }
          avatar={
            <AnimatedSuspense fallback={<UserAvatarSkeleton size="md" />}>
              <CurrentUserAvatar />
            </AnimatedSuspense>
          }
        />
      </div>
    </>
  );
}
