# SEO Optimization Checklist for andreas.technology

## ✅ Completed Items

### Technical SEO
- [x] Domain verified in Google Search Console
- [x] Custom domain (andreas.technology) configured
- [x] HTTPS enabled via GitHub Pages
- [x] Sitemap.xml generated and deployed
- [x] Person Schema (JSON-LD) implemented
- [x] Meta tags (title, description, OG, Twitter) configured
- [x] Favicon and app icons added
- [x] Mobile-responsive design
- [x] Static site export for fast loading

### Link Building
- [x] GitHub repository links to website (README badge)
- [x] Website links to GitHub and LinkedIn (schema + footer)
- [x] Internal linking structure (navigation)

---

## 🔄 In Progress / To Do

### 1. Submit Sitemap to Google Search Console
**Priority: HIGH**
- [ ] Log in to [Google Search Console](https://search.google.com/search-console)
- [ ] Navigate to "Sitemaps" in the left sidebar
- [ ] Add sitemap URL: `https://andreas.technology/sitemap.xml`
- [ ] Click "Submit"
- [ ] Wait 24-48 hours and verify it's been indexed

### 2. Complete the Link Loop
**Priority: HIGH**
- [ ] **LinkedIn Profile**:
  - [ ] Add `https://andreas.technology` to Contact Info → Website
  - [ ] Add link to first line of About section
  - [ ] Ensure job title matches: "IT & Security Engineer"
- [ ] **GitHub Repository**:
  - [ ] Go to repo settings (About section)
  - [ ] Add `https://andreas.technology` as Website
  - [ ] Add relevant topics: `portfolio`, `nextjs`, `typescript`, `threejs`

### 3. Enhance Metadata
**Priority: MEDIUM**
- [ ] Add `metadataBase` to layout.tsx to fix OG image URLs
  ```typescript
  metadataBase: new URL('https://andreas.technology')
  ```
- [ ] Verify OG images load correctly (currently showing localhost:3000)
- [ ] Add structured data for Projects (use `CreativeWork` schema)
- [ ] Consider adding `BreadcrumbList` schema for navigation

### 4. Content Optimization
**Priority: MEDIUM**
- [ ] Add `robots.txt` file to root:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://andreas.technology/sitemap.xml
  ```
- [ ] Create blog or articles section (Google loves fresh content)
- [ ] Add alt text to all images (accessibility + SEO)
- [ ] Ensure H1-H6 hierarchy is semantic
- [ ] Add more keywords naturally in content (avoid stuffing)

### 5. Performance Optimization
**Priority: MEDIUM**
- [ ] Run Lighthouse audit and aim for 90+ scores
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Minimize JavaScript bundle size
- [ ] Enable compression (Brotli/Gzip)
- [ ] Add preload hints for critical resources

### 6. Advanced SEO
**Priority: LOW**
- [ ] Create and submit `humans.txt`
- [ ] Add canonical URLs to prevent duplicate content
- [ ] Implement hreflang tags for bilingual content (en/gr)
- [ ] Set up Google Analytics 4 for traffic monitoring
- [ ] Create XML sitemap for images
- [ ] Add FAQ schema if applicable
- [ ] Register with Bing Webmaster Tools
- [ ] Submit to other search engines (DuckDuckGo, Yandex)

### 7. Social Media Presence
**Priority: LOW**
- [ ] Share website on LinkedIn with rich preview
- [ ] Pin website link to Twitter/X profile
- [ ] Create Open Graph images optimized for each platform
- [ ] Add social share buttons to projects

### 8. Backlink Strategy
**Priority: LOW**
- [ ] List portfolio on developer directories:
  - [ ] Dev.to
  - [ ] Hashnode
  - [ ] Medium
  - [ ] Indie Hackers
- [ ] Contribute to open source (link in GitHub bio)
- [ ] Write guest posts or tutorials linking back
- [ ] Add website to university alumni directory
- [ ] List on OMILIA LTD team page (if applicable)

---

## 📊 Monitoring & Maintenance

### Weekly
- [ ] Check Google Search Console for errors
- [ ] Monitor indexing status
- [ ] Review search queries and impressions

### Monthly
- [ ] Update content with fresh projects
- [ ] Check for broken links
- [ ] Review and update meta descriptions
- [ ] Analyze traffic patterns

### Quarterly
- [ ] Full SEO audit
- [ ] Update schema markup if needed
- [ ] Review and improve Core Web Vitals
- [ ] Competitor analysis

---

## 🛠️ Quick Wins (Do These First)

1. **Submit sitemap to Google Search Console** (5 min)
2. **Add metadataBase to fix OG images** (2 min)
3. **Create robots.txt** (2 min)
4. **Update LinkedIn with website link** (3 min)
5. **Add website to GitHub repo About section** (1 min)

---

## 📚 Resources

- [Google Search Console Help](https://support.google.com/webmasters)
- [Schema.org Documentation](https://schema.org/)
- [Next.js SEO Guide](https://nextjs.org/learn/seo/introduction-to-seo)
- [Web.dev Performance](https://web.dev/measure/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Last Updated**: 2026-01-17
**Next Review**: 2026-02-17
