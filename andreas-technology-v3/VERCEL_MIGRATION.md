# Migrating from GitHub Pages to Vercel

## 1. Deploy the project to Vercel

**Option A: Deploy the whole repo (root = andreas-technology-v3)**

- Push this repo to GitHub (e.g. `Andrewfragkiadakis/Portfolio-Webpage`).
- Go to [vercel.com](https://vercel.com) → Add New Project → Import the repo.
- Set **Root Directory** to `andreas-technology-v3`.
- Leave Framework Preset as **Next.js**. Build command: `npm run build`. Output directory: (default).
- Deploy. Vercel will give you a `*.vercel.app` URL.

**Option B: Deploy only andreas-technology-v3 (separate repo)**

- Create a new repo with only the contents of `andreas-technology-v3` (or use a monorepo and set Root Directory as above).
- Import that repo in Vercel and deploy.

---

## 2. Use andreas.technology on Vercel

- In the Vercel project: **Settings → Domains** → Add `andreas.technology`.
- In your DNS (where andreas.technology is managed, e.g. Cloudflare):
  - Add or update **A** record for `@` → `76.76.21.21` (Vercel).
  - Add or update **CNAME** for `www` → `cname.vercel-dns.com` (or the value Vercel shows).
- Remove or stop using the **CNAME** file / GitHub Pages custom domain for andreas.technology so the domain points only to Vercel.
- Wait for DNS to propagate; Vercel will issue SSL automatically.

---

## 3. Redirect Andrewfragkiadakis.github.io → andreas.technology

GitHub Pages does not support real 301 redirects. Use a redirect page so that anyone opening the `.github.io` URL is sent to andreas.technology.

**Steps:**

1. Create a **new repo** (or use the existing one that currently serves Andrewfragkiadakis.github.io).
2. In that repo, **remove** the old built site and any `output` folder. Keep only a single-page redirect.
3. Add an **index.html** in the repo root (or in the branch used for GitHub Pages, often `main` or `gh-pages`) with the content below.
4. In GitHub: **Settings → Pages** → Source = that branch (and folder `/ (root)`).
5. Do **not** add a CNAME file in this repo (so the Pages URL stays `https://Andrewfragkiadakis.github.io`).
6. After deploy, visiting `https://Andrewfragkiadakis.github.io` will show the redirect page and send users to andreas.technology.

**index.html** (place in repo root used for Pages):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirect to andreas.technology</title>
  <link rel="canonical" href="https://andreas.technology/">
  <meta http-equiv="refresh" content="0; url=https://andreas.technology/">
  <script>window.location.replace("https://andreas.technology/");</script>
</head>
<body>
  <p>Redirecting to <a href="https://andreas.technology/">andreas.technology</a>.</p>
</body>
</html>
```

- **Meta refresh** and **script** do the redirect for almost all users.
- **Canonical** and the **&lt;a&gt;** help SEO and work when JavaScript is disabled.

---

## 4. Optional: Use full Next.js on Vercel (no static export)

Right now the project uses `output: 'export'` for GitHub Pages. On Vercel you can use normal Next.js (no static export):

- In `next.config.ts`, remove the `output: 'export'` line (and optionally set `images: { unoptimized: false }` or remove `unoptimized: true` to use the Image Optimization API).
- Redeploy on Vercel. You get default Next.js behavior (e.g. image optimization, future API routes, incremental static regeneration if you add it).

If you prefer to keep the same static build you had on GitHub Pages, leave `output: 'export'` as is; Vercel will still build and serve it.

---

## Checklist

- [ ] Deploy andreas-technology-v3 to Vercel (with Root Directory if using Portfolio-Webpage repo).
- [ ] Add domain andreas.technology in Vercel and point DNS (A + CNAME) to Vercel.
- [ ] Remove/update CNAME and GitHub Pages custom domain for andreas.technology so it only points to Vercel.
- [ ] Create redirect repo (or repurpose existing Pages repo) with index.html above; enable GitHub Pages on that repo so Andrewfragkiadakis.github.io serves only the redirect.
