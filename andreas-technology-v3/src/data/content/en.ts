import type { Content } from './types'
import { SOCIAL_URLS } from '@/data/site'

const en: Content = {
    location: "Athens, Greece",
    email: "andrewfragkiadakis@gmail.com",
    github: SOCIAL_URLS.github,
    linkedin: SOCIAL_URLS.linkedin,

    about: {
        description: [
            "I’m a Computer Engineer (M.Eng.) and Team Lead for Apple Fleet & IT Automation at Omilia, a global conversational-AI company. I own Jamf Pro end to end for 550+ Macs and lead endpoint engineering across Check Point Harmony Endpoint, Microsoft Sentinel and SSL certificate automation.",
            "In practice, that means CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits, and zero‑touch enrollment that cut Mac onboarding time by 70%.",
            "I also lead AI adoption: Google Gemini org-wide, Atlassian Rovo Agents, and an AI ticket-triage pipeline that cut average triage time across 350+ tickets.",
            "Jamf Certified Tech (Jamf 200) · TEE-licensed engineer · ITIL 4 Foundation · Athens, Greece · English (C2), Greek (native), German (B2)"
        ]
    },

    skills: [
        {
            id: "apple-fleet",
            icon: "laptop",
            label: "Apple Fleet & MDM",
            detail: "Jamf Certified Tech (Jamf 200). I own Jamf Pro end to end for 550+ Macs: zero‑touch enrollment through Apple Business Manager, configuration profiles, patching, Self Service and day-to-day fleet hygiene."
        },
        {
            id: "endpoint-security",
            icon: "shield",
            label: "Endpoint Security & Identity",
            detail: "Check Point Harmony Endpoint, CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits, Microsoft Sentinel SIEM pipelines, and identity and access with Microsoft Entra ID, Duo MFA and 1Password."
        },
        {
            id: "automation",
            icon: "terminal",
            label: "IT Automation & Scripting",
            detail: "Python, Bash/zsh, Swift/AppleScript and TypeScript against real APIs: Jamf API tooling, SIEM log collectors, and an acme.sh / Let's Encrypt pipeline that removed manual certificate renewals across Cisco ISE, ESXi and Proxmox."
        },
        {
            id: "ai-workflow",
            icon: "sparkles",
            label: "AI & Workflow Automation",
            detail: "Driving enterprise AI adoption: Google Gemini org-wide, Atlassian Rovo Agents, Claude Code and MCP servers, plus an AI ticket-triage pipeline in Jira Service Management."
        }
    ],

    services: [
        {
            id: "endpoint-security",
            icon: "shield",
            title: "Endpoint Security & Compliance",
            oneLiner: "CIS-hardened, EDR-protected Macs, ready for PCI DSS and SOC 2 audits.",
            detail: "Security that holds up in an audit and in production. I implemented CIS Benchmark hardening fleet-wide ahead of PCI DSS and SOC 2 audits, led the migration to Check Point Harmony Endpoint, and feed endpoint telemetry into Microsoft Sentinel so detection has real context.",
            highlights: [
                "CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits",
                "EDR migration with FileVault conflicts resolved and zero data loss",
                "Sentinel SIEM log pipelines over RFC 5424 + TLS"
            ],
            tools: ["Check Point Harmony Endpoint", "Microsoft Sentinel", "Jamf Pro", "Microsoft Entra ID", "Duo MFA", "1Password"]
        },
        {
            id: "apple-fleet",
            icon: "laptop",
            title: "Apple Fleet Engineering",
            oneLiner: "550+ Macs on Jamf Pro. Zero‑touch enrollment, 70% less onboarding time.",
            detail: "I own Jamf Pro end to end for a 550+ Mac fleet. A new Mac enrolls itself through Apple Business Manager, pulls its profiles and apps, and is ready on day one — zero‑touch enrollment cut onboarding time by 70%.",
            highlights: [
                "Jamf Certified Tech (Jamf 200)",
                "Zero‑touch enrollment: 70% less onboarding time",
                "Configuration profiles, patching, Self Service and fleet hygiene"
            ],
            tools: ["Jamf Pro", "Apple Business Manager", "macOS", "Bash / zsh", "Swift", "AppleScript"]
        },
        {
            id: "automation",
            icon: "gear",
            title: "IT Automation & Scripting",
            oneLiner: "Python, Bash and Swift against real APIs — recurring toil, removed.",
            detail: "If a task happens twice, it becomes a script. I write Bash, Python, Swift and TypeScript against real APIs, from Jamf tooling to a centralised certificate pipeline that renews SSL for Cisco ISE, ESXi, Proxmox and HPE iLO with no manual steps.",
            highlights: [
                "Jamf API tooling and SIEM log collectors",
                "acme.sh / Let's Encrypt DNS-01 renewals — no manual cert toil",
                "Scripts version-controlled and reviewed in Git"
            ],
            tools: ["Python", "Bash / zsh", "TypeScript", "Swift", "Git / GitHub", "acme.sh / Let's Encrypt"]
        },
        {
            id: "ai-operations",
            icon: "sparkles",
            title: "AI-Augmented Operations",
            oneLiner: "Gemini org-wide, Rovo Agents and AI ticket triage in Jira.",
            detail: "AI that does real work. I rolled out Google Gemini org-wide and Atlassian Rovo Agents, built an AI ticket-triage pipeline for Jira Service Management, and prototype MCP servers so assistants like Claude Code can work with IT systems directly.",
            highlights: [
                "Org-wide Google Gemini rollout",
                "AI ticket triage across 350+ tickets",
                "MCP server prototypes for IT tooling"
            ],
            tools: ["Claude Code", "MCP Servers", "Google Gemini", "Grok Bot", "Atlassian Rovo", "Jira Service Management", "Slack"]
        },
        {
            id: "itsm",
            icon: "headphones",
            title: "IT Service Management",
            oneLiner: "ITIL 4 service delivery: 350+ tickets resolved at 95%+ SLA.",
            detail: "Support people can rely on. ITIL 4 certified, I pair clear incident and request processes with automation and documentation, so the queue stays short and answers are easy to find.",
            highlights: [
                "ITIL 4 Foundation certified",
                "350+ Jira tickets resolved at 95%+ SLA",
                "40+ Confluence guides and 9 enterprise platforms administered"
            ],
            tools: ["Jira Service Management", "Confluence", "Atlassian Rovo", "Slack", "Google Workspace"]
        },
        {
            id: "infrastructure",
            icon: "network",
            title: "Networks & Infrastructure",
            oneLiner: "Cisco ISE, Active Directory, ESXi and Proxmox — the layer under it all.",
            detail: "The foundation under everything else: Cisco ISE network access control, identity across Active Directory and Entra ID, and virtualisation on VMware ESXi and Proxmox — with MFA, certificates and monitoring kept in order around them.",
            highlights: [
                "Cisco ISE network access control",
                "Identity across Active Directory and Entra ID",
                "Virtualisation on VMware ESXi and Proxmox"
            ],
            tools: ["Cisco ISE", "Active Directory", "Microsoft Entra ID", "VMware ESXi", "Proxmox", "Linux"]
        }
    ],

    experience: [
        {
            id: "omilia-team-lead",
            current: true,
            stack: ["Jamf Pro", "Bash / zsh", "Python", "TypeScript", "MCP Servers", "acme.sh / Let's Encrypt"],
            role: "Team Lead, Apple Fleet & IT Automation",
            company: "Omilia, Athens, Greece",
            duration: "April 2026 – Present",
            tasks: [
                "Own the Apple Fleet & IT Automation function, the Jamf Pro platform, and AI-driven IT pipelines across 550+ macOS endpoints",
                "Lead automation engineering in Bash, Python and TypeScript — Jamf API, AI ticket triage, MCP server prototypes and SSL renewal infrastructure",
                "Partner with Cyber, HR, Finance and Engineering to turn business needs into faster onboarding, fewer tickets and zero certificate toil"
            ]
        },
        {
            id: "omilia-it-engineer",
            role: "IT Engineer",
            company: "Omilia, Athens, Greece",
            duration: "September 2024 – May 2026",
            tasks: [
                "Architected Jamf Pro zero‑touch enrollment via Apple Business Manager for the 550+ Mac fleet, cutting onboarding time by 70%",
                "Implemented CIS Benchmark hardening fleet-wide with the Cyber team — full compliance ahead of PCI DSS and SOC 2 audits",
                "Led the enterprise EDR migration to Check Point Harmony Endpoint across 550+ devices, resolving FileVault conflicts at cutover with zero data loss",
                "Built a centralised certificate renewal pipeline (acme.sh, Let's Encrypt, DNS-01) for network, virtualisation and server-management infrastructure, ending manual renewals",
                "Engineered Microsoft Sentinel SIEM integration with Python log collectors (RFC 5424 over TLS), unifying endpoint and access telemetry",
                "Drove enterprise AI adoption: Gemini org-wide, Atlassian Rovo Agents, and an AI-powered ticket-triage pipeline",
                "Resolved 350+ Jira tickets at 95%+ SLA, authored 40+ Confluence guides and administered 9 enterprise platforms"
            ]
        },
        {
            id: "military-service",
            role: "Military Service — IT & Administrative Support",
            company: "Hellenic Army, Greece",
            duration: "November 2025 – August 2026",
            tasks: [
                "Delivered IT operations and administrative support reporting directly to the Deputy Battalion Commander",
                "Modernised the personnel database and upgraded battalion network infrastructure"
            ]
        },
        {
            id: "keep-eat-healthy",
            role: "IT Support & Infrastructure Coordinator",
            company: "Keep Eat Healthy, Koropi, Greece",
            duration: "May 2022 – November 2025",
            tasks: [
                "Owned end-to-end IT for a hybrid office: network, endpoint security, hardware lifecycle and vendor coordination",
                "Extended average device lifespan by 18 months through proactive maintenance and lifecycle planning",
                "Migrated paper workflows to Google Workspace and WordPress, reducing admin overhead and improving cross-team collaboration"
            ]
        },
        {
            id: "anemomyloi-andros",
            role: "IT Support Specialist",
            company: "Anemomyloi Andros, Andros, Greece",
            duration: "January 2023 – February 2024",
            tasks: [
                "Digitised daily operations by migrating the entire business archive from paper to Google Drive with data retention and security controls",
                "Managed the booking and billing platform, handling reservations, digital invoicing and system updates",
                "Provided fully remote technical support and advised owners on digital upgrades to improve operational efficiency"
            ]
        },
        {
            id: "freelance-web",
            role: "Web Developer",
            company: "Freelance, Greece",
            duration: "2020 – November 2023",
            tasks: [
                "Built and launched client websites end to end: domain, DNS, SSL/TLS, hosting, MySQL, WordPress and SEO",
                "Improved organic search visibility with structured data and performance tuning"
            ]
        },
        {
            id: "weballdesign",
            role: "Network Systems Technician",
            company: "Weballdesign, Athens, Greece",
            duration: "2020 – November 2022",
            tasks: [
                "Installed and configured server/client systems in educational institutions",
                "Maintained network infrastructure (switches, routers, UPS) and performed diagnostics",
                "Trained on-site personnel and documented procedures"
            ]
        }
    ],

    education: [
        {
            id: "uniwa-meng",
            degree: "Integrated Master’s (M.Eng.), Informatics & Computer Engineering",
            institution: "University of West Attica, Athens, Greece",
            duration: "September 2019 – June 2025",
            details: [
                "Active member of the university’s Tech Society",
                "Relevant coursework: Advanced Computer Systems, AI, Network Security, Databases, Web Development, Cloud Computing"
            ]
        },
        {
            id: "srh-erasmus",
            degree: "Erasmus+ exchange semester, M.Sc. Applied Computer Science",
            institution: "SRH Hochschule Heidelberg, Germany",
            duration: "April 2023 – October 2023",
            details: ["One semester of the M.Sc. Applied Computer Science programme, on Erasmus+", "Recognised as presenter and team lead"]
        },
        {
            id: "jamf-200",
            degree: "Jamf Certified Tech — Jamf Pro (Jamf 200)",
            institution: "Jamf",
            duration: "2026",
            kind: "certification",
            badge: "Jamf 200",
            details: [
                "Passed the Jamf 200 certification exam for Jamf Pro",
                "Enrollment, inventory, policies, configuration profiles, Self Service and scoping for macOS and iOS fleets"
            ],
            link: "https://www.credly.com/badges/05e1f049-b7fb-4a92-bc2b-fd27ad861755"
        },
        {
            id: "itil-4",
            degree: "ITIL 4 Foundation Certificate in IT Service Management",
            institution: "PeopleCert",
            duration: "2025",
            kind: "certification",
            badge: "ITIL 4",
            details: ["Knowledge of the ITIL 4 framework", "Focus on IT service management (ITSM) best practices"],
            link: "/files/itil-v4-cert.pdf"
        },
        {
            id: "tee-licence",
            degree: "Professional Licence — Informatics & Computer Engineer",
            institution: "Technical Chamber of Greece (TEE)",
            duration: "2025",
            kind: "license",
            badge: "TEE licence",
            details: [
                "Statutory licence to practise as an Informatics & Computer Engineer in Greece",
                "Requires an accredited five-year integrated Master’s degree"
            ]
        },
        {
            id: "genai-essentials",
            degree: "Career Essentials in Generative AI",
            institution: "Microsoft & LinkedIn",
            duration: "2024",
            kind: "certification",
            details: ["Foundations of generative AI systems and responsible adoption", "Applied to enterprise AI rollouts and agentic automation"]
        }
    ],

    projects: [
        {
            id: "signature-craft",
            name: "Signature Craft",
            year: 2026,
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Email Signatures"],
            description: "An email-signature builder with 32+ templates. Signatures that render correctly in Gmail, Outlook, Apple Mail, Yahoo and Thunderbird — free, with no sign-up.",
            role: "Solo design and build",
            detail: "An email-signature builder for a problem every company has and nobody owns: signatures that break the moment they leave your machine. Signature Craft generates table-based HTML that renders consistently across the major mail clients, with no sign-up, no paywall and no tracking.",
            highlights: [
                "32+ templates spanning corporate, minimal and creative layouts",
                "Client-safe HTML tested against Gmail, Outlook, Apple Mail, Yahoo and Thunderbird",
                "Free, with no sign-up and no tracking",
                "Live preview with one-click copy to clipboard"
            ],
            liveSiteLink: "https://signature-craft-tau.vercel.app/",
            image: "/images/signature-craft/signature-craft.webp",
            imageFit: "cover"
        },
        {
            id: "portfolio-website",
            name: "Portfolio Website",
            year: 2026,
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"],
            description: "This site: a portfolio told like a product launch. Seven slides on one horizontal track on desktop, a clean vertical stack on phones, in English and Greek, light and dark.",
            role: "Solo design and build",
            detail: "This site, designed like a product launch page. On desktop, seven slides travel along one horizontal track with snapping and dot navigation; on tablets and phones they become a vertical stack with bottom-sheet dialogs. Fully bilingual, light and dark, and built to stay accessible: keyboard navigable, focus-visible throughout, and respectful of reduced-motion preferences.",
            highlights: [
                "Seven-slide horizontal track with idle snapping and dot navigation",
                "Bottom-sheet dialogs and a snapping tile gallery on phones",
                "Full EN/GR content with light and dark themes",
                "Keyboard accessible with reduced-motion support"
            ],
            liveSiteLink: "https://andreas.technology",
            githubLink: "https://github.com/Andrewfragkiadakis/Portfolio-Webpage",
            image: "/images/portfolio-website/2026-keynote.webp",
        },
        {
            id: "radio-over-fiber-thesis",
            name: "Radio over Fiber for 5G - M.Eng. Thesis",
            year: 2025,
            tags: ["Thesis", "5G", "Radio over Fiber", "Research"],
            description: "M.Eng. thesis on Radio over Fiber: where hybrid wireless-optical networks change the cost of 5G. Comes with an interactive slide deck.",
            role: "Sole researcher · Integrated M.Eng. thesis, University of West Attica",
            detail: "Research into hybrid wireless-optical access networks for 5G, centred on Radio over Fiber as a way to move signal processing off the antenna site and into a shared facility. The work compares distributed and centralised RAN architectures and evaluates where optical transport meaningfully changes the total cost of ownership. Published as “New Hybrid Wireless Optical Networks (Radio Over Fiber) for 5G Networks”.",
            highlights: [
                "Compared D-RAN and C-RAN deployment models on cost and capacity",
                "Evaluated WDM transport for fronthaul consolidation",
                "Produced a full TCO analysis and unified-infrastructure case study",
                "Presented as an interactive slide deck alongside the written thesis"
            ],
            liveSiteLink: "/thesis-presentation",
            reportLink: "https://drive.usercontent.google.com/download?id=1iayG5SCoUykioRzLPl1BeOkO7iwxxHkD&export=download&authuser=0",
            image: "/images/thesis-presentation/thesis-image.webp",
            edges: ["#0e2841", "#1d364d"],
        },
        {
            id: "raspberry-pi",
            name: "Raspberry Pi Adblocker & Streamer",
            year: 2024,
            tags: ["Raspberry Pi", "Linux", "Networking", "Pi-hole", "Plex"],
            description: "Configured a Raspberry Pi for network-wide adblocking (Pi-hole) and media streaming (Plex) on a home network.",
            role: "Solo build · Home lab",
            detail: "A single Raspberry Pi doing two jobs: network-wide DNS ad-blocking with Pi-hole, and media streaming with Plex. A practical exercise in getting useful, always-on infrastructure out of minimal hardware, and in the DNS, networking and service-management work that keeps it running unattended.",
            highlights: [
                "Network-wide DNS-level ad blocking via Pi-hole",
                "Plex media server for local streaming",
                "Runs unattended on low-power hardware",
                "Hands-on Linux service management and networking"
            ],
            image: "/images/raspberry-pi-adblocker-streamer/raspberry-pi.webp",
            imageFit: "cover"
        },
        {
            id: "plano-plus",
            name: "Plano Plus - Signs & Visual Identity",
            year: 2026,
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend"],
            description: "A fast, premium website for a signage and visual-identity studio in Crete, built on Next.js, with a contact form that lands straight in the client’s inbox.",
            role: "Solo design and build · Client project",
            detail: "A full marketing site for a Cretan signage and visual-identity studio, built on the Next.js App Router. The brief was to make a traditional signage business look as considered online as its work looks on the street: fast, tactile, and unmistakably premium. Includes light/dark theming, parallax depth, smooth scrolling, and a contact form wired to transactional email.",
            highlights: [
                "Next.js App Router with light/dark theming and parallax scroll",
                "Contact form with transactional email delivery via Resend",
                "Optimised for local search across Crete",
                "Live and serving real client enquiries"
            ],
            liveSiteLink: "https://www.planoplus.gr/",
            image: "/images/PlanoPlus/plano.webp",
            edges: ["#010308", "#020409"],
        },
        {
            id: "schiller",
            name: "Schiller Language Centers Website",
            year: 2026,
            tags: ["Wix", "Wix Studio", "Web Development", "Education"],
            description: "The website for Schiller Language Centers in Rethymno, Crete: English, German and Educational Robotics courses, kept current by the school’s own staff.",
            role: "Solo build · Client project",
            detail: "The public website for Schiller Language Centers in Rethymno, Crete, covering their English, German and Educational Robotics programmes. Built on Wix Studio so the client’s own staff can keep course listings and term dates current without needing a developer.",
            highlights: [
                "Course catalogue across English, German and Educational Robotics",
                "Built for non-technical staff to maintain independently",
                "Structured for local search visibility in Rethymno",
                "Live and in active use by the school"
            ],
            liveSiteLink: "https://www.schiller.edu.gr/",
            image: "/images/schiller-project/schiller.webp",
            edges: ["#fafafa", "#797e81"],
        },
        {
            id: "llms-research-review",
            name: "LLMs & Human Knowledge - Research review",
            year: 2024,
            tags: ["Research", "Cognitive Science", "LLMs", "GPT-3"],
            description: "A research review of whether GPT-3 attributes beliefs the way people do, based on Trott et al.’s False Belief Task study in Cognitive Science (2023).",
            role: "Research review · Source study: Trott et al., Cognitive Science 47(7), 2023",
            detail: "A review of how GPT-3 and people compare on the False Belief Task, a standard test of theory of mind from developmental psychology. The question: does a language model that writes fluently about beliefs actually attribute them, or does it pattern-match its way to the right answer? Based on “Do Large Language Models Know What Humans Know?” by Trott, Jones, Chang, Michaelov and Bergen (Cognitive Science, 2023).",
            highlights: [
                "GPT-3 versus human baselines on the False Belief Task",
                "Developmental-psychology methods applied to model evaluation",
                "What the results imply about learning theory of mind from language",
                "Source: peer-reviewed study in Cognitive Science (Wiley, 2023)"
            ],
            reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
            publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
            image: "/images/research-llms-human-knowledge/llm-research.webp",
            edges: ["#3a365d", "#dccdcd"],
        },
        {
            id: "nexus-party-app",
            name: "Nexus Party App",
            year: 2026,
            tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "PWA"],
            description: "Six Greek party games in one installable PWA — Quizball, Taboo, Palermo, Pes Vres, Impostor and Truth or Dare — with automatic scoring, timers and custom rules.",
            role: "Solo design and build",
            detail: "A Greek-language party game collection bundling six multiplayer games into one installable PWA. Built to solve a real problem at gatherings: nobody wants to download six apps or remember six sets of rules. Handles scoring, timers and per-game configuration so the group can keep playing instead of arguing about the rules.",
            highlights: [
                "Six multiplayer games: Quizball, Taboo, Palermo, Pes Vres, Impostor, Truth or Dare",
                "Installable PWA that works offline",
                "Automatic scoring, round timers and configurable rules",
                "State managed with Zustand; animated with Framer Motion"
            ],
            liveSiteLink: "https://nexus-party-app.vercel.app/",
            image: "/images/NexusPartyApp/nexuspartyapp.webp",
            device: "phone",
            imageFit: "cover"
        },
        {
            id: "silence-hero",
            name: "Silence Hero - Chrome Extension",
            year: 2024,
            tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
            description: "A Chrome extension that shows, at a glance, whether it’s Greek quiet hours — with a countdown to the next change.",
            role: "Solo build",
            detail: "A small, deliberately single-purpose Chrome extension that tracks Greek statutory quiet hours and tells you, at a glance, whether right now is a good time to drill a hole in the wall. Visual state plus a live countdown to the next transition.",
            highlights: [
                "Live countdown to the next quiet-hours transition",
                "At-a-glance visual state in the toolbar",
                "Handles seasonal variation in Greek quiet-hours law",
                "No permissions beyond what the extension actually needs"
            ],
            githubLink: "https://github.com/Andrewfragkiadakis/Silence-Hero",
            image: "/images/silence-hero/silence-hero.webp",
            edges: ["#fbfafa", "#fbfafb"],
        },
        {
            id: "happyfox",
            name: "HappyFox - Mental Health App",
            year: 2023,
            tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
            description: "A mental-health app concept for low-energy days, built around a daily check-in that takes under a minute. Team project at SRH Heidelberg.",
            role: "Team project · UI/UX design, SRH Heidelberg",
            detail: "A mental-health application concept developed during a Master’s course at SRH Heidelberg. The team’s focus was on designing for people in a low-energy state: reducing friction, avoiding judgemental language, and making the daily check-in something you can complete in under a minute.",
            highlights: [
                "End-to-end UI/UX concept designed in Figma",
                "Designed around low-friction daily emotional check-ins",
                "Delivered as a team project with an awarded presentation",
                "Focus on accessible, non-judgemental interaction design"
            ],
            githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
            image: "/images/happyfox/happyfox-app.webp",
            device: "bare",
            imageFit: "cover"
        },
        {
            id: "wheelchair-concept",
            name: "The Friendly Wheelchair (Concept)",
            year: 2023,
            tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
            description: "A project plan and technical specification for an AI-assisted self-driving wheelchair, scoped for the Heidelberg clinics.",
            role: "Project management lead · SRH Heidelberg",
            detail: "A project management plan and technical specification for an AI-assisted self-driving wheelchair intended for the Heidelberg clinics. The work was deliberately not a prototype: it covered scope, risk, stakeholder mapping, regulatory considerations and delivery planning for a healthcare-grade assistive device.",
            highlights: [
                "Full project management plan under an Agile/SCRUM framework",
                "Technical specification for AI navigation and NLP interaction",
                "Risk and stakeholder analysis for a clinical deployment context",
                "Scoped against healthcare IT constraints"
            ],
            reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
            image: "/images/friendly-wheelchair-concept/friendly-wheelchair.webp",
            imageFit: "cover",
            imagePosition: "50% 62%"
        }
    ],

    keynote: {
        common: { name: "Andreas Fragkiadakis", close: "Close", newTab: "opens in a new tab", skip: "Skip to content" },
        nav: {
            sections: { hero: "Overview", about: "About", services: "What I do", specs: "Tech specs", experience: "Career", projects: "Projects", contact: "Contact" },
            main: "Main navigation", menu: "Menu", slides: "Slides",
            cta: "Let’s talk", openMenu: "Open menu", closeMenu: "Close menu", switchLanguage: "Switch to Greek",
            toLight: "Switch to light theme", toDark: "Switch to dark theme", appearance: "Appearance", language: "Language", light: "Light", dark: "Dark"
        },
        hero: {
            headline: "Apple fleets.\n*Automated.*",
            sub: "I lead Apple Fleet & IT Automation at Omilia: **550+ Macs** on Jamf Pro, enrolled **zero‑touch** and hardened to CIS Benchmarks.",
            viewWork: "View work",
            contact: "Contact",
            note: "Jamf Certified Tech (Jamf 200) · Athens, Greece"
        },
        about: {
            eyebrow: "About",
            headline: "Meet Andreas.",
            bio: "A Computer Engineer (M.Eng.) leading Apple Fleet & IT Automation at Omilia, a global conversational-AI company. I own **Jamf Pro end to end**, harden the fleet to CIS Benchmarks, and turn **every repeated task** into code.",
            fullStory: "Read the full story",
            dialogTitle: "About Andreas",
            credentials: "Credentials",
            focus: "Focus areas",
            stats: [
                { value: 550, suffix: "+", label: "Macs managed on Jamf Pro" },
                { value: 70, suffix: "%", label: "less onboarding time, zero‑touch" },
                { value: 6, suffix: "+", unit: "yrs", label: "in IT, infrastructure and security" },
                { value: 95, suffix: "%+", label: "SLA met across 350+ tickets" },
            ]
        },
        services: {
            eyebrow: "What I do",
            headline: "Happens twice?\nIt becomes a script.",
            learnMore: "Learn more",
            ctaLead: "Have a project in mind?",
            ctaLink: "Let’s talk",
            highlights: "In practice",
            toolkit: "Toolkit"
        },
        specs: {
            eyebrow: "Tech specs",
            headline: "The toolkit.",
            sub: "Tools in day-to-day use, by area.",
            groups: { apple: "Apple fleet", security: "Security & identity", infra: "Infrastructure", code: "Code", ai: "AI", collab: "Collaboration & ITSM" }
        },
        experience: {
            eyebrow: "Career",
            headline: "Then. Now.",
            now: "Now",
            then: "Then",
            education: "Education & credentials",
            more: "Role details",
            verify: "Verify",
            tasks: "What the role involved",
            details: "Details"
        },
        projects: {
            eyebrow: "Projects",
            headline: "Selected work.",
            learnMore: "Learn more",
            visit: "Visit site",
            code: "View code",
            report: "Report",
            publication: "Publication",
            github: "More on GitHub",
            lineup: "All projects",
            highlights: "Highlights"
        },
        contact: {
            eyebrow: "Contact",
            headline: "Let’s build\nsomething.",
            sub: "Open to **full-time roles** and **freelance projects**.",
            send: "Send a message", subject: "Hello from andreas.technology",
            resume: "Download résumé",
            email: "Email",
            location: "Location",
            time: "Local time",
            elsewhere: "Elsewhere",
            copy: "Copy",
            copied: "Copied",
            copyFailed: "Copy failed"
        }
    },

    copyright: "© 2026 Andreas Fragkiadakis. All rights reserved."
}

export default en
