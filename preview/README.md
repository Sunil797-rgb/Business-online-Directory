# Static preview build

Produces a fully static, hostable copy of Thok Bazar in demo mode, for sharing
a clickable preview before any real deployment exists.

```bash
node preview/build.mjs
```

Output lands in `preview-out/`.

## How it works

`build.mjs` copies `src/` into `.preview-build/src`, lays the files in
`preview/overlay/` on top, and runs `next build` with `output: "export"`.
**Nothing in `src/` is modified**, so the app you review is the app that ships.

## What the overlay changes, and why

Three things in the real app cannot exist in a static export:

| Real app | Preview overlay | Reason |
| --- | --- | --- |
| `/suppliers` and `/products` filter on the server from `searchParams` | Filter in the browser from `useSearchParams` | `output: "export"` cannot read `searchParams` server-side |
| Server Actions for the enquiry and listing forms | Client functions with the same signature | Server Actions require a running server |
| `proxy.ts`, `/auth/callback` | Removed | Middleware and route handlers need a server |

Both overlay pages call `selectSuppliers` / `selectProducts` from
`src/lib/filters.ts` — the same functions the server uses — and both overlay
form handlers validate with the same Zod schemas from `src/lib/validation.ts`.
So search, filtering, sorting and validation behave identically; only the
place they run differs.

## What is therefore NOT representative

- Nothing is persisted. Submitting a form validates and shows the success
  state, exactly as demo mode does on the server, but writes nowhere.
- Login and signup are inert (they are inert in demo mode too).
- The whole dataset ships to the browser. The real app queries per request.
