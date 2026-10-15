# isaacbot-web

The Isaacbot website: a one-page company site (`/`) and the Ardennes product page (`/ardennes`).
Next.js 15 (App Router), React 19, three.js for the hero animation.

| Path | What |
|---|---|
| `src/content.ts` | All home page copy and the site constants (company, slogan, contact e-mail). |
| `src/app/ardennes/content.ts` | All Ardennes page copy and specs. |
| `src/app/page.tsx`, `src/app/ardennes/page.tsx` | The two pages. |
| `src/components/` | Header, footer, buttons, scroll reveal, contact section. |
| `src/components/heroScene.ts` | The hero's 3D rover catching an apple (three.js), loaded on demand by `RoverArm3D.tsx`, which falls back to an SVG animation without WebGL. |
| `src/app/globals.css` | All styles. |
| `public/` | Rover renders, team photo, brand SVGs. |

## Develop

```bash
npm ci
npm run dev        # http://localhost:3000
npm run typecheck
```

## Deploy

The site runs on isaacbot-server-001, bound to the WireGuard address only (`10.8.0.1:80`, see
`docker-compose.yml`). The server's checkout is `~/isaacbot_web`; its `.env` (not tracked) sets
`HOST_PORT`, and optionally `HOST_BIND`.

```bash
ssh isaacbot-server-001@10.8.0.1
cd ~/isaacbot_web && git pull && docker compose up -d --build
```

## History

The original source was lost in October 2026. This repo was rebuilt from the compiled
`isaacbot-web:latest` image: same dependencies, same rendered HTML for every page, a byte-identical
stylesheet and the same hero animation timeline. Comments, file layout and identifiers are new.
