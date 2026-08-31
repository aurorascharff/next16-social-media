'use client';

import { Bold, Code2, Eye, Hash, Italic, PenLine } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Boundary } from '@/components/internal/boundary';
import { AnimatedSuspense } from '@/components/ui/animated-suspense';
import { Button } from '@/components/ui/button';
import { ToolbarButton } from '@/features/drop/components/composer-toolbar';
import { DropPreview, PreviewSkeleton, type Preview } from '@/features/drop/components/drop-preview';
import { postDrop } from '@/features/drop/drop-actions';
import { renderDropPreview } from '@/features/drop/drop-preview-action';
import { useTextareaFormat } from '@/hooks/use-textarea-format';
import { cn } from '@/lib/utils';

type Props = {
  avatar: React.ReactNode;
};

export function QuickDropForm({ avatar }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [, startTransition] = useTransition();
  const { insertAtCaret, insertSnippet, wrapSelection } = useTextareaFormat(textareaRef);

  async function submitAction(formData: FormData) {
    const result = await postDrop(formData);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Dropped!');
    startTransition(() => {
      setMode('write');
      setPreview(null);
    });
  }

  function showPreview() {
    const body = textareaRef.current?.value.trim() ?? '';
    if (!body) {
      setPreview(null);
    } else if (preview?.body !== body) {
      setPreview({ body, node: renderDropPreview(body) });
    }
    setMode('preview');
  }

  return (
    <Boundary label="QuickDropForm">
      <section className="border-divider/70 dark:border-divider-dark/70 hidden border-b px-4 py-3 sm:block sm:px-5">
        <form ref={formRef} action={submitAction} className="flex items-start gap-3">
          {avatar}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="relative grid min-h-20">
              <textarea
                name="body"
                ref={textareaRef}
                required
                maxLength={1000}
                rows={3}
                aria-label="Drop body"
                placeholder="What did you build today?"
                onKeyDown={e => {
                  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                    e.preventDefault();
                    formRef.current?.requestSubmit();
                  }
                }}
                className={cn(
                  'placeholder-gray col-start-1 row-start-1 field-sizing-content min-h-20 w-full resize-none border-0 bg-transparent pt-1.5 pr-9 text-base leading-relaxed focus:ring-0 focus:outline-none',
                  mode === 'preview' && 'invisible',
                )}
              />
              <div
                aria-hidden={mode === 'write'}
                className={cn('col-start-1 row-start-1 pt-1.5 pr-9', mode === 'write' && 'invisible')}
              >
                <AnimatedSuspense key={preview?.body} fallback={<PreviewSkeleton />}>
                  <DropPreview preview={preview} />
                </AnimatedSuspense>
              </div>
              <div className="absolute top-1 right-0">
                {mode === 'write' ? (
                  <ToolbarButton size="sm" label="Preview" onClick={showPreview}>
                    <Eye className="h-4 w-4" />
                  </ToolbarButton>
                ) : (
                  <ToolbarButton size="sm" label="Edit" onClick={() => setMode('write')}>
                    <PenLine className="h-4 w-4" />
                  </ToolbarButton>
                )}
              </div>
            </div>
            <footer className="mt-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-0.5">
                {mode === 'write' ? (
                  <>
                    <ToolbarButton size="sm" label="Bold" onClick={() => wrapSelection('**')}>
                      <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton size="sm" label="Italic" onClick={() => wrapSelection('*')}>
                      <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton size="sm" label="Add code snippet" onClick={insertSnippet}>
                      <Code2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton size="sm" label="Add hashtag" onClick={() => insertAtCaret('#')}>
                      <Hash className="h-4 w-4" />
                    </ToolbarButton>
                  </>
                ) : null}
              </div>
              <Button type="submit">Drop it</Button>
            </footer>
          </div>
        </form>
      </section>
    </Boundary>
  );
}
