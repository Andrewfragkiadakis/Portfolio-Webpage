import type { ToolLabel } from '@/data/tools'

export interface Skill {
    icon: string
    label: string
    detail: string
}

export interface Service {
    icon: string
    title: string
    /** Keynote one-liner shown on the feature grid (one short sentence). */
    oneLiner: string
    /** One-line summary shown on the card. */
    description: string
    /** Short explanation shown when the card is opened. */
    detail: string
    /** Concrete, factual examples of the work. */
    highlights: string[]
    /** Curated toolkit for this area, drawn from data/tools.ts. */
    tools: ToolLabel[]
}

export interface Experience {
    role: string
    company: string
    duration: string
    tasks: string[]
}

export type EducationKind = 'degree' | 'certification' | 'license'

export interface Education {
    degree: string
    institution: string
    duration: string
    details: string[]
    link?: string
    /** Drives the card icon and whether it appears in the About credential strip. Defaults to 'degree'. */
    kind?: EducationKind
    /** Short label for credential badges, e.g. "JAMF 200". */
    badge?: string
    /** Font Awesome class overriding the default icon for this kind. */
    icon?: string
    /** Accent-highlight this entry in the credential strip. */
    featured?: boolean
}

export interface Project {
    name: string
    tags: string[]
    /** Short summary shown on the card. */
    description: string
    /** Longer story shown in the detail dialog. */
    detail?: string
    /** How the work was done, e.g. "Solo build" or "Team of 4 — UX lead". */
    role?: string
    /** Concrete outcomes shown as bullets in the detail dialog. */
    highlights?: string[]
    year?: number
    githubLink?: string
    liveSiteLink?: string
    reportLink?: string
    publicationLink?: string
    image?: string
    /**
     * How the screenshot fills its 16:10 frame. Defaults to 'contain' (whole image,
     * blurred fill behind) so nothing is ever cut off; use 'cover' only when the
     * subject survives the crop.
     */
    imageFit?: 'cover' | 'contain'
    /** CSS object-position for 'cover' crops, e.g. "50% 62%" to keep the subject in frame. */
    imagePosition?: string
    /**
     * Which device frame the screenshot is shown in: a laptop (default), a phone for
     * mobile-first work, or 'bare' when the image is already a product shot.
     */
    device?: 'laptop' | 'phone' | 'bare'
}

/** Copy written for the Apple Keynote layout: short, sentence-case, fully accented Greek. */
export interface KeynoteCopy {
    common: { name: string; close: string; newTab: string }
    nav: {
        home: string; about: string; services: string; specs: string; experience: string; projects: string; contact: string
        cta: string; openMenu: string; closeMenu: string; switchLanguage: string
        toLight: string; toDark: string; appearance: string; language: string; light: string; dark: string
    }
    intro: { headline: string; enter: string; skip: string }
    hero: { headline: string; sub: string; viewWork: string; contact: string; note: string }
    about: {
        eyebrow: string; headline: string; bio: string; fullStory: string; dialogTitle: string
        credentials: string; focus: string; yearsUnit: string
        /** Captions for 550+, 70%, 6+ and 95%+ (SLA), in that order. */
        stats: [string, string, string, string]
    }
    services: {
        eyebrow: string; headline: string; learnMore: string
        ctaLead: string; ctaLink: string; highlights: string; toolkit: string
    }
    specs: {
        eyebrow: string; headline: string; sub: string
        groups: Record<'apple' | 'security' | 'infra' | 'code' | 'ai' | 'collab', string>
    }
    experience: {
        eyebrow: string; headline: string; now: string; then: string; education: string
        more: string; verify: string; tasks: string; details: string
    }
    projects: {
        eyebrow: string; headline: string; learnMore: string; visit: string; code: string; report: string
        publication: string; github: string; lineup: string; role: string; highlights: string
    }
    contact: {
        eyebrow: string; headline: string; sub: string; send: string; resume: string; email: string
        location: string; time: string; elsewhere: string; copy: string; copied: string; copyFailed: string
    }
}

export interface Content {
    name: string
    title: string
    location: string
    phone: string
    email: string
    github: string
    linkedin: string
    nav: {
        home: string
        close: string
        languageLabel: string
        about: string
        experience: string
        projects: string
        services: string
        contact: string
    }
    about: {
        title: string
        subtitle: string
        tagline: string
        description: string[]
        readMore: string
        showLess: string
        currentFocus: string
        currentFocusDetail: string
        statsLabels: string[]
        credentialsLabel: string
    }
    hero: {
        firstName: string
        lastName: string
        typewriter: string[]
        viewWork: string
        getInTouch: string
        scroll: string
    }
    contact: {
        title: string
        subtitle: string
        infoTitle: string
        socialTitle: string
        opportunitiesTitle: string
        opportunitiesDescription: string
        sendMessage: string
        downloadResume: string
        emailLabel: string
        locationLabel: string
        localTimeLabel: string
        copyEmail: string
        copied: string
        copyFailed: string
    }
    cursor: {
        view: string
        verify: string
        open: string
    }
    skillsTitle: string
    skills: Skill[]
    servicesTitle: string
    servicesSubtitle: string
    servicesCta: string
    servicesCtaButton: string
    servicesLabels: {
        highlights: string
        toolkit: string
        details: string
        tools: string
    }
    services: Service[]
    experienceTitle: string
    experience: Experience[]
    educationTitle: string
    education: Education[]
    projectsTitle: string
    projects: Project[]
    experienceSection: {
        title: string
        subtitle: string
        professional: string
        education: string
        verify: string
    }
    projectsSection: {
        title: string
        subtitle: string
        live: string
        code: string
        githubCta: string
        details: string
        caseStudy: string
        roleLabel: string
        highlightsLabel: string
        report: string
        publication: string
        close: string
    }
    cinematicEntry: {
        initializing: string
        loading: string
        ready: string
        enterSystem: string
        skip: string
    }
    contactTitle: string
    copyright: string
    keynote: KeynoteCopy
}

export const SOCIAL_URLS = {
    github: "https://github.com/Andrewfragkiadakis",
    linkedin: "https://www.linkedin.com/in/andreas-fragkiadakis/",
} as const

export const content: Record<'en' | 'gr', Content> = {
    en: {
        name: "ANDREAS FRAGKIADAKIS",
        title: "IT Automation Lead & Security Engineer",
        location: "Athens, Greece",
        phone: "(+30) 697-345-3683",
        email: "andrewfragkiadakis@gmail.com",
        github: SOCIAL_URLS.github,
        linkedin: SOCIAL_URLS.linkedin,

        nav: {
            home: "HOME",
            close: "CLOSE",
            languageLabel: "English",
            about: "ABOUT",
            experience: "EXPERIENCE",
            projects: "PROJECTS",
            services: "WHAT I DO",
            contact: "CONTACT"
        },

        about: {
            title: "ABOUT ME",
            subtitle: "// ABOUT ME",
            tagline: "Leading Apple Fleet & IT Automation across a 550+ device environment",
            readMore: "Read more",
            showLess: "Show less",
            currentFocus: "Current Focus",
            currentFocusDetail: "Fleet Automation & Endpoint Security",
            statsLabels: ["Years Experience", "Endpoints Managed", "Faster Onboarding", "Certifications"],
            credentialsLabel: "Credentials",
            description: [
                "I’m a Computer Engineer (M.Eng.) and Team Lead for Apple Fleet & IT Automation at Omilia, a global conversational-AI company. I own Jamf Pro end to end for 550+ Macs and lead endpoint engineering across Check Point Harmony Endpoint, Microsoft Sentinel and SSL certificate automation.",
                "In practice, that means CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits, and zero‑touch enrollment that cut Mac onboarding time by 70%.",
                "I also lead AI adoption: Google Gemini org-wide, Atlassian Rovo Agents, and an AI ticket-triage pipeline that cut average triage time across 350+ tickets.",
                "Jamf Certified Tech (Jamf 200) · TEE-licensed engineer · ITIL 4 Foundation · Athens, Greece · English (C2), Greek (native), German (B2)"
            ]
        },

        hero: {
            firstName: "ANDREAS",
            lastName: "FRAGKIADAKIS",
            typewriter: [
                "APPLE FLEET & IT AUTOMATION LEAD",
                "M.ENG. COMPUTER ENGINEER",
                "ENDPOINT SECURITY ENGINEER",
                "JAMF CERTIFIED TECH · JAMF 200",
                "TEE-LICENSED ENGINEER",
                "ITIL V4 CERTIFIED",
                "INFRASTRUCTURE AUTOMATION ENGINEER",
                "AI AUTOMATION SPECIALIST",
                "SCRIPTING EXPERT",
                "PROBLEM SOLVER",
            ],
            viewWork: "View My Work",
            getInTouch: "Get In Touch",
            scroll: "SCROLL TO NAVIGATE"
        },

        contact: {
            title: "CONNECT",
            subtitle: "GET IN TOUCH",
            infoTitle: "Contact Information",
            socialTitle: "Find me on",
            opportunitiesTitle: "Open to Opportunities",
            opportunitiesDescription: "Looking for full-time positions, freelance projects, or interesting collaborations. Let's build something amazing together.",
            sendMessage: "Send Message",
            downloadResume: "Download Resume",
            emailLabel: "Email",
            locationLabel: "Location",
            localTimeLabel: "Local time",
            copyEmail: "Copy",
            copied: "Copied",
            copyFailed: "Copy failed"
        },

        cursor: {
            view: "View",
            verify: "Verify",
            open: "Open"
        },

        skillsTitle: "CORE SKILLS",
        skills: [
            {
                icon: "fab fa-apple",
                label: "Apple Fleet & MDM",
                detail: "Jamf Certified Tech (Jamf 200). I own Jamf Pro end to end for 550+ Macs: zero‑touch enrollment through Apple Business Manager, configuration profiles, patching, Self Service and day-to-day fleet hygiene."
            },
            {
                icon: "fas fa-shield-halved",
                label: "Endpoint Security & Identity",
                detail: "Check Point Harmony Endpoint, CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits, Microsoft Sentinel SIEM pipelines, and identity and access with Microsoft Entra ID, Duo MFA and 1Password."
            },
            {
                icon: "fas fa-terminal",
                label: "IT Automation & Scripting",
                detail: "Python, Bash/zsh, Swift/AppleScript and TypeScript against real APIs: Jamf API tooling, SIEM log collectors, and an acme.sh / Let's Encrypt pipeline that removed manual certificate renewals across Cisco ISE, ESXi and Proxmox."
            },
            {
                icon: "fas fa-robot",
                label: "AI & Workflow Automation",
                detail: "Driving enterprise AI adoption: Google Gemini org-wide, Atlassian Rovo Agents, Claude Code and MCP servers, plus an AI ticket-triage pipeline in Jira Service Management."
            }
        ],

        servicesTitle: "WHAT I DO",
        servicesSubtitle: "// SERVICES & EXPERTISE",
        servicesCta: "Have a unique project in mind?",
        servicesCtaButton: "Let's Talk",
        servicesLabels: { highlights: "In practice", toolkit: "Toolkit", details: "Details", tools: "tools" },
        services: [
            {
                icon: "fas fa-shield-halved",
                title: "Endpoint Security & Compliance",
                oneLiner: "CIS-hardened, EDR-protected Macs, ready for PCI DSS and SOC 2 audits.",
                description: "Hardening fleets against real-world threats: CIS Benchmark implementation, EDR deployment and migration, disk-encryption management, and audit readiness for PCI DSS and SOC 2.",
                detail: "Security that holds up in an audit and in production. I implemented CIS Benchmark hardening fleet-wide ahead of PCI DSS and SOC 2 audits, led the migration to Check Point Harmony Endpoint, and feed endpoint telemetry into Microsoft Sentinel so detection has real context.",
                highlights: [
                    "CIS Benchmark hardening ahead of PCI DSS and SOC 2 audits",
                    "EDR migration with FileVault conflicts resolved and zero data loss",
                    "Sentinel SIEM log pipelines over RFC 5424 + TLS"
                ],
                tools: ["Check Point Harmony Endpoint", "Microsoft Sentinel", "Jamf Pro", "Microsoft Entra ID", "Duo MFA", "1Password"]
            },
            {
                icon: "fab fa-apple",
                title: "Apple Fleet Engineering",
                oneLiner: "550+ Macs on Jamf Pro. Zero‑touch enrollment, 70% less onboarding time.",
                description: "Jamf Certified Tech (Jamf 200). Managing macOS at scale with Jamf Pro and Apple Business Manager — zero‑touch enrollment, configuration profiles, patch strategy, and fleet hygiene across hundreds of devices.",
                detail: "I own Jamf Pro end to end for a 550+ Mac fleet. A new Mac enrolls itself through Apple Business Manager, pulls its profiles and apps, and is ready on day one — zero‑touch enrollment cut onboarding time by 70%.",
                highlights: [
                    "Jamf Certified Tech (Jamf 200)",
                    "Zero‑touch enrollment: 70% less onboarding time",
                    "Configuration profiles, patching, Self Service and fleet hygiene"
                ],
                tools: ["Jamf Pro", "Apple Business Manager", "macOS", "Bash / zsh", "Swift", "AppleScript"]
            },
            {
                icon: "fas fa-gears",
                title: "IT Automation & Scripting",
                oneLiner: "Python, Bash and Swift against real APIs — recurring toil, removed.",
                description: "Turning manual IT work into repeatable systems. Bash, Python and TypeScript against real APIs, plus certificate and provisioning pipelines that remove recurring toil for good.",
                detail: "If a task happens twice, it becomes a script. I write Bash, Python, Swift and TypeScript against real APIs, from Jamf tooling to a centralised certificate pipeline that renews SSL for Cisco ISE, ESXi, Proxmox and HPE iLO with no manual steps.",
                highlights: [
                    "Jamf API tooling and SIEM log collectors",
                    "acme.sh / Let's Encrypt DNS-01 renewals — no manual cert toil",
                    "Scripts version-controlled and reviewed in Git"
                ],
                tools: ["Python", "Bash / zsh", "TypeScript", "Swift", "Git / GitHub", "acme.sh / Let's Encrypt"]
            },
            {
                icon: "fas fa-robot",
                title: "AI-Augmented Operations",
                oneLiner: "Gemini org-wide, Rovo Agents and AI ticket triage in Jira.",
                description: "Deploying AI that measurably reduces work — org-wide assistant rollouts, agentic automation, and AI-powered ticket triage that cuts time-to-resolution instead of adding another dashboard.",
                detail: "AI that does real work. I rolled out Google Gemini org-wide and Atlassian Rovo Agents, built an AI ticket-triage pipeline for Jira Service Management, and prototype MCP servers so assistants like Claude Code can work with IT systems directly.",
                highlights: [
                    "Org-wide Google Gemini rollout",
                    "AI ticket triage across 350+ tickets",
                    "MCP server prototypes for IT tooling"
                ],
                tools: ["Claude Code", "MCP Servers", "Google Gemini", "Grok Bot", "Atlassian Rovo", "Jira Service Management", "Slack"]
            },
            {
                icon: "fas fa-headset",
                title: "IT Service Management",
                oneLiner: "ITIL 4 service delivery: 350+ tickets resolved at 95%+ SLA.",
                description: "ITIL 4 certified service delivery: incident and request workflows, ticketing automation, SLA-driven support, and vendor escalation management for business-critical systems.",
                detail: "Support people can rely on. ITIL 4 certified, I pair clear incident and request processes with automation and documentation, so the queue stays short and answers are easy to find.",
                highlights: [
                    "ITIL 4 Foundation certified",
                    "350+ Jira tickets resolved at 95%+ SLA",
                    "40+ Confluence guides and 9 enterprise platforms administered"
                ],
                tools: ["Jira Service Management", "Confluence", "Atlassian Rovo", "Slack", "Google Workspace"]
            },
            {
                icon: "fas fa-network-wired",
                title: "Networks & Infrastructure",
                oneLiner: "Cisco ISE, Active Directory, ESXi and Proxmox — the layer under it all.",
                description: "The layer everything else depends on — Cisco ISE, Active Directory, MFA, and virtualisation on ESXi and Proxmox, with monitoring that surfaces problems before users report them.",
                detail: "The foundation under everything else: Cisco ISE network access control, identity across Active Directory and Entra ID, and virtualisation on VMware ESXi and Proxmox — with MFA, certificates and monitoring kept in order around them.",
                highlights: [
                    "Cisco ISE network access control",
                    "Identity across Active Directory and Entra ID",
                    "Virtualisation on VMware ESXi and Proxmox"
                ],
                tools: ["Cisco ISE", "Active Directory", "Microsoft Entra ID", "VMware ESXi", "Proxmox", "Linux"]
            }
        ],

        experienceTitle: "EXPERIENCE",
        experience: [
            {
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
                role: "Military Service — IT & Administrative Support",
                company: "Hellenic Army, Greece",
                duration: "November 2025 – August 2026",
                tasks: [
                    "Delivered IT operations and administrative support reporting directly to the Deputy Battalion Commander",
                    "Modernised the personnel database and upgraded battalion network infrastructure"
                ]
            },
            {
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
                role: "Web Developer",
                company: "Freelance, Greece",
                duration: "2020 – November 2023",
                tasks: [
                    "Built and launched client websites end to end: domain, DNS, SSL/TLS, hosting, MySQL, WordPress and SEO",
                    "Improved organic search visibility with structured data and performance tuning"
                ]
            },
            {
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

        educationTitle: "EDUCATION",
        education: [
            {
                degree: "Integrated Master’s (M.Eng.), Informatics & Computer Engineering",
                institution: "University of West Attica, Athens, Greece",
                duration: "September 2019 – June 2025",
                details: [
                    "Active member of the university’s Tech Society",
                    "Relevant coursework: Advanced Computer Systems, AI, Network Security, Databases, Web Development, Cloud Computing"
                ]
            },
            {
                degree: "Erasmus+ exchange semester, M.Sc. Applied Computer Science",
                institution: "SRH Hochschule Heidelberg, Germany",
                duration: "April 2023 – October 2023",
                details: ["One semester of the M.Sc. Applied Computer Science programme, on Erasmus+", "Recognised as presenter and team lead"]
            },
            {
                degree: "Jamf Certified Tech — Jamf Pro (Jamf 200)",
                institution: "Jamf",
                duration: "2026",
                kind: "certification",
                badge: "Jamf 200",
                icon: "fab fa-apple",
                featured: true,
                details: [
                    "Passed the Jamf 200 certification exam for Jamf Pro",
                    "Enrollment, inventory, policies, configuration profiles, Self Service and scoping for macOS and iOS fleets"
                ],
                link: "https://www.credly.com/badges/05e1f049-b7fb-4a92-bc2b-fd27ad861755"
            },
            {
                degree: "ITIL 4 Foundation Certificate in IT Service Management",
                institution: "PeopleCert",
                duration: "2025",
                kind: "certification",
                badge: "ITIL 4",
                details: ["Knowledge of the ITIL 4 framework", "Focus on IT service management (ITSM) best practices"],
                link: "/files/itil-v4-cert.pdf"
            },
            {
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
                degree: "Career Essentials in Generative AI",
                institution: "Microsoft & LinkedIn",
                duration: "2024",
                kind: "certification",
                details: ["Foundations of generative AI systems and responsible adoption", "Applied to enterprise AI rollouts and agentic automation"]
            }
        ],

        experienceSection: {
            title: "Career",
            subtitle: "Timeline: Work & Education",
            professional: "Professional",
            education: "Education",
            verify: "Verify Credential"
        },

        projectsSection: {
            title: "PROJECTS",
            subtitle: "SELECTED WORK",
            live: "Live",
            code: "Code",
            githubCta: "View Full Portfolio on GitHub",
            details: "Details",
            caseStudy: "Case study",
            roleLabel: "Role",
            highlightsLabel: "Highlights",
            report: "Report",
            publication: "Publication",
            close: "Close"
        },

        cinematicEntry: {
            initializing: "> INITIALIZING SYSTEM...",
            loading: "> LOADING ASSETS...",
            ready: "> READY.",
            enterSystem: "Enter System",
            skip: "Skip"
        },

        projectsTitle: "PROJECTS",
        projects: [
            {
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
                image: "/images/signature-craft/signature-craft.png",
                imageFit: "cover"
            },
            {
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
                image: "/images/portfolio-website/2026.png"
            },
            {
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
                image: "/images/thesis-presentation/thesis-image.png"
            },
            {
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
                image: "/images/raspberry-pi-adblocker-streamer/raspberry-pi.png",
                imageFit: "cover"
            },
            {
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
                image: "/images/PlanoPlus/plano.png"
            },
            {
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
                image: "/images/schiller-project/schiller.png"
            },
            {
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
                image: "/images/research-llms-human-knowledge/llm-research.png"
            },
            {
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
                image: "/images/NexusPartyApp/nexuspartyapp.png",
                device: "phone",
                imageFit: "cover"
            },
            {
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
                image: "/images/silence-hero/silence-hero.png"
            },
            {
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
                image: "/images/happyfox/happyfox-app.png",
                device: "bare",
                imageFit: "cover"
            },
            {
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
                image: "/images/friendly-wheelchair-concept/friendly-wheelchair.png",
                imageFit: "cover",
                imagePosition: "50% 62%"
            }
        ],

        keynote: {
            common: { name: "Andreas Fragkiadakis", close: "Close", newTab: "opens in a new tab" },
            nav: {
                home: "Overview", about: "About", services: "What I do", specs: "Tech specs", experience: "Career", projects: "Projects", contact: "Contact",
                cta: "Let’s talk", openMenu: "Open menu", closeMenu: "Close menu", switchLanguage: "Switch to Greek",
                toLight: "Switch to light theme", toDark: "Switch to dark theme", appearance: "Appearance", language: "Language", light: "Light", dark: "Dark"
            },
            intro: { headline: "Hello.", enter: "Enter", skip: "Skip intro" },
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
                yearsUnit: "yrs",
                stats: ["Macs managed on Jamf Pro", "less onboarding time, zero‑touch", "in IT, infrastructure and security", "SLA met across 350+ tickets"]
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
                role: "Role",
                highlights: "Highlights"
            },
            contact: {
                eyebrow: "Contact",
                headline: "Let’s build\nsomething.",
                sub: "Open to **full-time roles** and **freelance projects**.",
                send: "Send a message",
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

        contactTitle: "GET IN TOUCH",
        copyright: "© 2026 Andreas Fragkiadakis. All rights reserved."
    },

    gr: {
        name: "ΑΝΔΡΕΑΣ ΦΡΑΓΚΙΑΔΑΚΗΣ",
        title: "IT Automation Lead & Security Engineer",
        location: "Αθήνα, Ελλάδα",
        phone: "(+30) 697-345-3683",
        email: "andrewfragkiadakis@gmail.com",
        github: SOCIAL_URLS.github,
        linkedin: SOCIAL_URLS.linkedin,

        nav: {
            home: "ΑΡΧΙΚΗ",
            close: "ΚΛΕΙΣΙΜΟ",
            languageLabel: "Ελληνικά",
            about: "ΣΧΕΤΙΚΑ",
            experience: "ΕΜΠΕΙΡΙΑ",
            projects: "PROJECTS",
            services: "ΥΠΗΡΕΣΙΕΣ",
            contact: "ΕΠΙΚΟΙΝΩΝΙΑ"
        },

        about: {
            title: "ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ",
            subtitle: "// ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ",
            tagline: "Επικεφαλής Apple Fleet & IT Automation σε περιβάλλον 550+ συσκευών",
            readMore: "Διαβάστε περισσότερα",
            showLess: "Λιγότερα",
            currentFocus: "Τρεχουσα Εστιαση",
            currentFocusDetail: "Fleet Automation & Endpoint Security",
            statsLabels: ["Χρονια Εμπειριας", "Συσκευες υπο Διαχειριση", "Ταχυτερο Onboarding", "Πιστοποιησεις"],
            credentialsLabel: "Πιστοποιησεις",
            description: [
                "Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) και Team Lead της ομάδας Apple Fleet & IT Automation στην Omilia, μια παγκόσμια εταιρεία conversational AI. Έχω πλήρη ευθύνη για το Jamf Pro σε 550+ Mac και ηγούμαι του endpoint engineering για Check Point Harmony Endpoint, Microsoft Sentinel και αυτοματοποίηση πιστοποιητικών SSL.",
                "Στην πράξη: θωράκιση κατά CIS Benchmarks ενόψει ελέγχων PCI DSS και SOC 2, και zero‑touch enrollment που μείωσε τον χρόνο onboarding των Mac κατά 70%.",
                "Παράλληλα προωθώ την υιοθέτηση AI: Google Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents και ένα pipeline διαλογής αιτημάτων με AI που μείωσε τον μέσο χρόνο triage σε 350+ tickets.",
                "Jamf Certified Tech (Jamf 200) · Αδειούχος μηχανικός ΤΕΕ · ITIL 4 Foundation · Αθήνα · Αγγλικά (C2), Ελληνικά (μητρική), Γερμανικά (B2)"
            ]
        },

        hero: {
            firstName: "ΑΝΔΡΕΑΣ",
            lastName: "ΦΡΑΓΚΙΑΔΑΚΗΣ",
            typewriter: [
                "APPLE FLEET & IT AUTOMATION LEAD",
                "M.ENG. ΜΗΧΑΝΙΚΟΣ ΥΠΟΛΟΓΙΣΤΩΝ",
                "ENDPOINT SECURITY ENGINEER",
                "JAMF CERTIFIED TECH · JAMF 200",
                "ΑΔΕΙΟΥΧΟΣ ΜΗΧΑΝΙΚΟΣ (ΤΕΕ)",
                "ITIL V4 CERTIFIED",
                "INFRASTRUCTURE AUTOMATION ENGINEER",
                "AI AUTOMATION SPECIALIST"
            ],
            viewWork: "Δειτε τη Δουλεια μου",
            getInTouch: "Επικοινωνηστε μαζι μου",
            scroll: "ΣΚΡΟΛΑΡΕΤΕ ΓΙΑ ΠΛΟΗΓΗΣΗ"
        },

        contact: {
            title: "ΕΠΙΚΟΙΝΩΝΙΑ",
            subtitle: "ΕΛΑΤΕ ΣΕ ΕΠΑΦΗ ΜΑΖΙ ΜΟΥ",
            infoTitle: "Στοιχεια Επικοινωνιας",
            socialTitle: "Βρειτε με στα social",
            opportunitiesTitle: "Διαθεσιμος για νεες προκλησεις",
            opportunitiesDescription: "Freelance projects ή ενδιαφέρουσες συνεργασίες. Ας δημιουργήσουμε κάτι μοναδικό μαζί.",
            sendMessage: "Αποστολη Μηνυματος",
            downloadResume: "Ληψη Βιογραφικου",
            emailLabel: "Email",
            locationLabel: "Τοποθεσια",
            localTimeLabel: "Τοπικη ωρα",
            copyEmail: "Αντιγραφη",
            copied: "Αντιγραφηκε",
            copyFailed: "Αποτυχια"
        },

        cursor: {
            view: "Δειτε",
            verify: "Ελεγχος",
            open: "Ανοιγμα"
        },

        skillsTitle: "ΒΑΣΙΚΕΣ ΔΕΞΙΟΤΗΤΕΣ",
        skills: [
            {
                icon: "fab fa-apple",
                label: "Apple Fleet & MDM",
                detail: "Jamf Certified Tech (Jamf 200). Διαχειρίζομαι εξ ολοκλήρου το Jamf Pro για 550+ Mac: zero‑touch enrollment μέσω Apple Business Manager, configuration profiles, ενημερώσεις, Self Service και καθημερινή συντήρηση του στόλου."
            },
            {
                icon: "fas fa-shield-halved",
                label: "Endpoint Security & Identity",
                detail: "Check Point Harmony Endpoint, θωράκιση κατά CIS Benchmarks για ελέγχους PCI DSS και SOC 2, pipelines Microsoft Sentinel SIEM, και διαχείριση ταυτότητας και πρόσβασης με Microsoft Entra ID, Duo MFA και 1Password."
            },
            {
                icon: "fas fa-terminal",
                label: "IT Automation & Scripting",
                detail: "Python, Bash/zsh, Swift/AppleScript και TypeScript πάνω σε πραγματικά APIs: εργαλεία Jamf API, log collectors για SIEM και pipeline acme.sh / Let's Encrypt που κατάργησε τις χειροκίνητες ανανεώσεις πιστοποιητικών σε Cisco ISE, ESXi και Proxmox."
            },
            {
                icon: "fas fa-robot",
                label: "AI & Workflow Automation",
                detail: "Υιοθέτηση AI σε εταιρικό επίπεδο: Google Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents, Claude Code και MCP servers, καθώς και pipeline AI ticket-triage στο Jira Service Management."
            }
        ],

        servicesTitle: "ΥΠΗΡΕΣΙΕΣ",
        servicesSubtitle: "// ΕΞΕΙΔΙΚΕΥΣΗ & ΔΕΞΙΟΤΗΤΕΣ",
        servicesCta: "Εχετε ενα συγκεκριμενο project στο μυαλο σας;",
        servicesCtaButton: "Ας Μιλησουμε",
        servicesLabels: { highlights: "Στην πραξη", toolkit: "Εργαλεια", details: "Λεπτομερειες", tools: "εργαλεια" },
        services: [
            {
                icon: "fas fa-shield-halved",
                title: "Ασφάλεια Τερματικών & Συμμόρφωση",
                oneLiner: "Mac θωρακισμένα κατά CIS, με EDR, έτοιμα για ελέγχους PCI DSS και SOC 2.",
                description: "Θωράκιση στόλου συσκευών απέναντι σε πραγματικές απειλές: εφαρμογή CIS Benchmarks, ανάπτυξη και μετάβαση EDR, διαχείριση κρυπτογράφησης δίσκων και ετοιμότητα για ελέγχους PCI DSS και SOC 2.",
                detail: "Ασφάλεια που αντέχει τόσο σε έλεγχο όσο και στην παραγωγή. Εφάρμοσα θωράκιση κατά CIS Benchmarks σε όλο τον στόλο πριν από ελέγχους PCI DSS και SOC 2, ηγήθηκα της μετάβασης σε Check Point Harmony Endpoint και τροφοδοτώ το Microsoft Sentinel με telemetry τερματικών ώστε η ανίχνευση να έχει πραγματικό πλαίσιο.",
                highlights: [
                    "Θωράκιση κατά CIS Benchmarks πριν από ελέγχους PCI DSS και SOC 2",
                    "Μετάβαση EDR με επίλυση συγκρούσεων FileVault και μηδενική απώλεια δεδομένων",
                    "Pipelines Sentinel SIEM μέσω RFC 5424 + TLS"
                ],
                tools: ["Check Point Harmony Endpoint", "Microsoft Sentinel", "Jamf Pro", "Microsoft Entra ID", "Duo MFA", "1Password"]
            },
            {
                icon: "fab fa-apple",
                title: "Διαχείριση Στόλου Apple",
                oneLiner: "550+ Mac στο Jamf Pro. Zero‑touch enrollment, 70% λιγότερος χρόνος onboarding.",
                description: "Jamf Certified Tech (Jamf 200). Διαχείριση macOS σε κλίμακα με Jamf Pro και Apple Business Manager — zero‑touch enrollment, configuration profiles, στρατηγική ενημερώσεων και συντήρηση εκατοντάδων συσκευών.",
                detail: "Διαχειρίζομαι εξ ολοκλήρου το Jamf Pro για στόλο 550+ Mac. Ένα νέο Mac εγγράφεται αυτόματα μέσω Apple Business Manager, λαμβάνει profiles και εφαρμογές και είναι έτοιμο από την πρώτη μέρα — το zero‑touch enrollment μείωσε τον χρόνο onboarding κατά 70%.",
                highlights: [
                    "Jamf Certified Tech (Jamf 200)",
                    "Zero‑touch enrollment: 70% λιγότερος χρόνος onboarding",
                    "Configuration profiles, ενημερώσεις, Self Service και συντήρηση στόλου"
                ],
                tools: ["Jamf Pro", "Apple Business Manager", "macOS", "Bash / zsh", "Swift", "AppleScript"]
            },
            {
                icon: "fas fa-gears",
                title: "Αυτοματισμός IT & Scripting",
                oneLiner: "Python, Bash και Swift πάνω σε πραγματικά APIs — τέλος στη χειροκίνητη δουλειά.",
                description: "Μετατροπή χειροκίνητων εργασιών IT σε επαναλήψιμα συστήματα. Bash, Python και TypeScript πάνω σε πραγματικά APIs, με pipelines πιστοποιητικών και provisioning που εξαλείφουν την επαναλαμβανόμενη εργασία.",
                detail: "Ό,τι γίνεται δύο φορές, γίνεται script. Γράφω Bash, Python, Swift και TypeScript πάνω σε πραγματικά APIs, από εργαλεία Jamf έως ένα κεντρικό pipeline που ανανεώνει πιστοποιητικά SSL για Cisco ISE, ESXi, Proxmox και HPE iLO χωρίς χειροκίνητα βήματα.",
                highlights: [
                    "Εργαλεία Jamf API και log collectors για SIEM",
                    "Ανανεώσεις acme.sh / Let's Encrypt DNS-01 — χωρίς χειροκίνητη διαχείριση πιστοποιητικών",
                    "Scripts με version control και review στο Git"
                ],
                tools: ["Python", "Bash / zsh", "TypeScript", "Swift", "Git / GitHub", "acme.sh / Let's Encrypt"]
            },
            {
                icon: "fas fa-robot",
                title: "Λειτουργίες IT με AI",
                oneLiner: "Gemini σε όλο τον οργανισμό, Rovo Agents και διαλογή αιτημάτων με AI στο Jira.",
                description: "Ανάπτυξη AI που μειώνει μετρήσιμα τον φόρτο εργασίας — εταιρικά rollouts βοηθών, agentic automation και διαλογή αιτημάτων με AI που μειώνει τον χρόνο επίλυσης.",
                detail: "AI που κάνει πραγματική δουλειά. Εισήγαγα το Google Gemini σε όλο τον οργανισμό και τους Atlassian Rovo Agents, δημιούργησα pipeline διαλογής αιτημάτων με AI για το Jira Service Management και αναπτύσσω prototypes MCP servers ώστε βοηθοί όπως το Claude Code να δουλεύουν απευθείας με τα συστήματα IT.",
                highlights: [
                    "Ανάπτυξη Google Gemini σε όλο τον οργανισμό",
                    "Διαλογή αιτημάτων με AI σε 350+ tickets",
                    "Prototypes MCP servers για εργαλεία IT"
                ],
                tools: ["Claude Code", "MCP Servers", "Google Gemini", "Grok Bot", "Atlassian Rovo", "Jira Service Management", "Slack"]
            },
            {
                icon: "fas fa-headset",
                title: "IT Service Management",
                oneLiner: "Υπηρεσίες IT κατά ITIL 4: 350+ tickets με SLA άνω του 95%.",
                description: "Παροχή υπηρεσιών με πιστοποίηση ITIL 4: ροές incident και request, αυτοματισμός ticketing, υποστήριξη βάσει SLA και διαχείριση κρίσιμων vendor escalations.",
                detail: "Υποστήριξη στην οποία μπορεί κανείς να βασιστεί. Με πιστοποίηση ITIL 4, συνδυάζω σαφείς διαδικασίες incident και request με αυτοματισμό και τεκμηρίωση, ώστε η ουρά να μένει μικρή και οι απαντήσεις να βρίσκονται εύκολα.",
                highlights: [
                    "Πιστοποίηση ITIL 4 Foundation",
                    "350+ Jira tickets με SLA 95%+",
                    "40+ οδηγοί Confluence και διαχείριση 9 εταιρικών πλατφορμών"
                ],
                tools: ["Jira Service Management", "Confluence", "Atlassian Rovo", "Slack", "Google Workspace"]
            },
            {
                icon: "fas fa-network-wired",
                title: "Δίκτυα & Υποδομές",
                oneLiner: "Cisco ISE, Active Directory, ESXi και Proxmox — η βάση κάτω από όλα.",
                description: "Το επίπεδο πάνω στο οποίο στηρίζονται όλα — Cisco ISE, Active Directory, MFA και virtualization σε ESXi και Proxmox, με monitoring που εντοπίζει προβλήματα πριν τα αναφέρουν οι χρήστες.",
                detail: "Η βάση πάνω στην οποία στηρίζονται όλα: έλεγχος πρόσβασης δικτύου με Cisco ISE, ταυτότητα σε Active Directory και Entra ID, και virtualization σε VMware ESXi και Proxmox — με MFA, πιστοποιητικά και monitoring σε τάξη γύρω τους.",
                highlights: [
                    "Έλεγχος πρόσβασης δικτύου με Cisco ISE",
                    "Ταυτότητα σε Active Directory και Entra ID",
                    "Virtualization σε VMware ESXi και Proxmox"
                ],
                tools: ["Cisco ISE", "Active Directory", "Microsoft Entra ID", "VMware ESXi", "Proxmox", "Linux"]
            }
        ],

        experienceTitle: "ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΕΜΠΕΙΡΙΑ",
        experience: [
            {
                role: "Team Lead, Apple Fleet & IT Automation",
                company: "Omilia, Αθήνα",
                duration: "Απρίλιος 2026 – Σήμερα",
                tasks: [
                    "Πλήρης ευθύνη για τον τομέα Apple Fleet & IT Automation, την πλατφόρμα Jamf Pro και τα AI pipelines σε 550+ τερματικά macOS",
                    "Ηγεσία automation engineering σε Bash, Python και TypeScript — Jamf API, διαλογή αιτημάτων με AI, prototypes MCP servers και υποδομή ανανέωσης SSL",
                    "Συνεργασία με Cyber, HR, Finance και Engineering για ταχύτερο onboarding, λιγότερα tickets και μηδενική χειροκίνητη διαχείριση πιστοποιητικών"
                ]
            },
            {
                role: "IT Engineer",
                company: "Omilia, Αθήνα",
                duration: "Σεπτέμβριος 2024 – Μάιος 2026",
                tasks: [
                    "Σχεδίαση zero‑touch enrollment με Jamf Pro και Apple Business Manager για στόλο 550+ Mac — μείωση χρόνου onboarding κατά 70%",
                    "Εφαρμογή θωράκισης CIS Benchmark σε όλο τον στόλο σε συνεργασία με το τμήμα Cyber — πλήρης συμμόρφωση ενόψει ελέγχων PCI DSS και SOC 2",
                    "Ηγεσία εταιρικής μετάβασης EDR σε Check Point Harmony Endpoint σε 550+ συσκευές, με επίλυση συγκρούσεων FileVault χωρίς καμία απώλεια δεδομένων",
                    "Κατασκευή κεντρικού pipeline ανανέωσης πιστοποιητικών (acme.sh, Let's Encrypt, DNS-01) για υποδομές δικτύου, virtualization και διαχείρισης servers — τέλος στις χειροκίνητες ανανεώσεις",
                    "Υλοποίηση ενσωμάτωσης Microsoft Sentinel SIEM με Python log collectors (RFC 5424 μέσω TLS) για telemetry τερματικών και πρόσβασης",
                    "Προώθηση εταιρικής υιοθέτησης AI: Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents και pipeline διαλογής αιτημάτων με AI",
                    "Επίλυση 350+ Jira tickets με SLA 95%+, συγγραφή 40+ οδηγών Confluence και διαχείριση 9 εταιρικών πλατφορμών"
                ]
            },
            {
                role: "Στρατιωτική θητεία — IT & διοικητική υποστήριξη",
                company: "Ελληνικός Στρατός",
                duration: "Νοέμβριος 2025 – Αύγουστος 2026",
                tasks: [
                    "Παροχή υπηρεσιών IT operations και διοικητικής υποστήριξης με αναφορά απευθείας στον Υποδιοικητή Τάγματος",
                    "Εκσυγχρονισμός βάσης δεδομένων προσωπικού και αναβάθμιση δικτυακής υποδομής τάγματος"
                ]
            },
            {
                role: "IT Support & Infrastructure Coordinator",
                company: "Keep Eat Healthy, Κορωπί",
                duration: "Μάιος 2022 – Νοέμβριος 2025",
                tasks: [
                    "Πλήρης ευθύνη IT για υβριδικό γραφείο: δίκτυο, ασφάλεια τερματικών, κύκλος ζωής εξοπλισμού και συντονισμός προμηθευτών",
                    "Επέκταση του μέσου χρόνου ζωής των συσκευών κατά 18 μήνες μέσω προληπτικής συντήρησης",
                    "Μετάβαση από έντυπες ροές σε Google Workspace και WordPress, με μείωση διοικητικού φόρτου"
                ]
            },
            {
                role: "IT Support Specialist",
                company: "Anemomyloi Andros, Άνδρος",
                duration: "Ιανουάριος 2023 – Φεβρουάριος 2024",
                tasks: [
                    "Ψηφιοποίηση καθημερινών λειτουργιών με μεταφορά ολόκληρου του εταιρικού αρχείου από έντυπη μορφή σε Google Drive",
                    "Διαχείριση πλατφόρμας κρατήσεων και τιμολόγησης, με ψηφιακή έκδοση παραστατικών",
                    "Πλήρως απομακρυσμένη τεχνική υποστήριξη και συμβουλευτική για ψηφιακές αναβαθμίσεις"
                ]
            },
            {
                role: "Web Developer",
                company: "Freelance, Ελλάδα",
                duration: "2020 – Νοέμβριος 2023",
                tasks: [
                    "Ανάπτυξη ιστοσελίδων end-to-end: domain, DNS, SSL/TLS, hosting, MySQL, WordPress και SEO",
                    "Βελτίωση της οργανικής προβολής στις μηχανές αναζήτησης με structured data και βελτιστοποίηση απόδοσης"
                ]
            },
            {
                role: "Network Systems Technician",
                company: "Weballdesign, Αθήνα",
                duration: "2020 – Νοέμβριος 2022",
                tasks: [
                    "Εγκατάσταση και παραμετροποίηση συστημάτων server/client σε εκπαιδευτικά ιδρύματα",
                    "Συντήρηση δικτυακού εξοπλισμού (routers, switches, UPS) και διαγνωστικοί έλεγχοι",
                    "Εκπαίδευση προσωπικού και τεκμηρίωση διαδικασιών"
                ]
            }
        ],

        educationTitle: "ΕΚΠΑΙΔΕΥΣΗ",
        education: [
            {
                degree: "Δίπλωμα Μηχανικού Πληροφορικής και Υπολογιστών (Integrated Master)",
                institution: "Πανεπιστήμιο Δυτικής Αττικής",
                duration: "Σεπτέμβριος 2019 – Ιούνιος 2025",
                details: [
                    "Ενεργό μέλος του Tech Society του πανεπιστημίου",
                    "Σχετικά μαθήματα: Προηγμένα Υπολογιστικά Συστήματα, AI, Ασφάλεια Δικτύων, Βάσεις Δεδομένων, Web Development, Cloud Computing"
                ]
            },
            {
                degree: "Εξάμηνο Erasmus+, M.Sc. Applied Computer Science",
                institution: "SRH Hochschule Heidelberg, Γερμανία",
                duration: "Απρίλιος 2023 – Οκτώβριος 2023",
                details: ["Ένα εξάμηνο του προγράμματος M.Sc. Applied Computer Science, μέσω Erasmus+", "Διάκριση ως ομιλητής και επικεφαλής ομάδας"]
            },
            {
                degree: "Jamf Certified Tech — Jamf Pro (Jamf 200)",
                institution: "Jamf",
                duration: "2026",
                kind: "certification",
                badge: "Jamf 200",
                icon: "fab fa-apple",
                featured: true,
                details: [
                    "Επιτυχία στις εξετάσεις πιστοποίησης Jamf 200 για το Jamf Pro",
                    "Enrollment, inventory, policies, configuration profiles, Self Service και scoping για στόλους macOS και iOS"
                ],
                link: "https://www.credly.com/badges/05e1f049-b7fb-4a92-bc2b-fd27ad861755"
            },
            {
                degree: "ITIL 4 Foundation Certificate in IT Service Management",
                institution: "PeopleCert",
                duration: "2025",
                kind: "certification",
                badge: "ITIL 4",
                details: ["Πιστοποίηση στο πλαίσιο ITIL 4", "Έμφαση στις βέλτιστες πρακτικές διαχείρισης υπηρεσιών πληροφορικής (ITSM)"],
                link: "/files/itil-v4-cert.pdf"
            },
            {
                degree: "Άδεια Άσκησης Επαγγέλματος — Μηχανικός Πληροφορικής & Υπολογιστών",
                institution: "Τεχνικό Επιμελητήριο Ελλάδας (ΤΕΕ)",
                duration: "2025",
                kind: "license",
                badge: "ΤΕΕ",
                details: [
                    "Θεσμοθετημένη άδεια άσκησης επαγγέλματος Μηχανικού Πληροφορικής και Υπολογιστών στην Ελλάδα",
                    "Προϋποθέτει πενταετές ενιαίο και αδιάσπαστο μεταπτυχιακό δίπλωμα"
                ]
            },
            {
                degree: "Career Essentials in Generative AI",
                institution: "Microsoft & LinkedIn",
                duration: "2024",
                kind: "certification",
                details: ["Θεμέλια συστημάτων generative AI και υπεύθυνη υιοθέτηση", "Εφαρμογή σε εταιρικά rollouts AI και agentic automation"]
            }
        ],

        experienceSection: {
            title: "ΚΑΡΙΕΡΑ",
            subtitle: "ΧΡΟΝΟΛΟΓΙΟ: ΕΡΓΑΣΙΑ & ΕΚΠΑΙΔΕΥΣΗ",
            professional: "ΕΠΑΓΓΕΛΜΑΤΙΚΗ",
            education: "ΕΚΠΑΙΔΕΥΣΗ",
            verify: "ΠΙΣΤΟΠΟΙΗΣΗ"
        },

        projectsSection: {
            title: "PROJECTS",
            subtitle: "ΕΠΙΛΕΓΜΕΝΑ ΕΡΓΑ",
            live: "Live",
            code: "Code",
            githubCta: "Δειτε το πληρες Portfolio στο GitHub",
            details: "Λεπτομερειες",
            caseStudy: "Μελετη περιπτωσης",
            roleLabel: "Ρολος",
            highlightsLabel: "Βασικα Σημεια",
            report: "Αναφορα",
            publication: "Δημοσιευση",
            close: "Κλεισιμο"
        },

        cinematicEntry: {
            initializing: "> ΕΚΚΙΝΗΣΗ ΣΥΣΤΗΜΑΤΟΣ...",
            loading: "> ΦΟΡΤΩΣΗ ΑΡΧΕΙΩΝ...",
            ready: "> ΕΤΟΙΜΟ.",
            enterSystem: "Εισοδος στο Συστημα",
            skip: "Παραλειψη"
        },

        projectsTitle: "PROJECTS",
        projects: [
            {
                name: "Signature Craft",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Email Signatures"],
                description: "Εργαλείο δημιουργίας email signatures με 32+ templates. Υπογραφές που εμφανίζονται σωστά σε Gmail, Outlook, Apple Mail, Yahoo και Thunderbird — δωρεάν, χωρίς εγγραφή.",
                role: "Ατομικός σχεδιασμός και υλοποίηση",
                detail: "Εργαλείο δημιουργίας email signatures για ένα πρόβλημα που έχουν όλες οι εταιρείες: υπογραφές που «σπάνε» μόλις φύγουν από τον υπολογιστή. Παράγει HTML βασισμένο σε πίνακες που εμφανίζεται σωστά στους βασικούς mail clients, χωρίς εγγραφή, χωρίς συνδρομή και χωρίς tracking.",
                highlights: [
                    "32+ templates: εταιρικά, minimal και δημιουργικά",
                    "HTML ελεγμένο σε Gmail, Outlook, Apple Mail, Yahoo και Thunderbird",
                    "Δωρεάν, χωρίς εγγραφή και χωρίς tracking",
                    "Ζωντανή προεπισκόπηση με αντιγραφή με ένα κλικ"
                ],
                liveSiteLink: "https://signature-craft-tau.vercel.app/",
                image: "/images/signature-craft/signature-craft.png",
                imageFit: "cover"
            },
            {
                name: "Προσωπική Ιστοσελίδα Portfolio",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"],
                description: "Αυτή η ιστοσελίδα: ένα portfolio σαν παρουσίαση προϊόντος. Επτά διαφάνειες σε έναν οριζόντιο άξονα στο desktop, καθαρή κάθετη διάταξη στο κινητό, στα ελληνικά και στα αγγλικά, σε φωτεινό και σκοτεινό θέμα.",
                role: "Ατομικός σχεδιασμός και υλοποίηση",
                detail: "Αυτή η ιστοσελίδα, σχεδιασμένη σαν σελίδα παρουσίασης προϊόντος. Στο desktop, επτά διαφάνειες κινούνται σε έναν οριζόντιο άξονα με snapping και πλοήγηση με τελείες. Σε tablet και κινητό γίνονται κάθετη διάταξη με διαλόγους bottom sheet. Πλήρως δίγλωσση, με φωτεινό και σκοτεινό θέμα, και προσβάσιμη: πλοήγηση από πληκτρολόγιο, ορατή εστίαση παντού και σεβασμός στη ρύθμιση reduced motion.",
                highlights: [
                    "Οριζόντιος άξονας επτά διαφανειών με snapping και πλοήγηση με τελείες",
                    "Διάλογοι bottom sheet και gallery με snapping στο κινητό",
                    "Πλήρες δίγλωσσο περιεχόμενο EN/GR με φωτεινό και σκοτεινό θέμα",
                    "Πλοήγηση από πληκτρολόγιο και υποστήριξη reduced motion"
                ],
                liveSiteLink: "https://andreas.technology",
                githubLink: "https://github.com/Andrewfragkiadakis/Portfolio-Webpage",
                image: "/images/portfolio-website/2026.png"
            },
            {
                name: "Radio over Fiber για 5G - Διπλωματική Εργασία",
                year: 2025,
                tags: ["Διπλωματική", "5G", "Radio over Fiber", "Έρευνα"],
                description: "Διπλωματική εργασία για το Radio over Fiber: πού τα υβριδικά ασύρματα-οπτικά δίκτυα αλλάζουν το κόστος του 5G. Συνοδεύεται από διαδραστική παρουσίαση.",
                role: "Μοναδικός ερευνητής · Διπλωματική M.Eng., Πανεπιστήμιο Δυτικής Αττικής",
                detail: "Έρευνα σε υβριδικά ασύρματα-οπτικά δίκτυα πρόσβασης για 5G, με επίκεντρο το Radio over Fiber ως τρόπο μεταφοράς της επεξεργασίας σήματος εκτός του σημείου κεραίας. Συγκρίνει κατανεμημένες και κεντρικοποιημένες αρχιτεκτονικές RAN και αξιολογεί πού η οπτική μετάδοση αλλάζει ουσιαστικά το συνολικό κόστος κτήσης. Δημοσιεύτηκε ως «New Hybrid Wireless Optical Networks (Radio Over Fiber) for 5G Networks».",
                highlights: [
                    "Σύγκριση μοντέλων D-RAN και C-RAN ως προς κόστος και χωρητικότητα",
                    "Αξιολόγηση μετάδοσης WDM για ενοποίηση fronthaul",
                    "Πλήρης ανάλυση TCO και μελέτη ενοποιημένης υποδομής",
                    "Παρουσίαση ως διαδραστικό deck παράλληλα με τη γραπτή εργασία"
                ],
                liveSiteLink: "/thesis-presentation",
                reportLink: "https://drive.usercontent.google.com/download?id=1iayG5SCoUykioRzLPl1BeOkO7iwxxHkD&export=download&authuser=0",
                image: "/images/thesis-presentation/thesis-image.png"
            },
            {
                name: "Raspberry Pi Adblocker & Streamer",
                year: 2024,
                tags: ["Raspberry Pi", "Linux", "Networking", "Pi-hole", "Plex"],
                description: "Παραμετροποίηση Raspberry Pi για αποκλεισμό διαφημίσεων σε όλο το δίκτυο (Pi-hole) και media streaming (Plex) στο σπίτι.",
                role: "Ατομική υλοποίηση · Home lab",
                detail: "Ένα Raspberry Pi με δύο ρόλους: αποκλεισμός διαφημίσεων σε επίπεδο δικτύου με Pi-hole και media streaming με Plex. Πρακτική άσκηση στο να βγάζεις χρήσιμη, μόνιμα διαθέσιμη υποδομή από ελάχιστο υλικό, και στη δουλειά DNS, δικτύου και υπηρεσιών που τη διατηρεί σε λειτουργία.",
                highlights: [
                    "Αποκλεισμός διαφημίσεων σε επίπεδο DNS για όλο το δίκτυο",
                    "Plex media server για τοπικό streaming",
                    "Λειτουργεί αδιάλειπτα σε υλικό χαμηλής κατανάλωσης",
                    "Πρακτική εμπειρία σε διαχείριση υπηρεσιών Linux και δικτύων"
                ],
                image: "/images/raspberry-pi-adblocker-streamer/raspberry-pi.png",
                imageFit: "cover"
            },
            {
                name: "Plano Plus - Επιγραφές & Οπτική Ταυτότητα",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend"],
                description: "Γρήγορη, premium ιστοσελίδα για στούντιο επιγραφών και οπτικής ταυτότητας στην Κρήτη, με Next.js και φόρμα επικοινωνίας που φτάνει κατευθείαν στο inbox του πελάτη.",
                role: "Ατομικός σχεδιασμός και υλοποίηση · Έργο πελάτη",
                detail: "Πλήρης ιστοσελίδα για στούντιο επιγραφών και οπτικής ταυτότητας στην Κρήτη, με Next.js App Router. Ζητούμενο ήταν μια παραδοσιακή επιχείρηση επιγραφών να δείχνει online τόσο προσεγμένη όσο η δουλειά της στον δρόμο. Περιλαμβάνει light/dark theme, parallax, smooth scrolling και φόρμα επικοινωνίας με αποστολή email.",
                highlights: [
                    "Next.js App Router με light/dark theme και parallax",
                    "Φόρμα επικοινωνίας με αποστολή email μέσω Resend",
                    "Βελτιστοποίηση για τοπική αναζήτηση σε όλη την Κρήτη",
                    "Σε λειτουργία, εξυπηρετεί πραγματικά αιτήματα πελατών"
                ],
                liveSiteLink: "https://www.planoplus.gr/",
                image: "/images/PlanoPlus/plano.png"
            },
            {
                name: "Ιστοσελίδα Κέντρων Ξένων Γλωσσών Schiller",
                year: 2026,
                tags: ["Wix", "Wix Studio", "Web Development", "Εκπαίδευση"],
                description: "Η ιστοσελίδα των κέντρων ξένων γλωσσών Schiller στο Ρέθυμνο: προγράμματα Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής, που ενημερώνει το ίδιο το προσωπικό της σχολής.",
                role: "Ατομική υλοποίηση · Έργο πελάτη",
                detail: "Η ιστοσελίδα των κέντρων ξένων γλωσσών Schiller στο Ρέθυμνο, με προγράμματα Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής. Υλοποιήθηκε σε Wix Studio ώστε το προσωπικό της σχολής να ενημερώνει μόνο του τα προγράμματα χωρίς να χρειάζεται προγραμματιστή.",
                highlights: [
                    "Κατάλογος προγραμμάτων σε Αγγλικά, Γερμανικά και Εκπαιδευτική Ρομποτική",
                    "Σχεδιασμένη για αυτόνομη συντήρηση από μη τεχνικό προσωπικό",
                    "Δομημένη για τοπική αναζήτηση στο Ρέθυμνο",
                    "Σε πλήρη λειτουργία από τη σχολή"
                ],
                liveSiteLink: "https://www.schiller.edu.gr/",
                image: "/images/schiller-project/schiller.png"
            },
            {
                name: "LLMs & Ανθρώπινη Γνώση - Ερευνητική ανασκόπηση",
                year: 2024,
                tags: ["Έρευνα", "Cognitive Science", "LLMs", "GPT-3"],
                description: "Ερευνητική ανασκόπηση: αποδίδει το GPT-3 πεποιθήσεις όπως οι άνθρωποι; Βασίζεται στη μελέτη των Trott et al. με το False Belief Task στο Cognitive Science (2023).",
                role: "Ερευνητική ανασκόπηση · Πηγή: Trott et al., Cognitive Science 47(7), 2023",
                detail: "Ανασκόπηση της σύγκρισης GPT-3 και ανθρώπων στο False Belief Task, καθιερωμένο τεστ της αναπτυξιακής ψυχολογίας για τη θεωρία του νου. Το ερώτημα: ένα γλωσσικό μοντέλο που γράφει με ευχέρεια για πεποιθήσεις όντως τις αποδίδει ή απλώς αναγνωρίζει μοτίβα; Βασίζεται στη μελέτη «Do Large Language Models Know What Humans Know?» των Trott, Jones, Chang, Michaelov και Bergen (Cognitive Science, 2023).",
                highlights: [
                    "GPT-3 έναντι ανθρώπινων επιδόσεων στο False Belief Task",
                    "Μεθοδολογία αναπτυξιακής ψυχολογίας στην αξιολόγηση μοντέλων",
                    "Τι δείχνουν τα αποτελέσματα για τη θεωρία του νου μέσα από τη γλώσσα",
                    "Πηγή: μελέτη με κριτές στο Cognitive Science (Wiley, 2023)"
                ],
                reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
                publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
                image: "/images/research-llms-human-knowledge/llm-research.png"
            },
            {
                name: "Nexus Party App",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "PWA"],
                description: "Έξι ελληνικά παιχνίδια για πάρτι σε μία εγκαταστάσιμη PWA — Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor και Truth or Dare — με αυτόματη βαθμολογία, χρονόμετρα και δικούς σας κανόνες.",
                role: "Ατομικός σχεδιασμός και υλοποίηση",
                detail: "Ελληνική συλλογή παιχνιδιών για πάρτι που συγκεντρώνει έξι multiplayer παιχνίδια σε μία εγκαταστάσιμη PWA. Λύνει ένα πραγματικό πρόβλημα στις παρέες: κανείς δεν θέλει να κατεβάσει έξι εφαρμογές. Αναλαμβάνει βαθμολογία, χρονομέτρηση και ρυθμίσεις ώστε η παρέα να παίζει αντί να μαλώνει για τους κανόνες.",
                highlights: [
                    "Έξι παιχνίδια: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, Truth or Dare",
                    "Εγκαταστάσιμη PWA που λειτουργεί offline",
                    "Αυτόματη βαθμολογία, χρονόμετρα και παραμετροποιήσιμοι κανόνες",
                    "Διαχείριση κατάστασης με Zustand, animations με Framer Motion"
                ],
                liveSiteLink: "https://nexus-party-app.vercel.app/",
                image: "/images/NexusPartyApp/nexuspartyapp.png",
                device: "phone",
                imageFit: "cover"
            },
            {
                name: "Silence Hero - Chrome Extension",
                year: 2024,
                tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "Επέκταση Chrome που δείχνει με μια ματιά αν είναι ώρες κοινής ησυχίας, με αντίστροφη μέτρηση για την επόμενη αλλαγή.",
                role: "Ατομική υλοποίηση",
                detail: "Μικρή επέκταση Chrome με έναν και μόνο σκοπό: παρακολουθεί τις ώρες κοινής ησυχίας στην Ελλάδα και δείχνει με μια ματιά αν είναι καλή στιγμή να τρυπήσετε τον τοίχο. Οπτική ένδειξη και ζωντανή αντίστροφη μέτρηση.",
                highlights: [
                    "Ζωντανή αντίστροφη μέτρηση για την επόμενη αλλαγή",
                    "Άμεση οπτική ένδειξη στη γραμμή εργαλείων",
                    "Υποστήριξη εποχικών διαφορών στο ωράριο κοινής ησυχίας",
                    "Χωρίς περιττά δικαιώματα πρόσβασης"
                ],
                githubLink: "https://github.com/Andrewfragkiadakis/Silence-Hero",
                image: "/images/silence-hero/silence-hero.png"
            },
            {
                name: "HappyFox - Εφαρμογή Ψυχικής Υγείας",
                year: 2023,
                tags: ["UI/UX Design", "Figma", "Ομαδικό έργο", "SRH Heidelberg"],
                description: "Concept εφαρμογής ψυχικής υγείας για μέρες χαμηλής ενέργειας, με καθημερινό check-in που ολοκληρώνεται σε λιγότερο από ένα λεπτό. Ομαδικό έργο στο SRH Heidelberg.",
                role: "Ομαδικό έργο · Σχεδιασμός UI/UX, SRH Heidelberg",
                detail: "Concept εφαρμογής ψυχικής υγείας που αναπτύχθηκε σε μεταπτυχιακό μάθημα στο SRH Heidelberg. Η ομάδα εστίασε στον σχεδιασμό για ανθρώπους σε κατάσταση χαμηλής ενέργειας: λιγότερα εμπόδια, χωρίς επικριτική γλώσσα, με καθημερινό check-in που ολοκληρώνεται σε λιγότερο από ένα λεπτό.",
                highlights: [
                    "Ολοκληρωμένο concept UI/UX σχεδιασμένο σε Figma",
                    "Σχεδιασμός γύρω από καθημερινά check-in χαμηλής προσπάθειας",
                    "Ομαδικό έργο με βραβευμένη παρουσίαση",
                    "Έμφαση σε προσβάσιμο και μη επικριτικό σχεδιασμό"
                ],
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png",
                device: "bare",
                imageFit: "cover"
            },
            {
                name: "The Friendly Wheelchair (Concept)",
                year: 2023,
                tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
                description: "Πλάνο διαχείρισης έργου και τεχνικές προδιαγραφές για αυτόνομο αναπηρικό αμαξίδιο με AI, για τις κλινικές της Χαϊδελβέργης.",
                role: "Επικεφαλής διαχείρισης έργου · SRH Heidelberg",
                detail: "Πλάνο διαχείρισης έργου και τεχνικές προδιαγραφές για αυτόνομο αναπηρικό αμαξίδιο με υποστήριξη AI, για τις κλινικές της Χαϊδελβέργης. Δεν επρόκειτο για prototype: κάλυπτε αντικείμενο, κινδύνους, χαρτογράφηση εμπλεκομένων, κανονιστικές παραμέτρους και σχεδιασμό παράδοσης για ιατροτεχνολογικό βοήθημα.",
                highlights: [
                    "Πλήρες πλάνο διαχείρισης έργου σε πλαίσιο Agile/SCRUM",
                    "Τεχνική προδιαγραφή για πλοήγηση AI και αλληλεπίδραση NLP",
                    "Ανάλυση κινδύνων και εμπλεκομένων για κλινικό περιβάλλον",
                    "Σχεδιασμός εντός περιορισμών healthcare IT"
                ],
                reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
                image: "/images/friendly-wheelchair-concept/friendly-wheelchair.png",
                imageFit: "cover",
                imagePosition: "50% 62%"
            }
        ],

        keynote: {
            common: { name: "Ανδρέας Φραγκιαδάκης", close: "Κλείσιμο", newTab: "ανοίγει σε νέα καρτέλα" },
            nav: {
                home: "Επισκόπηση", about: "Σχετικά", services: "Υπηρεσίες", specs: "Εργαλεία", experience: "Καριέρα", projects: "Projects", contact: "Επικοινωνία",
                cta: "Ας μιλήσουμε", openMenu: "Άνοιγμα μενού", closeMenu: "Κλείσιμο μενού", switchLanguage: "Switch to English",
                toLight: "Αλλαγή σε φωτεινό θέμα", toDark: "Αλλαγή σε σκοτεινό θέμα", appearance: "Εμφάνιση", language: "Γλώσσα", light: "Φωτεινό", dark: "Σκοτεινό"
            },
            intro: { headline: "Γεια σας.", enter: "Είσοδος", skip: "Παράλειψη εισαγωγής" },
            hero: {
                headline: "Στόλοι Apple.\n*Αυτοματοποιημένοι.*",
                sub: "Ηγούμαι της ομάδας Apple Fleet & IT Automation στην Omilia: **550+ Mac** στο Jamf Pro, με **zero‑touch** enrollment και θωράκιση κατά CIS Benchmarks.",
                viewWork: "Δείτε τη δουλειά μου",
                contact: "Επικοινωνία",
                note: "Jamf Certified Tech (Jamf 200) · Αθήνα, Ελλάδα"
            },
            about: {
                eyebrow: "Σχετικά",
                headline: "Γνωρίστε τον Ανδρέα.",
                bio: "Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.), επικεφαλής Apple Fleet & IT Automation στην Omilia, μια παγκόσμια εταιρεία conversational AI. Έχω **πλήρη ευθύνη για το Jamf Pro**, θωρακίζω τον στόλο κατά CIS Benchmarks και μετατρέπω **κάθε επαναλαμβανόμενη εργασία** σε κώδικα.",
                fullStory: "Διαβάστε ολόκληρη την ιστορία",
                dialogTitle: "Σχετικά με τον Ανδρέα",
                credentials: "Πιστοποιήσεις",
                focus: "Τομείς εστίασης",
                yearsUnit: "έτη",
                stats: ["Mac υπό διαχείριση στο Jamf Pro", "λιγότερος χρόνος onboarding, zero‑touch", "στο IT, τις υποδομές και την ασφάλεια", "τήρηση SLA σε 350+ tickets"]
            },
            services: {
                eyebrow: "Υπηρεσίες",
                headline: "Συμβαίνει δύο φορές;\nΓίνεται script.",
                learnMore: "Μάθετε περισσότερα",
                ctaLead: "Έχετε κάποιο project στο μυαλό σας;",
                ctaLink: "Ας μιλήσουμε",
                highlights: "Στην πράξη",
                toolkit: "Εργαλεία"
            },
            specs: {
                eyebrow: "Εργαλεία",
                headline: "Η εργαλειοθήκη.",
                sub: "Εργαλεία καθημερινής χρήσης, ανά τομέα.",
                groups: { apple: "Στόλος Apple", security: "Ασφάλεια & ταυτότητα", infra: "Υποδομές", code: "Κώδικας", ai: "AI", collab: "Συνεργασία & ITSM" }
            },
            experience: {
                eyebrow: "Καριέρα",
                headline: "Τότε. Τώρα.",
                now: "Τώρα",
                then: "Τότε",
                education: "Εκπαίδευση & πιστοποιήσεις",
                more: "Λεπτομέρειες ρόλου",
                verify: "Επαλήθευση",
                tasks: "Τι περιλάμβανε ο ρόλος",
                details: "Λεπτομέρειες"
            },
            projects: {
                eyebrow: "Projects",
                headline: "Επιλεγμένα έργα.",
                learnMore: "Μάθετε περισσότερα",
                visit: "Επίσκεψη",
                code: "Κώδικας",
                report: "Αναφορά",
                publication: "Δημοσίευση",
                github: "Περισσότερα στο GitHub",
                lineup: "Όλα τα projects",
                role: "Ρόλος",
                highlights: "Βασικά σημεία"
            },
            contact: {
                eyebrow: "Επικοινωνία",
                headline: "Ας φτιάξουμε\nκάτι μαζί.",
                sub: "Ανοιχτός σε **θέσεις πλήρους απασχόλησης** και **freelance projects**.",
                send: "Αποστολή μηνύματος",
                resume: "Λήψη βιογραφικού",
                email: "Email",
                location: "Τοποθεσία",
                time: "Τοπική ώρα",
                elsewhere: "Βρείτε με",
                copy: "Αντιγραφή",
                copied: "Αντιγράφηκε",
                copyFailed: "Η αντιγραφή απέτυχε"
            }
        },

        contactTitle: "ΕΠΙΚΟΙΝΩΝΙΑ",
        copyright: "© 2026 Ανδρέας Φραγκιαδάκης. Με την επιφύλαξη παντός δικαιώματος."
    }
}
