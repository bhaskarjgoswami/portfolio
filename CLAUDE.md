# Portfolio site

Static HTML/CSS/JS portfolio (no build step) for Bhaskar Jyoti Goswami.
Live at https://bhaskarjgoswami.pages.dev via Cloudflare Pages.

## Deploying

Cloudflare Pages is **direct upload**, NOT connected to GitHub - pushing to GitHub does not update the live site.

```
./deploy.sh
```

That script pulls the OAuth token from wrangler's saved login, checks for files over Cloudflare's 25MB limit, and runs `wrangler pages deploy`. If it fails with an auth error, the wrangler OAuth token expired - the user must run `npx wrangler login` interactively (in Claude Code, suggest typing `! npx wrangler login`).

Keep large files (models, backups) out of this folder - Pages rejects anything over 25 MiB. A 60MB `model.glb.bak` lives at `/Volumes/My_drive/model.glb.bak` for this reason.

## GitHub

Repo: https://github.com/bhaskarjgoswami/portfolio (personal account). The machine's default gh account is the work account `Bhaskar-vc`, which cannot push here. To push:

```
gh auth switch --user bhaskarjgoswami
git push origin main
gh auth switch --user Bhaskar-vc
```

Do not assign to a variable named `status` in zsh (read-only builtin).

Routine after any change: deploy with ./deploy.sh (live site), then commit + push (versioning).

## Calendly

Booking URL: https://calendly.com/bhaskarjgoswami. Any element with a `data-calendly` attribute opens the popup (handled by `js/calendly.js`, which lazy-loads Calendly's widget on first click; the href is the fallback for no-JS). Three entry points on index.html: hero "Let's talk" CTA, footer "Let's talk" pill button, "Book a call" link in the footer Elsewhere column.

## Conventions

- `js/main.js` is cache-busted with a `?v=N` query - bump it when editing that file.
- Scroll-reveal elements use `.reveal` classes; new footer/hero elements should follow the existing pattern.
- No em dashes in copy; plain hyphens only.
