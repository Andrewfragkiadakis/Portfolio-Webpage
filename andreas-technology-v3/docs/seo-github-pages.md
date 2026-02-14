# De‑emphasizing Old GitHub Pages (andrewfragkiadakis.github.io) in Search

Your current portfolio lives at **https://andreas.technology**. Search engines (Google, DuckDuckGo, Bing) may still show your old GitHub Pages URL **https://andrewfragkiadakis.github.io** for queries like "Andreas Fragkiadakis". You cannot remove that URL from search results by changing only andreas.technology; you must act on the old site and use search-engine tools.

## 1. On the old GitHub Pages repo (andrewfragkiadakis.github.io)

Do this in the **repository that serves** `https://andrewfragkiadakis.github.io` (e.g. `Andrewfragkiadakis/andrewfragkiadakis.github.io` or a repo with GitHub Pages enabled for that username).

### Option A: Redirect the old site to andreas.technology (recommended)

- **Jekyll (default for GitHub Pages):** In the repo root add or edit `_config.yml` and create a single-page redirect:
  - Use the [jekyll-redirect-from](https://github.com/jekyll/jekyll-redirect-from) plugin: add `redirect_from` to the main layout or index so that the homepage redirects to `https://andreas.technology`.
  - Or replace the content with a single `index.html` that performs a **301 redirect** via `<meta http-equiv="refresh" content="0;url=https://andreas.technology">` and, if possible, a server-side 301 (e.g. via a `_redirects` file if using something like Netlify; GitHub Pages does not support custom 301, so meta refresh is the fallback).
- **Plain HTML:** Replace the site with one `index.html` that contains:
  - `<meta name="robots" content="noindex, nofollow">` so the old URL is not re-indexed.
  - A canonical: `<link rel="canonical" href="https://andreas.technology">`.
  - A redirect: `<meta http-equiv="refresh" content="0;url=https://andreas.technology">` and a visible link "Go to andreas.technology" for accessibility.

After deployment, the old URL will send users to andreas.technology and tell crawlers the canonical site is andreas.technology.

### Option B: Only ask crawlers not to index (no redirect)

If you prefer to keep the old page online but not in search results:

- Add to the `<head>` of the old site: `<meta name="robots" content="noindex, nofollow">`.
- Add: `<link rel="canonical" href="https://andreas.technology">`.

Crawlers that respect these may stop indexing the old URL over time; users will still see the old content unless you add a redirect.

## 2. Request removal from search engines

### Google

1. Add and verify **https://andreas.technology** in [Google Search Console](https://search.google.com/search-console).
2. Use **Removals** (in the left menu): "New request" → "Remove a URL".
   - If the old URL **now redirects or shows a different page**, use "Remove outdated content" and submit `https://andrewfragkiadakis.github.io`. Google will re-crawl and can drop it from results.
   - Temporary removal lasts ~6 months; permanent removal happens when the URL returns 404 or a 301 to andreas.technology.
3. Submit your sitemap for andreas.technology: **Sitemaps** → add `https://andreas.technology/sitemap.xml`.

### DuckDuckGo

DuckDuckGo uses multiple sources (including Bing). You cannot submit URLs directly to DuckDuckGo. Do the following so that when DuckDuckGo refreshes its index, the old URL is less likely to appear:

- Apply **Option A** on the old GitHub Pages site (301/meta redirect + noindex + canonical). Over time, DuckDuckGo may replace the old result with andreas.technology.
- Use **Bing Webmaster Tools** (below); improving Bing’s index often helps DuckDuckGo.

### Bing

1. Add and verify **https://andreas.technology** in [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. **URL Removal**: Submit `https://andrewfragkiadakis.github.io` for removal (after the old site redirects or has noindex).
3. Submit sitemap: `https://andreas.technology/sitemap.xml`.

## 3. Strengthening andreas.technology in search (already done in this repo)

- **Canonical URL**: Set to `https://andreas.technology` so search engines treat it as the main version.
- **Structured data**: WebSite + Person JSON-LD with `mainEntityOfPage` and `sameAs` including andreas.technology.
- **Open Graph**: Full URL, title, description, and image so shares show the right branding.
- **Sitemap**: `https://andreas.technology/sitemap.xml` referenced in `robots.txt`.
- **robots.txt**: Allows indexing and points to the sitemap.

To improve ranking over time:

- Add andreas.technology to **Google Search Console** and **Bing Webmaster Tools** and fix any coverage or mobile issues.
- Get links from your LinkedIn, GitHub profile, and any other profiles pointing to **https://andreas.technology** (not the old GitHub Pages URL).
- Keep content and metadata aligned with "Andreas Fragkiadakis", "IT & Security Engineer", "SecOps", "M.Eng.", etc.

## Summary

| Goal | Action |
|------|--------|
| Stop old URL from being the top result | Redirect old GitHub Pages to andreas.technology + noindex + canonical on old site. |
| Remove old URL from Google | Redirect or noindex on old site, then use Google Search Console → Removals. |
| Help DuckDuckGo show andreas.technology | Same redirect/noindex + canonical; use Bing Webmaster Tools (DuckDuckGo uses Bing). |
| Improve andreas.technology ranking | GSC + Bing, sitemap, canonical, structured data, and backlinks to andreas.technology. |

Results can take days to several weeks depending on crawl frequency and search engine.
