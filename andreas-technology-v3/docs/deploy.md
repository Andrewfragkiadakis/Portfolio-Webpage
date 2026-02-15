# Vercel deployment

This app uses **dynamic OG image generation** (`app/opengraph-image.tsx`) and therefore runs as a **Node server** on Vercel (no static export). Use the default **Framework Preset: Next.js**; no extra config needed.

---

## Root Directory error

If you see:

```text
The specified Root Directory "andreas-technology-v3" does not exist.
```

**Cause:** The project is set to build from the **gh-pages** branch. On `gh-pages` the repo only contains the built static output (e.g. `index.html`) at root; the Next.js app lives in `andreas-technology-v3/` only on **main**.

**Fix:** In Vercel → Project → **Settings** → **General**:

1. **Production Branch:** set to **main** (not `gh-pages`).
2. **Root Directory:** leave as **andreas-technology-v3** (or set it if empty).

Save. Redeploy from the **Deployments** tab or push a new commit to `main`.

If you use GitHub Pages for hosting instead of Vercel, keep using `deploy.sh` / `quick-deploy.sh` from `main` to update the `gh-pages` branch; do not point Vercel at `gh-pages` when Root Directory is `andreas-technology-v3`.
