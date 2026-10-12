# Performance log

Production build (`next build && next start`), headless Chromium 141. Lighthouse 12.8.2, mobile = default simulated throttling. One row per phase of [the launch plan](KEYNOTE-AUDIT-PLAN.md).

| Date | Commit | Phase | LH mobile perf | Mobile LCP | Desktop LCP | TBT | CLS | Initial JS (KiB gz, /) |
|---|---|---|---|---|---|---|---|---|
| 2026-10-12 | 478acbd | baseline | 90 | 3.7 s | 0.8 s | 50 ms | 0 | 266.9 |
| 2026-10-12 | P4 | first paint and reveals | 88 (simulated) | 3.8 s simulated; **0.9 s applied throttling (= FCP)** | 0.8 s | 40 ms | 0.001 | 271.1 |

Notes on P4: the hero now paints at FCP (unthrottled FCP = LCP = 160–190 ms; Lighthouse "devtools" throttling FCP = LCP = 0.9 s, was 1.9–3.7 s). Lighthouse's simulated LCP stays high because, on localhost, every script finishes before the first paint, so its model treats all JavaScript as blocking the LCP; the JavaScript reductions in P5–P6 address that.
| 2026-10-12 | P5–P6 | locale routes; animation library removed | 87 (simulated) / 84 (applied) | 3.8 s simulated; **0.9 s applied (= FCP)** | 0.8 s | 50–90 ms simulated; 640 ms applied | 0.001 | 204.9 |

Notes on P6: Lighthouse accessibility is now 100 on mobile and desktop, both languages. Motion (the animation library) is gone: the track and product shot are scroll-driven CSS (with a small rAF fallback where scroll timelines are unsupported), and dialogs, the menu, the project stage and the copy label use CSS transitions with @starting-style. Initial JS fell from 248 to 205 KiB; about 181 KiB of that is React and the Next.js runtime. Best practices stays at 96 locally only because /_vercel/speed-insights/script.js does not exist outside Vercel.
| 2026-10-13 | P11 | launch candidate (`release/keynote`) | **85 EN / 83 EL** (simulated, median of 5) | 3.9 s simulated; **1.0–1.4 s applied (= FCP)** | **0.75 s** (desktop perf **100**) | 156–219 ms simulated | 0.001 | **194.6** |

Final Lighthouse medians (local production build): accessibility **100**, SEO **100**, best practices 96 (only because `/_vercel/speed-insights/script.js` 404s off Vercel) in both languages on mobile and desktop; desktop performance **100**.

What still limits the simulated mobile score, for a future round:
- Lighthouse's simulator charges all JavaScript to the LCP, because on localhost the scripts finish before the first paint. Measured directly, LCP equals FCP.
- Hydration: all seven sections are client components. Turning static parts (Tech specs, slide headers, lists) into server components with small client islands would cut script evaluation and the RSC payload.
- Layout of the full server-rendered page on a throttled phone CPU (~1 s at 4x). `content-visibility: auto` on off-screen sections helps, but it made section jumps inexact and was reverted.
