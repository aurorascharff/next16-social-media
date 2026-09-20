<div align="center">

<img src="public/logo.svg" alt="Drop" width="72" height="72" />

# Next 16 Social Media "Drop"

A dev-flavored social network that demonstrates [Instant Navigations](https://nextjs.org/docs/app/guides/instant-navigation) in [Next.js 16.3](https://nextjs.org/blog/next-16-3-instant-navigations).

[**Live demo →**](https://next16-social-media.vercel.app/)

</div>

---

The architecture follows the [Next.js App Architecture](https://github.com/aurorascharff/nextjs-app-architecture-skill) skill and the [Component Architecture for React Server Components](https://aurorascharff.no/posts/component-architecture-for-react-server-components/) blog post.

## Features

- **[Cache Components](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)** cache each query with `'use cache'`, name the data with `cacheTag`, and set its lifetime with `cacheLife`, so repeated reads come from the cache until a tag is invalidated. Per-user reads use [`'use cache: private'`](https://nextjs.org/docs/app/api-reference/directives/use-cache-private).
- **[Partial Prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)** prefetches one shared App Shell per route. Links with `prefetch={true}` also resolve dynamic `params` and `searchParams`, including the cached content behind them while uncached data streams after navigation.
- **[Hover-triggered prefetch](https://nextjs.org/docs/app/guides/prefetching)** delays URL-specific prefetches for profiles, posts, and tags until the pointer or focus reaches a link, avoiding a separate prefetch for every destination in view.
- **[Server Functions](https://nextjs.org/docs/app/getting-started/mutating-data)** run mutations such as posting a drop or following someone on the server, and invalidate only the tags they change with [`updateTag`](https://nextjs.org/docs/app/api-reference/functions/updateTag), which re-prefetches the affected routes so they stay instant and reflect the change.
- **[React Compiler](https://react.dev/learn/react-compiler)** memoizes components and hooks automatically, so the code needs no manual `useMemo` or `useCallback`.
- **[View Transitions](https://nextjs.org/docs/app/guides/view-transitions)** animate the tab underline as a shared element, transition rows as the lists change, and cross-fade content as it streams in from Suspense.
- **[Async React](https://github.com/rickhanlonii/async-react)** keeps the UI interactive during server work with `Suspense`, `useOptimistic`, `useTransition`, `useActionState`, `useFormStatus`, and `use`.

## Getting started

Drop runs on Postgres. Copy `.env.sample` to `.env.local` and update `DATABASE_URL` for your database. Local Postgres instances without TLS need `?sslmode=disable`.

```bash
pnpm install
pnpm run prisma.push
pnpm run prisma.seed
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You can browse the data with `pnpm run prisma.studio`, or wipe and re-seed the database with `pnpm run prisma.reset`.

<details>
<summary>Run locally without Postgres</summary>

Drop this prompt into your agent to swap the datasource for SQLite:

> Set up Drop to run locally on SQLite instead of Postgres. Swap `provider = "postgresql"` to `provider = "sqlite"` in `prisma/schema.prisma`. Replace `@prisma/adapter-pg` with `@prisma/adapter-better-sqlite3` in `lib/prisma-client.ts` and `prisma/seed.ts`, using `new PrismaBetterSqlite3({ url })` where `url` is `process.env.DATABASE_URL` with the `file:` prefix stripped. Remove the `mode: 'insensitive'` Prisma filter options since SQLite does not support them. Install `@prisma/adapter-better-sqlite3` and `better-sqlite3`, uninstall `@prisma/adapter-pg`, `pg`, and `@types/pg`. Write `DATABASE_URL=file:./prisma/dev.db` to `.env.local`.

The schema is otherwise identical, so the rest of the app behaves the same as production.

</details>

## Testing

The end-to-end tests use [`@next/playwright`](https://nextjs.org/docs/app/guides/testing/playwright) with the [`instant()`](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant) API to assert that loading states appear and that navigations stay instant.

```bash
pnpm test:e2e
```

## Stack

- **[Next.js 16](https://nextjs.org/)**: App Router, Cache Components, Server Functions
- **[React 19](https://react.dev/)** with React Compiler: Suspense, View Transitions, `useOptimistic`
- **[TypeScript](https://www.typescriptlang.org/)** and **[Tailwind CSS v4](https://tailwindcss.com/)**
- **[Prisma 7](https://www.prisma.io/)** on PostgreSQL (Neon)
- **[Ariakit](https://ariakit.org/)** for accessible dialogs and popovers
- **[Shiki](https://shiki.style/)** for server-side syntax highlighting

## License

[MIT](LICENSE)
