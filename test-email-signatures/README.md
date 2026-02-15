# Email Signature Style Library

A collection of **32 unique email signature designs** with detailed composition specifications for building an email signature generator platform.

## Files

- `email-signature-all.html` — All 32 signature styles in one file for comparison
- `email-signature-v3.html` through `email-signature-v7.html` — Individual signature versions

## Style Catalog & Generator Prompt

### 1. V3 — Accent Bar
- **Layout**: Compact flat design, two-row header with name left + website pill right, subtitle line, contact row, disclaimer
- **Motif**: Horizontal gradient accent bar above name
- **Typography**: Modern sans (system/Inter); name 19px bold, subtitle 13px medium, disclaimer 10px
- **Colors**: Slate text, indigo accent (#4f46e5, #818cf8), soft gray pill (#f1f5f9)
- **Components**: Website pill badge, phone link, circular socials (GitHub dark, LinkedIn blue)
- **Spacing**: Tight but clean; 16px gap under accent bar

---

### 2. V4 — Minimal Card
- **Layout**: Light card container, two-column split (left: name/role/cert; right: contact+socials)
- **Motif**: Subtle border, rounded card, vertical divider between columns
- **Typography**: Name 18px bold with line break, role uppercase 11px, cert 11px
- **Colors**: Pale card (#f8fafc), slate text, indigo links
- **Components**: Website link with arrow, phone, location, circular socials
- **Footer**: Tiny disclaimer (9px) below card

---

### 3. V5 — Dark Tech
- **Layout**: Dark card; stacked header (dot+role tag, name, detail line), divider, contact row with socials right
- **Motif**: Monospace uppercase role label with accent dot prefix
- **Typography**: Name 20px bold, monospace role label, muted palette
- **Colors**: Deep navy/black (#0f172a), indigo highlights, slate grays
- **Components**: Ghost-border square socials, thin divider line
- **Footer**: Small muted disclaimer

---

### 4. V6 — Terminal
- **Layout**: Faux macOS terminal with traffic-light buttons, command prompt lines, YAML contact table, link buttons
- **Motif**: CLI aesthetic with `whoami`, `echo $ROLE`, `cat contact.yml`, `open --links` commands
- **Typography**: Monospace 12–15px; green prompts, violet command markers
- **Colors**: Near-black background (#0c0c0c), terminal green (#28c840), violet accent (#818cf8)
- **Components**: YAML key-value contact rows, pill buttons with icon+label for socials
- **Footer**: Subtle sans disclaimer outside terminal

---

### 5. V7 — Executive
- **Layout**: White card with left gradient stripe; three zones (header, middle info bar, bottom action row)
- **Motif**: Editorial executive feel with CTA button
- **Typography**: Role uppercase 10px, name 24px bold, elegant spacing
- **Colors**: Indigo gradient stripe, soft gray section bands (#f8fafc)
- **Components**: Info bar (web/phone/location), social icons left, "VIEW PORTFOLIO" CTA button right
- **Footer**: Tiny disclaimer

---

### 6. V8 — Glitch
- **Layout**: Chaotic broken grid; oversized uppercase name, rotated role tag, caution stripe
- **Motif**: Brutalist design with clashing elements, dashed separators, mismatched shapes
- **Typography**: Courier monospace, heavy uppercase, tight line height (0.95)
- **Colors**: Yellow/black caution stripe, red accents (#dc2626), muted grays
- **Components**: Code-block contact chips, circular + square social mismatch
- **Footer**: Tiny monospace "confidential" note

---

### 7. V9 — Glass Panel
- **Layout**: Dark surface (#0f172a) with inner "glass" card; top row (tag+location), name, subtitle, divider, bottom contact+socials
- **Motif**: Frosted glass appearance via dark panel and soft borders
- **Typography**: Modern sans; name 20px bold, small tag uppercase
- **Colors**: Deep navy background, indigo accents, slate grays
- **Components**: Role tag pill (#4f46e5), subtle divider, rounded square socials
- **Footer**: Muted disclaimer

---

### 8. V10 — Ink
- **Layout**: Editorial black-and-white serif design; name, black rule, split row (title vs contacts), thin rule, socials+disclaimer
- **Motif**: Stark monochromatic contrast, no color accent
- **Typography**: Serif name 26px (Georgia), sans metadata 10–11px
- **Colors**: Pure black/gray/white only
- **Components**: Black circular socials (50% radius), italic disclaimer
- **Spacing**: Crisp rules and column layout

---

### 9. V11 — Statusbar
- **Layout**: Compact horizontal "status bar" with name + green online dot left, socials right; secondary info bar beneath; micro footer
- **Motif**: Dark UI status bar aesthetic
- **Typography**: Name 14px bold, metadata 11px, footer 9–10px
- **Colors**: Dark slate background (#1e293b), indigo link accent, green online dot (#22c55e)
- **Components**: Tiny square socials (24px), info link with arrow
- **Footer**: Phone/location + "Confidential"

---

### 10. V12 — Blueprint
- **Layout**: Blueprint card with grid lines, spec header (SPEC-001 / REV.3 / 2026), name, spec table, divider, socials, classified stamp
- **Motif**: Technical drawing aesthetic with monospace labels
- **Typography**: Monospace labels 8–10px, name 22px bold
- **Colors**: Deep blue (#0f172a), indigo (#818cf8), blueprint teal lines (#1e3a5f)
- **Components**: 5-row spec table (Role/Cert/Web/Tel/Loc), outlined socials
- **Footer**: "CLASSIFIED // DO NOT REDISTRIBUTE" in monospace

---

### 11. V13 — Boarding Pass
- **Layout**: Airline ticket format: passenger/class, dotted tear line, origin→destination with plane icon, gate/phone/socials, dashed sections
- **Motif**: Boarding pass ticket typography and layout
- **Typography**: Uppercase labels 9px, airport codes 22px bold
- **Colors**: Light paper background, indigo accent for WEB code (#4f46e5)
- **Components**: Plane emoji icon, dashed separators, mini socials
- **Sections**: Passenger | Class | From ATH | To WEB | Gate/Phone/Socials

---

### 12. V14 — Green Screen
- **Layout**: Retro terminal log with horizontal line separators and system status text, login header, bordered social buttons
- **Motif**: CRT phosphor green-on-black monochrome, SYSTEM LOGIN aesthetic
- **Typography**: Small monospace 9–10px
- **Colors**: Black background, multiple green shades (#1a5a1a, #2a7a2a, #3a9a3a, #4ade80)
- **Components**: Bordered text buttons for socials, "SECURE CHANNEL // EYES ONLY" footer

---

### 13. V15 — Receipt
- **Layout**: Narrow thermal receipt (280px max), centered header, dashed/equals rules, item-price contact table, centered socials, thank-you footer
- **Motif**: POS receipt aesthetic with separator patterns
- **Typography**: Monospace 10–14px
- **Colors**: Off-white paper (#fffff8), grayscale tones
- **Components**: Tiny circular socials, "THANK YOU FOR YOUR EMAIL" footer
- **Separators**: "- - -" dashed and "= = =" equals patterns

---

### 14. V16 — ID Badge
- **Layout**: Badge with lanyard slot at top, top band (security header), avatar placeholder circle, centered text sections, dashed divider, socials, barcode strip footer
- **Motif**: Corporate security ID card
- **Typography**: Clean sans; role in indigo, uppercase labels
- **Colors**: White badge, slate/indigo accents, dark initials box
- **Components**: Avatar placeholder (initials in box), security level label, barcode pseudo-text strip
- **Sections**: Lanyard | Top band | Avatar | Text zones | Dashed divider | Socials | Barcode

---

### 15. V17 — Code Editor
- **Layout**: IDE window with tab bar, syntax-highlighted JSON code lines with line numbers, status bar with socials
- **Motif**: VS Code/editor interface with contact.json file
- **Typography**: Monospace 11px with line numbers
- **Colors**: Dark editor palette (Catppuccin Mocha-inspired): #1e1e2e background, #cdd6f4 text, #f38ba8 keys, #a6e3a1 strings, #89b4fa URLs
- **Components**: Tab "contact.json", status bar "JSON UTF-8 LF", mini socials in status area
- **Content**: 8-line JSON representation of contact info

---

### 16. V18 — Chat Bubble
- **Layout**: iMessage-style messages; incoming bubble ("Hey, who are you?"), outgoing bubbles with name/role, contact card bubble, timestamp, socials below
- **Motif**: iOS messaging UI with blue bubbles
- **Typography**: System sans 12–13px
- **Colors**: iOS blue (#007aff) for sent, gray (#e5e5ea) for received
- **Components**: Rounded bubble corners, emoji icons for web/phone/location, socials on right
- **Footer**: "Today" timestamp

---

### 17. V19 — Sticky Note
- **Layout**: Yellow post-it card centered on light background, handwritten vibe, minimal divider, socials, casual footer
- **Motif**: Physical sticky note with slight shadow and rotation feel
- **Typography**: Playful handwritten font (Comic Sans MS, Marker Felt)
- **Colors**: Warm yellow paper (#fef08a), dark ink, subtle divider
- **Components**: Underline website, sun emoji (☀) in location
- **Spacing**: Generous padding, centered alignment

---

### 18. V20 — Passport
- **Layout**: Passport page with header (Digital Passport / ⭐ GR ⭐), photo box, surname/given name fields, specialization, info grid, MRZ strip, socials
- **Motif**: Travel passport aesthetic with navy & gold
- **Typography**: Sans with uppercase labels (9px), name 15px bold, MRZ monospace (8px)
- **Colors**: Navy base (#16213e), gold accents (#c9a93e), borders gold
- **Components**: MRZ line (machine-readable zone), "Digital Passport" header, initials badge box
- **Sections**: Header | Photo area | Name/specialization | Grid (Base/Comm/Web) | MRZ strip | Socials

---

### 19. V21 — HUD
- **Layout**: Military heads-up display panel with scan header, "TARGET IDENTIFIED" label, data rows (CLASS/RANK/SIGNAL/FREQ/COORDS), social buttons, threat level footer
- **Motif**: Military targeting interface aesthetic
- **Typography**: Monospace 8–16px, all caps labels
- **Colors**: Black/dark (#000), green monochrome (#0f5132, #0a8a3c, #22c55e, #4ade80)
- **Components**: Labeled data rows, boxed social buttons, "THREAT: NONE" indicator
- **Borders**: Green borders, green divider lines

---

### 20. V22 — Game HUD
- **Layout**: RPG character sheet card; name + level badge; XP progress bar with percentage; stats grid (WEB/COMM/BASE with icons); socials
- **Motif**: Game UI with progression bars and stats
- **Typography**: Bold name, small UI text (9–11px), icons with emoji
- **Colors**: Deep blue/purple (#16213e) with indigo gradient XP bar (#4f46e5→#818cf8), red level badge (#e94560)
- **Components**: XP bar (85% filled), stats row with emoji (🖥 📞 🌍), level badge "LVL 99"
- **Dividers**: Subtle border lines between sections

---

### 21. V23 — Split
- **Layout**: 50/50 split dark/light panels side-by-side; dark left has name+role+socials, light right has contact info; vertical indigo divider
- **Motif**: Dramatic split screen contrast
- **Typography**: Bold name on dark (17px), contact on light (12px)
- **Colors**: Dark navy left (#0f172a), white right (#ffffff), indigo border (#4f46e5)
- **Components**: Circular outlined socials on dark, minimal disclaimer on light
- **Divider**: 3px vertical indigo line

---

### 22. V24 — Typewriter
- **Layout**: Aged paper card with typewriter text, dotted leader "Web ....", "Verified" stamp rotated, socials above stamp
- **Motif**: Analog typewriter document with ink stamp
- **Typography**: Courier monospace throughout
- **Colors**: Tan paper (#f5f0e8), brown ink (#2c2416), red stamp (#8b0000)
- **Components**: Dotted leader dots, rotated red "Verified" stamp, round socials
- **Spacing**: Breaks between sections with light rule

---

### 23. V25 — Zen
- **Layout**: Centered, extreme whitespace, thin hairline dividers (horizontal and vertical), uppercase name, minimal contact
- **Motif**: Japanese minimalism and whitespace philosophy
- **Typography**: Light weight, wide letter-spacing (0.12em), uppercase
- **Colors**: Soft grays (#e2e8f0), indigo link (#4f46e5)
- **Components**: Thin rules (1px), vertical divider line (20px height), outlined socials with inverted icons
- **Alignment**: Centered throughout

---

### 24. V26 — Neon Sign
- **Layout**: Dark brick wall background, centered glowing neon text (name in two colors), small metadata, thin divider, socials
- **Motif**: Bar/lounge neon sign with text-shadow glow
- **Typography**: Bold sans, uppercase role with tracking (0.15em)
- **Colors**: Neon pink (#ff6b9d), neon cyan (#4ecdc4), neon yellow (#ffd93d) on black (#1a1a1a)
- **Components**: Text-shadow glow effects, circular neon-outlined socials
- **Glow**: 0 0 10px + 0 0 20px shadow on name

---

### 25. V27 — Circuit
- **Layout**: PCB card with component trace lines (U1 header), name, circuit dividers, labeled resistor rows (R1–R3), socials, bottom trace line
- **Motif**: Circuit board PCB aesthetic with component labeling
- **Typography**: Monospace 8–16px, uppercase labels
- **Colors**: Green PCB palette (#0a3d0c, #1a5c1e, #2d8632), bright lime text (#ffffff, #86efac, #4ade80)
- **Components**: Trace lines with dots "●—", labeled rows, circular outlined socials
- **Footer**: Bottom trace line "●————●"

---

### 26. V28 — Crypto
- **Layout**: Dark wallet card with name left + verified pill right (diamond icon), blockchain address line, divider, contact row + socials, styled squared buttons
- **Motif**: Blockchain wallet verification aesthetic
- **Typography**: Clean sans name (18px bold), small monospace address line (9px)
- **Colors**: Near-black (#0a0a0a, #111), amber/gold accent (#f59e0b), charcoal borders
- **Components**: Verified pill with diamond (♦), amber text accents, squared socials
- **Address**: Pseudo-hex "0xAF...3683 · athens.gr"

---

### 27. V29 — Minimal Dot
- **Layout**: Ultra-minimal; accent dot + name (single line), one info line with dots as separators, tiny socials below
- **Motif**: Single "one dot" brand marker philosophy
- **Typography**: Name 15px bold, detail 12px, tight spacing
- **Colors**: Indigo dot (#4f46e5), indigo link, slate text
- **Components**: Only web/phone (no location), micro socials (20px)
- **Separator**: Dots between elements

---

### 28. V30 — Hologram
- **Layout**: Sci-fi hologram panel with header (triangular status, "HOLO-PROJ ACTIVE", online indicator), glowing cyan name, divider, contact row, socials, encrypted footer
- **Motif**: Holographic projection UI with scan-line vibe
- **Typography**: Mix of monospace header and bold cyan name (22px)
- **Colors**: Cyan glow (#00ffff) on near-black (#050510), translucent borders (rgba)
- **Components**: Translucent borders (rgba(0,255,255,0.15)), outlined socials, "ENCRYPTED CHANNEL" footer with scan line
- **Glow**: Cyan color with rgba transparency

---

### 29. V31 — Newspaper
- **Layout**: Broadsheet classified ad card with masthead ("The Professional Gazette"), headline name, italic subline, column rules for contact rows, socials, borders
- **Motif**: Vintage newspaper/broadsheet aesthetics
- **Typography**: Serif name (22px italic), sans metadata, uppercase masthead
- **Colors**: Warm paper (#fffff5), black/gray ink (#1a1a1a)
- **Components**: Column separators (borders), circular black socials, decorative top/bottom rules
- **Sections**: Masthead | Decorative rules | Name | Subline | Column grid | Socials

---

### 30. V32 — Gradient Outline
- **Layout**: Nested tables for gradient border effect (2px padding); dark interior (#0f172a); header with name/role + socials right; divider; three-column contact row
- **Motif**: Vibrant gradient frame on dark card, modern contrast
- **Typography**: Modern sans; name 18px bold, role/metadata small
- **Colors**: Gradient border (135deg: indigo #4f46e5 → pink #ec4899 → amber #f59e0b), dark interior, indigo links
- **Components**: Rounded square socials (#1e293b background), centered disclaimer footer
- **Border**: 2px gradient frame via nested table padding

---

## Usage Notes

Each signature is designed as a self-contained HTML table structure with inline styles for maximum email client compatibility. All versions use:
- System fonts (San Francisco, Segoe UI, Helvetica) for broad compatibility
- Inline CSS for email reliability
- HTML tables for layout (email-safe)
- External images for icons (hosted on andreas.technology)
- Accessible link structures

## For Generator Implementation

When building your signature generator, use these specifications to:
1. Create input forms for each style's unique elements
2. Generate dynamic HTML from templates matching each layout pattern
3. Preserve typography hierarchy (name > role > details > disclaimer)
4. Maintain color palettes (use hex codes provided)
5. Scale component sizes proportionally
6. Test across major email clients (Gmail, Outlook, Apple Mail)

---

**Last Updated**: February 15, 2026
