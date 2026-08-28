import Link from 'next/link';
import { CodeBlock } from '@/components/ui/code-block';
import { splitCode, tokenizeText, type Token } from '@/features/drop/drop-format';
import { cn } from '@/lib/utils';
import type { Route } from 'next';

type Props = {
  body: string;
  compact?: boolean;
  detail?: boolean;
  truncate?: boolean;
};

export function DropBody({ body, compact = false, detail = false, truncate = false }: Props) {
  const segments = splitCode(body);
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', compact && 'relative z-20')}>
      {segments.map((segment, i) => {
        if (segment.type === 'code') {
          if (compact) return null;
          return (
            <div key={i} className="relative z-20">
              <CodeBlock lang={segment.lang} code={segment.code} />
            </div>
          );
        }
        return (
          <p
            key={i}
            className={
              detail
                ? 'wrap-anywhere text-[17px] leading-relaxed text-black dark:text-white'
                : `wrap-anywhere text-[15px] leading-snug text-black dark:text-white ${truncate ? 'line-clamp-5' : ''}`
            }
          >
            {renderText(segment.text)}
          </p>
        );
      })}
    </div>
  );
}

function renderToken(token: Token, key: string) {
  switch (token.type) {
    case 'bold':
      return (
        <strong key={key} className="font-semibold">
          {token.text}
        </strong>
      );
    case 'italic':
      return <em key={key}>{token.text}</em>;
    case 'tag':
      return (
        <Link key={key} href={`/tag/${token.tag}` as Route} className="text-accent relative z-20 hover:underline">
          #{token.tag}
        </Link>
      );
    case 'url':
      return (
        <a
          key={key}
          href={token.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent relative z-20 break-all hover:underline"
        >
          {token.url.replace(/^https?:\/\//, '')}
        </a>
      );
    default:
      return <span key={key}>{token.text}</span>;
  }
}

function renderText(text: string) {
  const lines = tokenizeText(text);
  return lines.flatMap((tokens, lineIdx) => {
    const parts = tokens.map((token, i) => renderToken(token, `${lineIdx}-${i}`));
    if (lineIdx < lines.length - 1) {
      parts.push(<br key={`br-${lineIdx}`} />);
    }
    return parts;
  });
}
