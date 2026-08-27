/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { normalizeDatabaseUrl } from '../lib/db-url';

type SeedUser = {
  id: string;
  handle: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  followers: number;
  following: number;
};

type SeedDrop = {
  id: string;
  authorHandle: string;
  body: string;
  createdAt: Date;
  likes: number;
  replies: number;
  reposts: number;
  tags: string[];
  embeddedCode?: { lang: string; code: string };
  parentId?: string;
};

const now = Date.now();
const minute = 60_000;
const hour = 60 * minute;
const day = 24 * hour;

const USERS: SeedUser[] = [
  {
    avatarColor: 'from-pink-500 to-rose-600',
    bio: 'DX Engineer. Building with Next.js and React.',
    displayName: 'Aurora',
    followers: 4_911,
    following: 2,
    handle: 'aurora',
    id: 'u1',
  },
  {
    avatarColor: 'from-cyan-400 to-blue-600',
    bio: 'Backend, infra, the occasional bug hunt. Berlin.',
    displayName: 'Vex',
    followers: 8_300,
    following: 451,
    handle: 'vex',
    id: 'u2',
  },
  {
    avatarColor: 'from-violet-500 to-blue-500',
    bio: 'Design engineer. Building components and patterns.',
    displayName: 'Quill',
    followers: 4_120,
    following: 198,
    handle: 'quill',
    id: 'u3',
  },
  {
    avatarColor: 'from-sky-400 to-blue-700',
    bio: 'Staff engineer on performance. Loves a good flame graph.',
    displayName: 'Onyx',
    followers: 6_840,
    following: 540,
    handle: 'onyx',
    id: 'u4',
  },
  {
    avatarColor: 'from-blue-400 to-blue-700',
    bio: "Frontend lead. Reading source code so you don't have to.",
    displayName: 'Wren',
    followers: 2_900,
    following: 188,
    handle: 'wren',
    id: 'u5',
  },
  {
    avatarColor: 'from-teal-400 to-blue-600',
    bio: 'DX and dev tools at a small shop. Coffee enthusiast.',
    displayName: 'Cinder',
    followers: 5_330,
    following: 245,
    handle: 'cinder',
    id: 'u6',
  },
  {
    avatarColor: 'from-sky-500 to-blue-600',
    bio: 'Full-stack. Building things on the side, mostly tools.',
    displayName: 'Halo',
    followers: 1_870,
    following: 612,
    handle: 'halo',
    id: 'u7',
  },
  {
    avatarColor: 'from-indigo-400 to-blue-500',
    bio: 'CTO at a startup. Hiring is hard. Shipping is harder.',
    displayName: 'Echo',
    followers: 2_140,
    following: 410,
    handle: 'echo',
    id: 'u8',
  },
];

const DROPS: SeedDrop[] = [
  {
    authorHandle: 'aurora',
    body: "Added formatting to the Drop composer. You can write **bold**, *italic*, and code blocks now, and there's a Preview toggle so you can check a drop before posting. The preview renders on the server with the same component the feed uses, so it matches exactly. Try it and tell me what breaks.",
    createdAt: new Date(now - 8 * minute),
    id: 'd1',
    likes: 940,
    replies: 32,
    reposts: 140,
    tags: ['shipping'],
  },
  {
    authorHandle: 'vex',
    body: "Open-sourced the internal dashboard kit we've been using at work. Six components, no dependencies you don't already have. The docs are rough but it's all there. *Use it, break it, and tell me what's missing.*",
    createdAt: new Date(now - 18 * minute),
    id: 'd2',
    likes: 1_240,
    replies: 88,
    reposts: 60,
    tags: ['opensource'],
  },
  {
    authorHandle: 'wren',
    body: "A weekend thing I never meant to share: a focus timer that plays one song from my library when a block ends. It's lived on my desktop for months. Link in bio if you want it.",
    createdAt: new Date(now - 45 * minute),
    id: 'd3',
    likes: 1_640,
    replies: 64,
    reposts: 180,
    tags: ['sideproject'],
  },
  {
    authorHandle: 'quill',
    body: "Shipped the portfolio redesign I'd been avoiding for three years. Less hero copy, more screenshots of the actual work. Turns out that's all anyone wanted to see.",
    createdAt: new Date(now - 1 * hour),
    id: 'd4',
    likes: 540,
    replies: 22,
    reposts: 41,
    tags: ['design'],
  },
  {
    authorHandle: 'aurora',
    body: "Drop is the little social app I've been building to learn the Next.js 16 preview. Cache components, server actions, streaming, and view transitions, all in one place. The data is seeded, but every interaction is real. Poke around and tell me what feels off.",
    createdAt: new Date(now - 2 * hour),
    id: 'd5',
    likes: 1_980,
    replies: 110,
    reposts: 320,
    tags: ['shipping', 'nextjs'],
  },
  {
    authorHandle: 'onyx',
    body: 'Shipped a Slack bot that posts our oldest open PR every Monday morning. No reminders and no escalation, just the number staring back at us. It usually gets reviewed by lunch.',
    createdAt: new Date(now - 3 * hour),
    id: 'd6',
    likes: 2_140,
    replies: 142,
    reposts: 410,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurora',
    body: "Spent the day on how navigation feels. High-value links in Drop resolve their data at prefetch time, so opening a drop or a profile is instant:\n\n```tsx\n<Link href={href} prefetch={true} />\n```\n\nBy the time you click, the next screen is already warm.",
    createdAt: new Date(now - 4 * hour),
    id: 'd7',
    likes: 1_540,
    replies: 64,
    reposts: 220,
    tags: ['nextjs'],
  },
  {
    authorHandle: 'wren',
    body: 'Pushed v1.0 of the design tokens library we use internally. 200 stars overnight, which I did not expect on a Tuesday. Thanks to whoever shared it.',
    createdAt: new Date(now - 5 * hour),
    id: 'd8',
    likes: 720,
    replies: 30,
    reposts: 32,
    tags: ['opensource'],
  },
  {
    authorHandle: 'echo',
    body: "Small ship today: an RSS feed for my own blog, because I kept forgetting which drafts I promised people. Now I subscribe to myself. Works better than any todo app I've tried.",
    createdAt: new Date(now - 7 * hour),
    id: 'd9',
    likes: 1_180,
    replies: 41,
    reposts: 92,
    tags: ['shipping'],
  },
  {
    authorHandle: 'cinder',
    body: "Released a CLI that scaffolds the project structure I've argued for in every PR review for three years. If you've reviewed my code, then yes, this is that structure, now in one command.",
    createdAt: new Date(now - 9 * hour),
    id: 'd10',
    likes: 612,
    replies: 28,
    reposts: 48,
    tags: ['opensource'],
  },
  {
    authorHandle: 'aurora',
    body: 'The activity tab is live in Drop. Likes, reposts, replies, and follows all land there, with an unread badge that clears when you open it. The count is a per-user cached read, so it updates the moment you act without refetching the page.',
    createdAt: new Date(now - 11 * hour),
    id: 'd11',
    likes: 1_810,
    replies: 96,
    reposts: 340,
    tags: ['shipping'],
  },
  {
    authorHandle: 'halo',
    body: 'Shipped a side-by-side comparison view this week. Two engineers asked for it independently within a few days, which is the only product signal I fully trust.',
    createdAt: new Date(now - 13 * hour),
    id: 'd12',
    likes: 880,
    replies: 22,
    reposts: 64,
    tags: ['shipping'],
  },
  {
    authorHandle: 'halo',
    body: 'Open-sourced the **project starter** I reach for on every new app. Sensible defaults, a folder layout I trust, and a checklist of the things I always forget to set up. *Fork it and make it yours.*',
    createdAt: new Date(now - 16 * hour),
    id: 'd13',
    likes: 1_320,
    replies: 47,
    reposts: 180,
    tags: ['opensource'],
  },
  {
    authorHandle: 'echo',
    body: 'We launched. Eighteen months on an interview pipeline tool that nobody enjoyed building, and the recruiters love it. Sometimes the boring internal tool is the win.',
    createdAt: new Date(now - 19 * hour),
    id: 'd14',
    likes: 1_020,
    replies: 88,
    reposts: 96,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurora',
    body: 'Added view transitions across Drop. The feed tabs slide their underline, opening a drop crossfades, and lists reveal instead of jumping in. Most of it is a single `<ViewTransition>` wrapper plus a little CSS.',
    createdAt: new Date(now - 22 * hour),
    id: 'd15',
    likes: 2_410,
    replies: 142,
    reposts: 540,
    tags: ['shipping'],
  },
  {
    authorHandle: 'quill',
    body: "Six months of building this in public and it finally clicked today. The thing I've been quietly iterating on is live. If you've been following along, thank you. This one is for everyone who replied to the ugly early versions.",
    createdAt: new Date(now - 1 * day - 6 * hour),
    id: 'd16',
    likes: 3_810,
    replies: 320,
    reposts: 1_120,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurora',
    body: 'Two weeks of building Drop in public. The parts I expected to be hard, caching and streaming, mostly fell out of the framework. The parts I underestimated, loading states and focus and mobile, took the most time. I would do it again.',
    createdAt: new Date(now - 2 * day),
    id: 'd17',
    likes: 1_120,
    replies: 47,
    reposts: 180,
    tags: ['shipping'],
  },
  {
    authorHandle: 'wren',
    body: "Vibe-coded a little tool this weekend that compares my listening history with my partner's. Shipped it for exactly the two of us. Tiny audience, big grin.",
    createdAt: new Date(now - 36 * minute),
    id: 'd18',
    likes: 612,
    replies: 0,
    reposts: 14,
    tags: ['shipping'],
  },
  {
    authorHandle: 'cinder',
    body: 'Released a 90-line app that turns my voice memos into todo items. It will never get a landing page. I use it every single morning.',
    createdAt: new Date(now - 90 * minute),
    id: 'd19',
    likes: 480,
    replies: 0,
    reposts: 18,
    tags: ['shipping'],
  },
  {
    authorHandle: 'onyx',
    body: 'Shipping small feels more honest the smaller it gets. The app I am proudest of this year is 240 lines and three people use it.',
    createdAt: new Date(now - 2 * hour - 20 * minute),
    id: 'd20',
    likes: 2_140,
    replies: 0,
    reposts: 410,
    tags: ['shipping'],
  },
  {
    authorHandle: 'halo',
    body: 'Drafting in public for the first time. The changelog generator I have been threatening to build for two summers is finally a real URL. v0.1, but it is a URL.',
    createdAt: new Date(now - 3 * hour - 30 * minute),
    id: 'd21',
    likes: 360,
    replies: 0,
    reposts: 22,
    tags: ['shipping'],
  },
  {
    authorHandle: 'vex',
    body: 'Built a thing this afternoon that emails me one sentence every Sunday: what did you make this week? It is the only newsletter where I am both the writer and the only reader.',
    createdAt: new Date(now - 5 * hour),
    id: 'd22',
    likes: 720,
    replies: 0,
    reposts: 28,
    tags: ['shipping'],
  },
  {
    authorHandle: 'echo',
    body: 'Vibe-coded a tiny CRM for the dog walker in my building. An evening of work, costs nothing to run, and it replaced a spreadsheet that was making her miserable. Software does not need a roadmap to help one real person.',
    createdAt: new Date(now - 7 * hour),
    id: 'd23',
    likes: 880,
    replies: 0,
    reposts: 42,
    tags: ['shipping'],
  },
  {
    authorHandle: 'quill',
    body: "Made a one-pager that explains my partner's job to my mom. It is the most-read thing I will publish this year, and the audience is small on purpose.",
    createdAt: new Date(now - 10 * hour),
    id: 'd24',
    likes: 540,
    replies: 0,
    reposts: 16,
    tags: ['shipping'],
  },
  {
    authorHandle: 'onyx',
    body: 'Published the Sunday reading list I have kept in Notes for a year. The point is that it does not grow on a schedule. I add a link when I find one worth trusting.',
    createdAt: new Date(now - 14 * hour),
    id: 'd25',
    likes: 410,
    replies: 0,
    reposts: 12,
    tags: ['shipping'],
  },
  {
    authorHandle: 'aurora',
    body: 'Reposts work in Drop now, including reposting your own drops. A repost shows up in the feed as its own entry, with a reposted label and its own timestamp. There is no dedupe. The timeline just shows what actually happened.',
    createdAt: new Date(now - 28 * hour),
    id: 'd26',
    likes: 1_640,
    replies: 0,
    reposts: 240,
    tags: ['shipping'],
  },
  {
    authorHandle: 'vex',
    body: 'Published `@vex/use-presence`, a tiny hook for the WebSocket presence pattern I keep rewriting on every project. One hook, and no provider or context to wire up.',
    createdAt: new Date(now - 12 * minute),
    embeddedCode: {
      code: "const peers = usePresence('room-id')\nreturn <ul>{peers.map(p => <li key={p.id}>{p.name}</li>)}</ul>",
      lang: 'tsx',
    },
    id: 'd27',
    likes: 840,
    replies: 0,
    reposts: 64,
    tags: ['opensource'],
  },
  {
    authorHandle: 'vex',
    body: 'Releasing `create-next-kit`, the CLI I built for spinning up Next.js 16 apps with caching, server actions, and a folder structure already wired. One command to a deployable app.',
    createdAt: new Date(now - 25 * minute),
    embeddedCode: {
      code: 'npx create-next-kit my-app\ncd my-app\npnpm dev',
      lang: 'bash',
    },
    id: 'd28',
    likes: 1_240,
    replies: 0,
    reposts: 180,
    tags: ['opensource'],
  },
  {
    authorHandle: 'quill',
    body: 'Open-sourced `tokens-doctor`, a CLI that finds unused design tokens in your codebase. Cleaned up 40% of ours on the first run.',
    createdAt: new Date(now - 6 * hour),
    embeddedCode: {
      code: 'npx tokens-doctor scan ./src\nnpx tokens-doctor prune --interactive',
      lang: 'bash',
    },
    id: 'd29',
    likes: 720,
    replies: 0,
    reposts: 48,
    tags: ['opensource', 'design'],
  },
  {
    authorHandle: 'cinder',
    body: 'v2 of `react-cmd` is out. Same command palette, half the bundle, full keyboard support. It drops into any app and works without a provider.',
    createdAt: new Date(now - 1 * hour - 30 * minute),
    embeddedCode: {
      code: "<Cmd>\n  <Cmd.Input placeholder='Search…' />\n  <Cmd.List items={results} />\n</Cmd>",
      lang: 'tsx',
    },
    id: 'd30',
    likes: 1_410,
    replies: 0,
    reposts: 220,
    tags: ['opensource'],
  },
  {
    authorHandle: 'aurora',
    body: "The following feed in Drop is cached per user and invalidated on write. It comes down to one `'use cache'` function with a tag:",
    createdAt: new Date(now - 12 * hour),
    embeddedCode: {
      code: "async function getFeed(handle) {\n  'use cache'\n  cacheTag(`feed-${handle}`)\n  return db.drops.forFollowing(handle)\n}",
      lang: 'ts',
    },
    id: 'd31',
    likes: 2_140,
    replies: 0,
    reposts: 410,
    tags: ['opensource', 'nextjs'],
  },
  {
    authorHandle: 'onyx',
    body: "Built a tiny CLI for our team that scaffolds a new server action with its cache tags already wired. It saves everyone the 'wait, which tag do I invalidate' moment.",
    createdAt: new Date(now - 16 * hour),
    embeddedCode: {
      code: 'npx @onyx/action new toggleBookmark --tag bookmarks',
      lang: 'bash',
    },
    id: 'd32',
    likes: 540,
    replies: 0,
    reposts: 38,
    tags: ['opensource'],
  },
];

const REPLIES: SeedDrop[] = [
  {
    authorHandle: 'onyx',
    body: 'Spent five minutes in the new composer. The preview matching the feed exactly is the detail that sells it. Posting this from it.',
    createdAt: new Date(now - 12 * minute),
    id: 'r1',
    likes: 142,
    parentId: 'd1',
    replies: 4,
    reposts: 9,
    tags: [],
  },
  {
    authorHandle: 'cinder',
    body: 'The server-rendered preview is the part I would have skipped and then regretted. Nicely done.',
    createdAt: new Date(now - 8 * minute),
    id: 'r2',
    likes: 88,
    parentId: 'd1',
    replies: 1,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'cinder',
    body: 'Bold and code blocks in a social composer, finally. I have wanted this for a while.',
    createdAt: new Date(now - 4 * minute),
    id: 'r3',
    likes: 64,
    parentId: 'd1',
    replies: 0,
    reposts: 2,
    tags: [],
  },
  {
    authorHandle: 'quill',
    body: 'Forking this tonight. We have been about to build this kit internally for six months.',
    createdAt: new Date(now - 90 * minute),
    id: 'r4',
    likes: 220,
    parentId: 'd2',
    replies: 0,
    reposts: 18,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: 'Thank you for putting a license on it. You would be surprised how often that gets forgotten.',
    createdAt: new Date(now - 80 * minute),
    id: 'r5',
    likes: 96,
    parentId: 'd2',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  {
    authorHandle: 'halo',
    body: 'A 200-star Tuesday is the dream. Congrats, the docs feel genuinely cared for.',
    createdAt: new Date(now - 4 * hour),
    id: 'r6',
    likes: 312,
    parentId: 'd8',
    replies: 0,
    reposts: 22,
    tags: [],
  },
  {
    authorHandle: 'vex',
    body: 'The optimistic badge clear is a nice touch. Ours still makes people refresh to see it.',
    createdAt: new Date(now - 10 * hour),
    id: 'r7',
    likes: 140,
    parentId: 'd11',
    replies: 0,
    reposts: 12,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: 'Been here since the first ugly screenshot. Worth the wait.',
    createdAt: new Date(now - 1 * day),
    id: 'r8',
    likes: 88,
    parentId: 'd16',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'Love this. Public building is the only deadline that actually works on me.',
    createdAt: new Date(now - 22 * hour),
    id: 'r9',
    likes: 140,
    parentId: 'd16',
    replies: 0,
    reposts: 12,
    tags: [],
  },
  {
    authorHandle: 'wren',
    body: 'Subscribed. Subscribing to your own output is a real pattern, not a joke.',
    createdAt: new Date(now - 6 * hour),
    id: 'r10',
    likes: 64,
    parentId: 'd9',
    replies: 0,
    reposts: 2,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'Subscribing to your own writing is underrated. I do the same with my changelog.',
    createdAt: new Date(now - 5 * hour),
    id: 'r11',
    likes: 188,
    parentId: 'd9',
    replies: 0,
    reposts: 14,
    tags: [],
  },
  {
    authorHandle: 'cinder',
    body: 'Less hero copy, more screenshots. This is the brief I want to send every team.',
    createdAt: new Date(now - 2 * hour),
    id: 'r12',
    likes: 96,
    parentId: 'd4',
    replies: 0,
    reposts: 3,
    tags: ['design'],
  },
  {
    authorHandle: 'wren',
    body: 'Saved. The three-years-overdue part is every portfolio I have ever had.',
    createdAt: new Date(now - 100 * minute),
    id: 'r13',
    likes: 220,
    parentId: 'd4',
    replies: 0,
    reposts: 18,
    tags: ['design'],
  },
  {
    authorHandle: 'halo',
    body: 'Prefetching this aggressively is the kind of thing you only notice when it is missing.',
    createdAt: new Date(now - 9 * hour),
    id: 'r14',
    likes: 132,
    parentId: 'd7',
    replies: 0,
    reposts: 7,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'Follow-up: the drop detail resolves at prefetch time, and the profile links only prefetch on hover so we do not prefetch the whole feed at once.',
    createdAt: new Date(now - 8 * hour),
    id: 'r15',
    likes: 264,
    parentId: 'd7',
    replies: 0,
    reposts: 21,
    tags: [],
  },
  {
    authorHandle: 'vex',
    body: 'Two independent asks is the signal. The third is usually someone yelling.',
    createdAt: new Date(now - 14 * hour),
    id: 'r16',
    likes: 312,
    parentId: 'd12',
    replies: 0,
    reposts: 22,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'The two-engineers-ask-independently rule is the closest thing to a real signal in product work. Most of Drop started exactly that way.',
    createdAt: new Date(now - 13 * hour),
    id: 'r17',
    likes: 410,
    parentId: 'd12',
    replies: 0,
    reposts: 36,
    tags: [],
  },
  {
    authorHandle: 'onyx',
    body: 'Cloning Drop this weekend to have something to point my team at. The ship-small habit is what I want us to build.',
    createdAt: new Date(now - 18 * hour),
    id: 'r18',
    likes: 280,
    parentId: 'd5',
    replies: 0,
    reposts: 24,
    tags: ['shipping'],
  },
  {
    authorHandle: 'echo',
    body: 'If you keep building this in public, I will keep stealing the patterns. The streaming parts especially.',
    createdAt: new Date(now - 17 * hour),
    id: 'r19',
    likes: 188,
    parentId: 'd5',
    replies: 0,
    reposts: 14,
    tags: ['shipping'],
  },
  {
    authorHandle: 'quill',
    body: 'The PR bot is genius and a little bit shameful. We need it. Stealing.',
    createdAt: new Date(now - 26 * hour),
    id: 'r20',
    likes: 220,
    parentId: 'd6',
    replies: 0,
    reposts: 18,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'Stealing this for our repo. The oldest-open-PR nudge is such a good idea.',
    createdAt: new Date(now - 25 * hour),
    id: 'r21',
    likes: 196,
    parentId: 'd6',
    replies: 0,
    reposts: 12,
    tags: [],
  },
  {
    authorHandle: 'echo',
    body: 'Been waiting for the CLI version of your file-structure rant. This is going in my dotfiles.',
    createdAt: new Date(now - 30 * hour),
    id: 'r22',
    likes: 88,
    parentId: 'd10',
    replies: 0,
    reposts: 5,
    tags: [],
  },
  {
    authorHandle: 'halo',
    body: 'Should have been a CLI four years ago. The structure it scaffolds is the one we have all been converging on anyway.',
    createdAt: new Date(now - 29 * hour),
    id: 'r23',
    likes: 142,
    parentId: 'd10',
    replies: 0,
    reposts: 9,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'One thing I like here: the badge clears the moment you open the tab, then confirms on the server.',
    createdAt: new Date(now - 40 * minute),
    id: 'r24',
    likes: 96,
    parentId: 'd11',
    replies: 0,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'If the count ever looks stale, that is the private cache waiting on a revalidate. Working on making it instant.',
    createdAt: new Date(now - 30 * minute),
    id: 'r25',
    likes: 132,
    parentId: 'd11',
    replies: 0,
    reposts: 5,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'The two-user app is undefeated. Mine was a chore rotation for me and my partner.',
    createdAt: new Date(now - 28 * minute),
    id: 'r26',
    likes: 220,
    parentId: 'd18',
    replies: 0,
    reposts: 18,
    tags: ['shipping'],
  },
  {
    authorHandle: 'cinder',
    body: 'Shipping selfishly is underrated. The bar moves from will they love it to do I.',
    createdAt: new Date(now - 1 * hour),
    id: 'r27',
    likes: 142,
    parentId: 'd20',
    replies: 0,
    reposts: 9,
    tags: [],
  },
  {
    authorHandle: 'vex',
    body: 'Three users who actually use the thing beats a launch nobody remembers.',
    createdAt: new Date(now - 90 * minute),
    id: 'r28',
    likes: 96,
    parentId: 'd20',
    replies: 0,
    reposts: 4,
    tags: [],
  },
  {
    authorHandle: 'quill',
    body: 'The friction of shipping a real URL is the whole exercise. Once it is at a URL, it counts.',
    createdAt: new Date(now - 2 * hour),
    id: 'r29',
    likes: 188,
    parentId: 'd21',
    replies: 0,
    reposts: 12,
    tags: ['shipping'],
  },
  {
    authorHandle: 'wren',
    body: 'I would subscribe to a newsletter whose only rule is one sentence about what you made.',
    createdAt: new Date(now - 4 * hour),
    id: 'r30',
    likes: 88,
    parentId: 'd22',
    replies: 0,
    reposts: 3,
    tags: [],
  },
  {
    authorHandle: 'aurora',
    body: 'Replacing a spreadsheet for one real person is some of the most satisfying software there is.',
    createdAt: new Date(now - 6 * hour),
    id: 'r31',
    likes: 240,
    parentId: 'd23',
    replies: 0,
    reposts: 16,
    tags: ['shipping'],
  },
  {
    authorHandle: 'halo',
    body: 'Audience-of-one docs are a genre. Mine is a page explaining my job to my dad.',
    createdAt: new Date(now - 9 * hour),
    id: 'r32',
    likes: 132,
    parentId: 'd24',
    replies: 0,
    reposts: 6,
    tags: ['shipping'],
  },
  {
    authorHandle: 'onyx',
    body: 'Slow-grow lists are the best lists. Weekly-publish pressure is what kills good reading.',
    createdAt: new Date(now - 13 * hour),
    id: 'r33',
    likes: 156,
    parentId: 'd25',
    replies: 0,
    reposts: 8,
    tags: [],
  },
];

const FOLLOWS: Record<string, string[]> = {
  aurora: ['vex', 'quill'],
  cinder: ['halo', 'echo'],
  echo: ['onyx', 'wren'],
  halo: ['cinder', 'echo'],
  onyx: ['wren', 'halo'],
  quill: ['cinder', 'onyx'],
  vex: ['aurora', 'quill'],
  wren: ['echo', 'vex'],
};

const LIKES: Record<string, string[]> = {
  aurora: ['d2', 'd4', 'd8', 'd10'],
};

const REPOSTS: Record<string, string[]> = {
  aurora: ['d6', 'd8'],
};

const BOOKMARKS: Record<string, string[]> = {
  aurora: ['d2', 'd12'],
};

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
  const adapter = new PrismaPg({ connectionString: normalizeDatabaseUrl(process.env.DATABASE_URL) });
  const prisma = new PrismaClient({ adapter });

  console.log('Clearing existing data...');
  await prisma.notification.deleteMany();
  await prisma.like.deleteMany();
  await prisma.repost.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.drop.deleteMany();
  await prisma.user.deleteMany();

  console.log('Inserting users...');
  for (const u of USERS) {
    await prisma.user.create({ data: u });
  }

  console.log('Inserting drops...');
  for (const d of [...DROPS, ...REPLIES]) {
    const hashtags = d.tags.map(t => `#${t}`).join(' ');
    await prisma.drop.create({
      data: {
        authorHandle: d.authorHandle,
        body: hashtags ? `${d.body} ${hashtags}` : d.body,
        createdAt: d.createdAt,
        embeddedCode: d.embeddedCode?.code,
        embeddedLang: d.embeddedCode?.lang,
        id: d.id,
        likeCount: d.likes,
        parentId: d.parentId,
        replyCount: d.replies,
        repostCount: d.reposts,
        tags: d.tags.join(','),
      },
    });
  }

  console.log('Reconciling reply counts...');
  const parents = await prisma.drop.groupBy({
    _count: { _all: true },
    by: ['parentId'],
    where: { parentId: { not: null } },
  });
  await prisma.drop.updateMany({ data: { replyCount: 0 }, where: { parentId: null } });
  for (const p of parents) {
    if (!p.parentId) continue;
    await prisma.drop.update({ data: { replyCount: p._count._all }, where: { id: p.parentId } });
  }

  console.log('Inserting follows...');
  for (const [follower, targets] of Object.entries(FOLLOWS)) {
    for (const target of targets) {
      await prisma.follow.create({ data: { followerHandle: follower, targetHandle: target } });
    }
  }

  console.log('Inserting likes...');
  for (const [user, drops] of Object.entries(LIKES)) {
    for (const dropId of drops) {
      await prisma.like.create({ data: { dropId, userHandle: user } });
    }
  }

  console.log('Inserting reposts...');
  for (const [user, drops] of Object.entries(REPOSTS)) {
    for (const dropId of drops) {
      await prisma.repost.create({ data: { dropId, userHandle: user } });
    }
  }

  console.log('Inserting bookmarks...');
  for (const [user, drops] of Object.entries(BOOKMARKS)) {
    for (const dropId of drops) {
      await prisma.bookmark.create({ data: { dropId, userHandle: user } });
    }
  }

  console.log('Backfilling notifications from existing activity...');
  const dropsForNotifs = await prisma.drop.findMany({
    select: { authorHandle: true, body: true, id: true, parentId: true },
  });
  const dropById = new Map(dropsForNotifs.map(d => [d.id, d]));

  // Likes
  const allLikes = await prisma.like.findMany();
  for (const like of allLikes) {
    const drop = dropById.get(like.dropId);
    if (!drop || drop.authorHandle === like.userHandle) continue;
    await prisma.notification.create({
      data: {
        actorHandle: like.userHandle,
        createdAt: like.createdAt,
        dropId: like.dropId,
        kind: 'like',
        readAt: like.createdAt,
        recipientHandle: drop.authorHandle,
      },
    });
  }
  // Reposts
  const allReposts = await prisma.repost.findMany();
  for (const repost of allReposts) {
    const drop = dropById.get(repost.dropId);
    if (!drop || drop.authorHandle === repost.userHandle) continue;
    await prisma.notification.create({
      data: {
        actorHandle: repost.userHandle,
        createdAt: repost.createdAt,
        dropId: repost.dropId,
        kind: 'repost',
        readAt: repost.createdAt,
        recipientHandle: drop.authorHandle,
      },
    });
  }
  // Follows
  const allFollows = await prisma.follow.findMany();
  for (const follow of allFollows) {
    await prisma.notification.create({
      data: {
        actorHandle: follow.followerHandle,
        createdAt: follow.createdAt,
        kind: 'follow',
        readAt: follow.createdAt,
        recipientHandle: follow.targetHandle,
      },
    });
  }
  // Replies
  for (const reply of dropsForNotifs) {
    if (!reply.parentId) continue;
    const parent = dropById.get(reply.parentId);
    if (!parent || parent.authorHandle === reply.authorHandle) continue;
    await prisma.notification.create({
      data: {
        actorHandle: reply.authorHandle,
        body: reply.body,
        dropId: reply.parentId,
        kind: 'reply',
        readAt: new Date(),
        recipientHandle: parent.authorHandle,
      },
    });
  }

  console.log(`Seeded ${USERS.length} users, ${DROPS.length + REPLIES.length} drops`);
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
