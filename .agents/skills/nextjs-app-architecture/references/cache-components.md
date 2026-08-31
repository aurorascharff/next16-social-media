# Cache Components

Decisions for when [`cacheComponents: true`](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents) is set in `next.config.ts`. This file is about _which reads to cache, which directive to use, and how to invalidate_ — for the mechanics of each directive, follow the doc links.

## When this reference applies

Use this reference when an app already has `cacheComponents: true`, the user wants this architecture while enabling it, or you are reviewing/refactoring an app that targets Cache Components.

If the project has not adopted Cache Components yet and the user asks to enable, migrate, or work through adoption blockers, use the `next-cache-components-adoption` skill first. It owns the route-by-route migration loop, opt-out strategy, and build/dev overlay workflow. Then return here for steady-state query/action/component architecture.

If `cacheComponents` is not enabled and the task is ordinary feature work, follow the core references without adding cache directives. Do not recommend skipping Cache Components based on app category alone; adoption is a migration/project decision, not a per-feature shortcut.

Adopting these in an existing app: follow [Migrating to Cache Components](https://preview.nextjs.org/docs/app/guides/migrating-to-cache-components) and [Adopting Partial Prefetching](https://preview.nextjs.org/docs/app/guides/adopting-partial-prefetching) — they cover the incremental path (per-route `prefetch = 'partial'`, fixing dynamic-usage build errors) rather than a big-bang switch.

## The model

```ts
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true, // prefetch the static shell of linked routes
};
```

- **Static shell** — synchronous content, `'use cache'` output, and Suspense fallbacks prerender at build time.
- **Dynamic holes** — async work without `'use cache'` streams in behind `<Suspense>` at request time.
- **Build constraint** — any async work without `'use cache'` must sit inside `<Suspense>`, or the build fails (wrap it, or add `'use cache'`).

`cacheComponents` implies Partial Prerendering — it replaced `experimental.ppr` / `dynamicIO` / `useCache`, so don't set those. See [caching](https://preview.nextjs.org/docs/app/getting-started/caching).

With `cacheComponents: true`, the skill practice is **cache reusable reads**. Do not leave a database/API read dynamic just because Suspense makes the build pass. If a read has a stable key and a mutation can name what changed, give it a cache directive, tags, and a lifetime.

Dynamic reads are the exception: use them for values that must be recomputed for every request or cannot be invalidated coherently. When you leave a read dynamic, note the reason in the surrounding code/review and invalidate its mutations with `refresh()` because there is no tag to update.

## Decide what to cache

| Data                                                     | Directive                                                                                                | Notes                                                                                                                                                                                                                            |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cacheable across users (public listings, computed pages) | [`'use cache'`](https://preview.nextjs.org/docs/app/api-reference/directives/use-cache)                  | Add [`cacheTag`](https://preview.nextjs.org/docs/app/api-reference/functions/cacheTag) (a global + a scoped tag) and a [`cacheLife`](https://preview.nextjs.org/docs/app/api-reference/config/next-config-js/cacheLife) profile. |
| Per-user / reads cookies, headers, session               | [`'use cache: private'`](https://preview.nextjs.org/docs/app/api-reference/directives/use-cache-private) | Cached in the browser only, doesn't persist across reloads; never stored on the server.                                                                                                                                          |
| Remote service, safe across users, worth durable storage | [`'use cache: remote'`](https://preview.nextjs.org/docs/app/api-reference/directives/use-cache-remote)   | Protects against rate-limited third-party APIs.                                                                                                                                                                                  |
| Genuinely dynamic per request                            | none                                                                                                     | Must be justified. Read inside `<Suspense>`; mutations use `refresh()` because no tag exists.                                                                                                                                    |

Cache the **query** when its result should be reused across requests. Cache the **component** when rendering is expensive and props are stable (a nav, a trending sidebar). Don't `'use cache'` a component that already calls a `'use cache'` query — double-caching, no benefit.

## Keep a synchronous value out of the shell

You usually don't need this. A query that reads `cookies()`/`headers()` or awaits a DB/`fetch` inside `<Suspense>` already stays out of the shell on its own. Only a _synchronous_ request-time read (`new Date()`, `Math.random()`, a sync sqlite read) needs help: `await` [`io()`](https://preview.nextjs.org/docs/app/api-reference/functions/io) before it, with the caller inside `<Suspense>`.

Prefer `io()` over [`connection()`](https://preview.nextjs.org/docs/app/api-reference/functions/connection): both exclude what follows from the shell, but `connection()` blocks prefetches while `io()` stays prefetchable. Reach for `connection()` only when rendering must wait for a real user request.

## Decide how to invalidate

- [`updateTag(tag)`](https://preview.nextjs.org/docs/app/api-reference/functions/updateTag) — in **server actions**, when the user should see the result immediately (read-your-own-writes). Requires the query to carry a matching `cacheTag`.
- [`revalidateTag(tag, 'max')`](https://preview.nextjs.org/docs/app/api-reference/functions/revalidateTag) — in **route handlers** (webhooks, cron) for stale-while-revalidate. The single-arg `revalidateTag(tag)` form is deprecated.
- [`refresh()`](https://preview.nextjs.org/docs/app/api-reference/functions/refresh) — re-render the current route for the current user. Use it for deliberately dynamic reads with no tag; don't use it instead of `updateTag()` for cached reads.

Tag, cache, invalidate: the `cacheTag` in the query and the `updateTag` in the action use the same string and live in the same feature folder.

## Without Cache Components

- Don't use `'use cache'` / `cacheTag` / `cacheLife` — they require the flag.
- Use React `cache()` only for proven same-request dedup needs; plain `server-only` async queries are the default.
- Invalidate with `refresh()` from server actions.
- Pages can use `await params` or `params.then()` — `params.then()` still helps chrome paint, but there's no static shell to preserve.
