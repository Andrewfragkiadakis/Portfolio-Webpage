# Performance log

Production build (`next build && next start`), headless Chromium 141. Lighthouse 12.8.2, mobile = default simulated throttling. One row per phase of [the launch plan](KEYNOTE-AUDIT-PLAN.md).

| Date | Commit | Phase | LH mobile perf | Mobile LCP | Desktop LCP | TBT | CLS | Initial JS (KiB gz, /) |
|---|---|---|---|---|---|---|---|---|
| 2026-10-12 | 478acbd | baseline | 90 | 3.7 s | 0.8 s | 50 ms | 0 | 266.9 |
| 2026-10-12 | P4 | first paint and reveals | 88 (simulated) | 3.8 s simulated; **0.9 s applied throttling (= FCP)** | 0.8 s | 40 ms | 0.001 | 271.1 |

Notes on P4: the hero now paints at FCP (unthrottled FCP = LCP = 160–190 ms; Lighthouse "devtools" throttling FCP = LCP = 0.9 s, was 1.9–3.7 s). Lighthouse's simulated LCP stays high because, on localhost, every script finishes before the first paint, so its model treats all JavaScript as blocking the LCP; the JavaScript reductions in P5–P6 address that.
