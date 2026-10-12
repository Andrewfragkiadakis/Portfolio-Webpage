# Performance log

Production build (`next build && next start`), headless Chromium 141. Lighthouse 12.8.2, mobile = default simulated throttling. One row per phase of [the launch plan](KEYNOTE-AUDIT-PLAN.md).

| Date | Commit | Phase | LH mobile perf | Mobile LCP | Desktop LCP | TBT | CLS | Initial JS (KiB gz, /) |
|---|---|---|---|---|---|---|---|---|
| 2026-10-12 | 478acbd | baseline | 90 | 3.7 s | 0.8 s | 50 ms | 0 | 266.9 |
