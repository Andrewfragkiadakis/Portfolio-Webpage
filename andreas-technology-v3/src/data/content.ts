export interface Skill {
    icon: string
    label: string
    detail: string
}

export interface Service {
    icon: string
    title: string
    description: string
}

export interface Experience {
    role: string
    company: string
    duration: string
    tasks: string[]
}

export interface Education {
    degree: string
    institution: string
    duration: string
    details: string[]
    link?: string
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
    }
    skillsTitle: string
    skills: Skill[]
    servicesTitle: string
    servicesSubtitle: string
    servicesCta: string
    servicesCtaButton: string
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
            tagline: "Leading Apple Fleet & IT Automation across a 400+ device environment",
            readMore: "Read more",
            showLess: "Show less",
            currentFocus: "Current Focus",
            currentFocusDetail: "Fleet Automation & Endpoint Security",
            statsLabels: ["Years Experience", "Endpoints Managed", "Faster Onboarding", "Languages"],
            description: [
                "I am an IT & Computer Engineer (M.Eng.) leading Apple Fleet & IT Automation at Omilia, a global conversational-AI company, across a 400+ device environment. I own the Jamf Pro platform end-to-end and lead endpoint engineering for Checkpoint Harmony EDR, Microsoft Sentinel SIEM pipelines, and SSL certificate automation.",
                "My work sits where security, automation and scale meet: CIS Benchmark hardening ahead of PCI-DSS and SOC 2 audits, zero-touch macOS enrollment that cut onboarding time by 70%, and certificate renewal pipelines that removed manual cert toil across Cisco ISE, ESXi, Proxmox and HPE iLO.",
                "I also drive enterprise AI adoption — Google Gemini org-wide, Atlassian Rovo Agents, and an AI-powered ticket-triage pipeline that cut average triage time across 350+ tickets a year.",
                "Licensed Computer Science Engineer (TEE) | ITIL 4 certified | Based in Athens | English (C2), Greek (Native), German (B2)"
            ]
        },

        hero: {
            firstName: "ANDREAS",
            lastName: "FRAGKIADAKIS",
            typewriter: [
                "APPLE FLEET & IT AUTOMATION LEAD",
                "M.ENG. COMPUTER ENGINEER",
                "ENDPOINT SECURITY ENGINEER",
                "JAMF PRO ADMINISTRATOR",
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
            locationLabel: "Location"
        },

        skillsTitle: "CORE SKILLS",
        skills: [
            {
                icon: "fas fa-network-wired",
                label: "Network & Systems Administration",
                detail: "Proficient in configuring and maintaining complex network infrastructures, ensuring optimal performance and security. Experience with Cisco, Active Directory, and various monitoring tools."
            },
            {
                icon: "fas fa-laptop-code",
                label: "Web Development",
                detail: "Skilled in front-end and back-end technologies including HTML, CSS, JavaScript, React, and Next.js. Passionate about creating responsive and user-friendly web applications."
            },
            {
                icon: "fas fa-shield-alt",
                label: "Security Systems",
                detail: "Knowledgeable in implementing security best practices, endpoint hardening, and managing access controls. Familiar with PCI/SOC2 compliance requirements."
            },
            {
                icon: "fas fa-lightbulb",
                label: "Troubleshooting",
                detail: "Expert at diagnosing and resolving hardware, software, and network issues efficiently, minimizing downtime and impact on users."
            },
            {
                icon: "fas fa-tasks",
                label: "Project Management",
                detail: "Experienced in leading and coordinating IT projects, from planning and execution to monitoring and delivery, ensuring projects are completed on time and within budget."
            },
            {
                icon: "fas fa-language",
                label: "Excellent Communication",
                detail: "Strong verbal and written communication skills in English (C2), Greek (Native), and German (B2), facilitating clear and effective collaboration with technical and non-technical stakeholders."
            }
        ],

        servicesTitle: "WHAT I DO",
        servicesSubtitle: "// SERVICES & EXPERTISE",
        servicesCta: "Have a unique project in mind?",
        servicesCtaButton: "Let's Talk",
        services: [
            {
                icon: "fas fa-shield-halved",
                title: "Endpoint Security & Compliance",
                description: "Hardening fleets against real-world threats: CIS Benchmark implementation, EDR deployment and migration, disk-encryption management, and audit readiness for PCI-DSS and SOC 2."
            },
            {
                icon: "fab fa-apple",
                title: "Apple Fleet Engineering",
                description: "Managing macOS at scale with Jamf Pro and Apple Business Manager — zero-touch enrollment, configuration profiles, patch strategy, and fleet hygiene across hundreds of devices."
            },
            {
                icon: "fas fa-gears",
                title: "IT Automation & Scripting",
                description: "Turning manual IT work into repeatable systems. Bash, Python and TypeScript against real APIs, plus certificate and provisioning pipelines that remove recurring toil for good."
            },
            {
                icon: "fas fa-robot",
                title: "AI-Augmented Operations",
                description: "Deploying AI that measurably reduces work — org-wide assistant rollouts, agentic automation, and AI-powered ticket triage that cuts time-to-resolution instead of adding another dashboard."
            },
            {
                icon: "fas fa-headset",
                title: "IT Service Management",
                description: "ITIL 4 certified service delivery: incident and request workflows, ticketing automation, SLA-driven support, and vendor escalation management for business-critical systems."
            },
            {
                icon: "fas fa-network-wired",
                title: "Networks & Infrastructure",
                description: "The layer everything else depends on — Cisco ISE, Active Directory, MFA, and virtualization on ESXi and Proxmox, with monitoring that surfaces problems before users report them."
            }
        ],

        experienceTitle: "EXPERIENCE",
        experience: [
            {
                role: "Team Lead, Apple Fleet & IT Automation",
                company: "OMILIA LTD, Athens, Greece",
                duration: "April 2026 – Present",
                tasks: [
                    "Own the Apple Fleet & IT Automation function, the Jamf Pro platform, and AI-driven IT pipelines across 400+ macOS endpoints",
                    "Lead automation engineering in Bash, Python and TypeScript — Jamf API, AI ticket-triage, MCP server prototypes and SSL renewal infrastructure",
                    "Partner with Cyber, HR, Finance and Engineering to turn business needs into faster onboarding, fewer tickets and zero certificate toil"
                ]
            },
            {
                role: "Information Technology Engineer",
                company: "OMILIA LTD, Athens, Greece",
                duration: "September 2024 – May 2026",
                tasks: [
                    "Architected Jamf Pro zero-touch enrollment via Apple Business Manager for the 400+ macOS fleet — 70% onboarding-time reduction",
                    "Implemented CIS Benchmark hardening fleet-wide with the Cyber team — full compliance ahead of PCI-DSS and SOC 2 audits",
                    "Led enterprise EDR migration to Checkpoint Harmony across 400+ devices, resolving FileVault conflicts at cutover with zero data loss",
                    "Built a centralised SSL renewal pipeline (acme.sh, Let's Encrypt, DNS-01) for Cisco ISE, ESXi, Proxmox and HPE iLO — eliminated all manual cert toil",
                    "Engineered Microsoft Sentinel SIEM integration with Python log collectors (RFC 5424 + TLS) unifying Jamf, Anydesk and HID telemetry",
                    "Drove enterprise AI adoption: Gemini org-wide, Atlassian Rovo Agents, and an AI-powered ticket-triage pipeline",
                    "Resolved 350+ Jira tickets at 95%+ SLA, authored 40+ Confluence guides and administered 9 enterprise platforms"
                ]
            },
            {
                role: "Mandatory Army Service — IT Operations & Administrative Support",
                company: "Hellenic Army, Greece",
                duration: "November 2025 – August 2026",
                tasks: [
                    "Delivered IT operations and administrative support reporting directly to the Deputy Battalion Commander",
                    "Modernised the personnel database and upgraded battalion network infrastructure"
                ]
            },
            {
                role: "Information Technology Support & Infrastructure Coordinator",
                company: "KEEP EAT HEALTHY, Koropi, Greece",
                duration: "May 2022 – November 2025",
                tasks: [
                    "Owned end-to-end IT for a hybrid office: network, endpoint security, hardware lifecycle and vendor coordination",
                    "Extended average device lifespan by 18 months through proactive maintenance and lifecycle planning",
                    "Migrated paper workflows to Google Workspace and WordPress, reducing admin overhead and improving cross-team collaboration"
                ]
            },
            {
                role: "Information Technology Support Specialist",
                company: "ANEMOMYLOI ANDROS AE, Andros, Greece",
                duration: "January 2023 – February 2024",
                tasks: [
                    "Digitised daily operations by migrating the entire business archive from paper to Google Drive with data retention and security controls",
                    "Managed the booking and billing platform, handling reservations, digital invoicing and system updates",
                    "Provided fully remote technical support and advised owners on digital upgrades to improve operational efficiency"
                ]
            },
            {
                role: "Web Developer",
                company: "Self-Employed, Greece",
                duration: "2020 – November 2023",
                tasks: [
                    "Delivered end-to-end client websites covering domain, DNS, SSL/TLS, hosting, MySQL, WordPress and SEO",
                    "Achieved measurable organic-traffic gains through structured data and performance tuning"
                ]
            },
            {
                role: "Network Systems Installation & Configuration Technician",
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
                degree: "Integrated Master's Degree (5 Years), Computer Science",
                institution: "University of West Attica, Athens, Greece",
                duration: "September 2019 – June 2025",
                details: [
                    "Distinguished member of the university's Tech Society",
                    "Relevant coursework: Advanced Computer Systems, AI, Network Security, Databases, Web Development, Cloud Computing",
                    "GPA: 2.98"
                ]
            },
            {
                degree: "Master of Science, Applied Computer Science",
                institution: "SRH Hochschule Heidelberg, Germany",
                duration: "April 2023 – October 2023",
                details: ["Awarded presenter and team leader",
                        "ERASMUS+ Semester",
                ]
            },
            {
                degree: "ITIL 4 Foundation certified in IT Service Management",
                institution: "AXELOS Global Best Practice",
                duration: "2024",
                details: ["Knowledge of the ITIL 4 framework", "Focus on IT service management (ITSM) best practices"],
                link: "/files/itil-v4-cert.pdf"
            },
            {
                degree: "Professional License — IT & Computer Science Engineer",
                institution: "Technical Chamber of Greece (TEE)",
                duration: "2025",
                details: [
                    "Statutory professional licence to practise as a Computer Science Engineer in Greece",
                    "Requires an accredited five-year integrated Master's degree"
                ]
            },
            {
                degree: "Career Essentials in Generative AI",
                institution: "Microsoft & LinkedIn",
                duration: "2024",
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
                name: "Plano Plus - Signs & Visual Identity",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend"],
                description: "Marketing & signage studio website built with Next.js App Router. Features light/dark theme, parallax effects, smooth scrolling, contact form with email integration, and modern UI/UX. Serves clients across Crete with professional signage and branding solutions.",
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
                name: "Signature Craft",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Email Signatures"],
                description: "Open-source email signature builder with 32+ templates, zero sign-up, and a polished dark-mode UI. Design stunning HTML signatures for Gmail, Outlook, Apple Mail, Yahoo & Thunderbird in minutes — completely free.",
                role: "Solo design and build · Open source",
                detail: "An open-source email signature builder aimed at a problem every company has and nobody owns: signatures that break the moment they leave your machine. Signature Craft generates table-based HTML that renders consistently across the major mail clients, with no sign-up, no paywall and no tracking.",
                highlights: [
                    "32+ templates spanning corporate, minimal and creative layouts",
                    "Client-safe HTML tested against Gmail, Outlook, Apple Mail, Yahoo and Thunderbird",
                    "Zero sign-up, zero tracking, fully open source",
                    "Live preview with one-click copy to clipboard"
                ],
                liveSiteLink: "https://signature-craft-tau.vercel.app/",
                image: "/images/signature-craft/signature-craft.png"
            },
            {
                name: "Portfolio Website",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Framer Motion", "Canvas"],
                description: "Designed and built this modern portfolio (2026) with a horizontal scroll experience, an interactive Canvas glitch effect, and motion-driven sections. Features dark/light mode, full bilingual support, and responsive design.",
                role: "Solo design and build",
                detail: "This site. A horizontal-scroll journey across six pinned sections on desktop that degrades to a clean vertical stack on tablet and mobile, with an interactive Canvas glitch effect revealed through a masked cursor trail. Fully bilingual, dual-themed, and built to stay accessible: keyboard navigable, focus-visible throughout, and respectful of reduced-motion preferences.",
                highlights: [
                    "Horizontal scroll-driven track with idle section snapping",
                    "Interactive Canvas letter-glitch effect masked to the cursor",
                    "Full EN/GR bilingual content and light/dark theming",
                    "Keyboard accessible with reduced-motion support"
                ],
                liveSiteLink: "https://andreas.technology",
                githubLink: "https://github.com/Andrewfragkiadakis/Portfolio-Webpage",
                image: "/images/portfolio-website/2026.png"
            },
            {
                name: "Thesis: Hybrid Wireless-Optical Networks for 5G",
                year: 2026,
                tags: ["Thesis", "5G", "Radio over Fiber", "Research"],
                description: "Master's thesis on new hybrid wireless-optical networks (Radio over Fiber) for 5G. Includes research and full thesis documentation.",
                role: "Sole researcher · Integrated M.Eng. thesis, University of West Attica",
                detail: "Research into hybrid wireless-optical access networks for 5G, centred on Radio over Fiber as a way to move signal processing off the antenna site and into a shared facility. The work compares distributed and centralised RAN architectures and evaluates where optical transport meaningfully changes the total cost of ownership. Published as \"New Hybrid Wireless Optical Networks (Radio Over Fiber) for 5G Networks\".",
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
                name: "Silence Hero - Chrome Extension",
                year: 2024,
                tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "A Chrome extension that helps you remember Greek quiet hours with visual cues and a countdown timer. Never disturb your neighbors again!",
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
                name: "Nexus Party App",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "PWA"],
                description: "Greek party game collection with 6 multiplayer games: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, and Truth or Dare. Built as a PWA with smooth animations, automatic scoring, timers, and configurable game settings. Perfect for wild nights with friends.",
                role: "Solo design and build",
                detail: "A Greek-language party game collection bundling six multiplayer games into one installable PWA. Built to solve a real problem at gatherings: nobody wants to download six apps or remember six sets of rules. Handles scoring, timers and per-game configuration so the group can keep playing instead of arguing about the rules.",
                highlights: [
                    "Six multiplayer games: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, Truth or Dare",
                    "Installable PWA that works offline",
                    "Automatic scoring, round timers and configurable rules",
                    "State managed with Zustand; animated with Framer Motion"
                ],
                liveSiteLink: "https://nexus-party-app.vercel.app/",
                image: "/images/NexusPartyApp/nexuspartyapp.png"
            },
            {
                name: "HappyFox 🦊 - Mental Health App",
                year: 2023,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Developed UI/UX concepts for a user-friendly mental health app aimed at promoting emotional well-being during a Master's course.",
                role: "Team project · UI/UX design, SRH Heidelberg",
                detail: "A mental-health application concept developed during a Master's course at SRH Heidelberg. The team's focus was on designing for people in a low-energy state: reducing friction, avoiding judgemental language, and making the daily check-in something you can complete in under a minute.",
                highlights: [
                    "End-to-end UI/UX concept designed in Figma",
                    "Designed around low-friction daily emotional check-ins",
                    "Delivered as a team project with an awarded presentation",
                    "Focus on accessible, non-judgemental interaction design"
                ],
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Schiller Language Centers Website",
                year: 2026,
                tags: ["Wix", "Wix Studio", "Web Development", "Educational"],
                description: "Developed the website for Schiller Language Centers in Rethymno, Greece. The site showcases courses in English, German, and Educational Robotics.",
                role: "Solo build · Client project",
                detail: "The public website for Schiller Language Centers in Rethymno, Crete, covering their English, German and Educational Robotics programmes. Built on Wix Studio so the client's own staff can keep course listings and term dates current without needing a developer.",
                highlights: [
                    "Course catalogue across English, German and Educational Robotics",
                    "Built for non-technical staff to maintain independently",
                    "Structured for local search visibility in Rethymno",
                    "Live and in active use by the school"
                ],
                liveSiteLink: "https://www.schiller.edu.gr/",
                image: "/images/Schiller Project/schiller.png"
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
                image: "/images/Raspberry Pi Adblocker & Streamer/raspberry-pi.png"
            },
            {
                name: "Research: LLMs & Human Knowledge",
                year: 2024,
                tags: ["Research", "Cognitive Science", "LLMs", "GPT-3", "Python"],
                description: "Compared GPT-3 and human performance on the False Belief Task to assess belief attribution in LLMs. Published in Cognitive Science.",
                role: "Research contributor · Published in Cognitive Science",
                detail: "A comparison of GPT-3 and human performance on the False Belief Task, a standard instrument in developmental psychology for assessing theory of mind. The question: does a language model that produces fluent text about beliefs actually attribute beliefs, or does it pattern-match its way to the right answer? Published in the journal Cognitive Science.",
                highlights: [
                    "Benchmarked GPT-3 against human baselines on the False Belief Task",
                    "Applied developmental-psychology methodology to model evaluation",
                    "Peer-reviewed and published in Cognitive Science (Wiley)",
                    "Analysis pipeline implemented in Python"
                ],
                reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
                publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
                image: "/images/Research LLMs & Human Knowledge/llm-research.png"
            },
            {
                name: "The Friendly Wheelchair (Concept)",
                year: 2023,
                tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
                description: "Developed a detailed project management plan and technical specifications for an AI-powered self-driving wheelchair concept for Heidelberg Clinics.",
                role: "Project management lead · SRH Heidelberg",
                detail: "A project management plan and technical specification for an AI-assisted self-driving wheelchair intended for the Heidelberg clinics. The work was deliberately not a prototype: it covered scope, risk, stakeholder mapping, regulatory considerations and delivery planning for a healthcare-grade assistive device.",
                highlights: [
                    "Full project management plan under an Agile/SCRUM framework",
                    "Technical specification for AI navigation and NLP interaction",
                    "Risk and stakeholder analysis for a clinical deployment context",
                    "Scoped against healthcare IT constraints"
                ],
                reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
                image: "/images/The Friendly Wheelchair (Concept)/friendly-wheelchair.png"
            }
        ],

        contactTitle: "GET IN TOUCH",
        copyright: "© 2026 Created By Andreas Fragkiadakis. All rights reserved."
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
            tagline: "Επικεφαλής Apple Fleet & IT Automation σε περιβάλλον 400+ συσκευών",
            readMore: "Διαβάστε περισσότερα",
            showLess: "Λιγότερα",
            currentFocus: "Τρεχουσα Εστιαση",
            currentFocusDetail: "Fleet Automation & Endpoint Security",
            statsLabels: ["Χρονια Εμπειριας", "Συσκευες υπο Διαχειριση", "Ταχυτερο Onboarding", "Γλωσσες"],
            description: [
                "Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) και ηγούμαι του τομέα Apple Fleet & IT Automation στην Omilia, μια παγκόσμια εταιρεία conversational AI, σε περιβάλλον άνω των 400 συσκευών. Διαχειρίζομαι εξ ολοκλήρου την πλατφόρμα Jamf Pro και ηγούμαι του endpoint engineering για Checkpoint Harmony EDR, pipelines Microsoft Sentinel SIEM και αυτοματοποίηση πιστοποιητικών SSL.",
                "Η δουλειά μου βρίσκεται στο σημείο όπου συναντώνται η ασφάλεια, ο αυτοματισμός και η κλίμακα: θωράκιση κατά CIS Benchmarks ενόψει ελέγχων PCI-DSS και SOC 2, zero-touch enrollment για macOS που μείωσε τον χρόνο onboarding κατά 70%, και pipelines ανανέωσης πιστοποιητικών που εξάλειψαν τη χειροκίνητη εργασία σε Cisco ISE, ESXi, Proxmox και HPE iLO.",
                "Παράλληλα οδηγώ την υιοθέτηση AI σε εταιρικό επίπεδο — Google Gemini, Atlassian Rovo Agents και ένα AI pipeline διαλογής αιτημάτων που μείωσε τον μέσο χρόνο triage σε 350+ tickets ετησίως.",
                "Αδειούχος Μηχανικός Πληροφορικής (ΤΕΕ) | Πιστοποίηση ITIL 4 | Με έδρα την Αθήνα | Αγγλικά (C2), Ελληνικά (Μητρική), Γερμανικά (B2)"
            ]
        },

        hero: {
            firstName: "ΑΝΔΡΕΑΣ",
            lastName: "ΦΡΑΓΚΙΑΔΑΚΗΣ",
            typewriter: [
                "APPLE FLEET & IT AUTOMATION LEAD",
                "M.ENG. ΜΗΧΑΝΙΚΟΣ ΥΠΟΛΟΓΙΣΤΩΝ",
                "ENDPOINT SECURITY ENGINEER",
                "JAMF PRO ADMINISTRATOR",
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
            locationLabel: "Τοποθεσια"
        },

        skillsTitle: "ΒΑΣΙΚΕΣ ΔΕΞΙΟΤΗΤΕΣ",
        skills: [
            {
                icon: "fas fa-network-wired",
                label: "Δίκτυα & Διαχείριση Συστημάτων",
                detail: "Εμπειρία στη διαμόρφωση και συντήρηση σύνθετων δικτυακών υποδομών, εξασφαλίζοντας βέλτιστη απόδοση και ασφάλεια. Γνώση σε Cisco, Active Directory και εργαλεία παρακολούθησης (monitoring)."
            },
            {
                icon: "fas fa-laptop-code",
                label: "Web Development",
                detail: "Δεξιότητες σε τεχνολογίες Front-end και Back-end (HTML, CSS, JavaScript, React, Next.js). Πάθος για τη δημιουργία responsive και εύχρηστων διαδικτυακών εφαρμογών."
            },
            {
                icon: "fas fa-shield-alt",
                label: "Ασφάλεια Συστημάτων",
                detail: "Εφαρμογή βέλτιστων πρακτικών ασφαλείας, θωράκιση τερματικών (endpoint hardening) και διαχείριση ελέγχων πρόσβασης. Εξοικείωση με πρότυπα συμμόρφωσης όπως PCI και SOC2."
            },
            {
                icon: "fas fa-lightbulb",
                label: "Troubleshooting",
                detail: "Αποτελεσματική διάγνωση και επίλυση προβλημάτων υλικού, λογισμικού και δικτύων, με στόχο την ελαχιστοποίηση του χρόνου διακοπής λειτουργίας."
            },
            {
                icon: "fas fa-tasks",
                label: "Project Management",
                detail: "Συντονισμός έργων πληροφορικής, από τον σχεδιασμό και την εκτέλεση έως την παρακολούθηση και την παράδοση, διασφαλίζοντας την τήρηση χρονοδιαγραμμάτων και προϋπολογισμού."
            },
            {
                icon: "fas fa-language",
                label: "Επικοινωνία",
                detail: "Άριστες επικοινωνιακές δεξιότητες σε Αγγλικά (C2), Ελληνικά (Μητρική) και Γερμανικά (B2), για αποτελεσματική συνεργασία με τεχνικές και μη τεχνικές ομάδες."
            }
        ],

        servicesTitle: "ΥΠΗΡΕΣΙΕΣ",
        servicesSubtitle: "// ΕΞΕΙΔΙΚΕΥΣΗ & ΔΕΞΙΟΤΗΤΕΣ",
        servicesCta: "Εχετε ενα συγκεκριμενο project στο μυαλο σας;",
        servicesCtaButton: "Ας Μιλησουμε",
        services: [
            {
                icon: "fas fa-shield-halved",
                title: "Ασφαλεια Τερματικων & Συμμορφωση",
                description: "Θωράκιση στόλου συσκευών απέναντι σε πραγματικές απειλές: εφαρμογή CIS Benchmarks, ανάπτυξη και μετάβαση EDR, διαχείριση κρυπτογράφησης δίσκων και ετοιμότητα για ελέγχους PCI-DSS και SOC 2."
            },
            {
                icon: "fab fa-apple",
                title: "Apple Fleet Engineering",
                description: "Διαχείριση macOS σε κλίμακα με Jamf Pro και Apple Business Manager — zero-touch enrollment, configuration profiles, στρατηγική ενημερώσεων και συντήρηση εκατοντάδων συσκευών."
            },
            {
                icon: "fas fa-gears",
                title: "Αυτοματισμος IT & Scripting",
                description: "Μετατροπή χειροκίνητων εργασιών IT σε επαναλήψιμα συστήματα. Bash, Python και TypeScript πάνω σε πραγματικά APIs, με pipelines πιστοποιητικών και provisioning που εξαλείφουν την επαναλαμβανόμενη εργασία."
            },
            {
                icon: "fas fa-robot",
                title: "AI-Augmented Operations",
                description: "Ανάπτυξη AI που μειώνει μετρήσιμα τον φόρτο εργασίας — εταιρικά rollouts βοηθών, agentic automation και διαλογή αιτημάτων με AI που μειώνει τον χρόνο επίλυσης."
            },
            {
                icon: "fas fa-headset",
                title: "IT Service Management",
                description: "Παροχή υπηρεσιών με πιστοποίηση ITIL 4: ροές incident και request, αυτοματισμός ticketing, υποστήριξη βάσει SLA και διαχείριση κρίσιμων vendor escalations."
            },
            {
                icon: "fas fa-network-wired",
                title: "Δικτυα & Υποδομες",
                description: "Το επίπεδο πάνω στο οποίο στηρίζονται όλα — Cisco ISE, Active Directory, MFA και virtualization σε ESXi και Proxmox, με monitoring που εντοπίζει προβλήματα πριν τα αναφέρουν οι χρήστες."
            }
        ],

        experienceTitle: "ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΕΜΠΕΙΡΙΑ",
        experience: [
            {
                role: "Team Lead, Apple Fleet & IT Automation",
                company: "OMILIA LTD, Αθήνα",
                duration: "Απρίλιος 2026 – Σήμερα",
                tasks: [
                    "Πλήρης ευθύνη για τον τομέα Apple Fleet & IT Automation, την πλατφόρμα Jamf Pro και τα AI pipelines σε 400+ τερματικά macOS",
                    "Ηγεσία automation engineering σε Bash, Python και TypeScript — Jamf API, AI ticket-triage, prototypes MCP server και υποδομή ανανέωσης SSL",
                    "Συνεργασία με Cyber, HR, Finance και Engineering για ταχύτερο onboarding, λιγότερα tickets και μηδενική χειροκίνητη διαχείριση πιστοποιητικών"
                ]
            },
            {
                role: "Information Technology Engineer",
                company: "OMILIA LTD, Αθήνα",
                duration: "Σεπτέμβριος 2024 – Μάιος 2026",
                tasks: [
                    "Σχεδίαση zero-touch enrollment με Jamf Pro και Apple Business Manager για στόλο 400+ macOS — μείωση χρόνου onboarding κατά 70%",
                    "Εφαρμογή θωράκισης CIS Benchmark σε όλο τον στόλο σε συνεργασία με το τμήμα Cyber — πλήρης συμμόρφωση ενόψει ελέγχων PCI-DSS και SOC 2",
                    "Ηγεσία εταιρικής μετάβασης EDR σε Checkpoint Harmony σε 400+ συσκευές, με επίλυση συγκρούσεων FileVault χωρίς καμία απώλεια δεδομένων",
                    "Κατασκευή κεντρικού pipeline ανανέωσης SSL (acme.sh, Let's Encrypt, DNS-01) για Cisco ISE, ESXi, Proxmox και HPE iLO",
                    "Υλοποίηση ενσωμάτωσης Microsoft Sentinel SIEM με Python log collectors (RFC 5424 + TLS) για Jamf, Anydesk και HID",
                    "Προώθηση εταιρικής υιοθέτησης AI: Gemini, Atlassian Rovo Agents και AI pipeline διαλογής αιτημάτων",
                    "Επίλυση 350+ Jira tickets με SLA 95%+, συγγραφή 40+ οδηγών Confluence και διαχείριση 9 εταιρικών πλατφορμών"
                ]
            },
            {
                role: "Στρατιωτική Θητεία — IT Operations & Διοικητική Υποστήριξη",
                company: "Ελληνικός Στρατός",
                duration: "Νοέμβριος 2025 – Αύγουστος 2026",
                tasks: [
                    "Παροχή υπηρεσιών IT operations και διοικητικής υποστήριξης με αναφορά απευθείας στον Υποδιοικητή Τάγματος",
                    "Εκσυγχρονισμός βάσης δεδομένων προσωπικού και αναβάθμιση δικτυακής υποδομής τάγματος"
                ]
            },
            {
                role: "IT Support & Infrastructure Coordinator",
                company: "KEEP EAT HEALTHY, Κορωπί",
                duration: "Μάιος 2022 – Νοέμβριος 2025",
                tasks: [
                    "Πλήρης ευθύνη IT για υβριδικό γραφείο: δίκτυο, ασφάλεια τερματικών, κύκλος ζωής εξοπλισμού και συντονισμός προμηθευτών",
                    "Επέκταση του μέσου χρόνου ζωής των συσκευών κατά 18 μήνες μέσω προληπτικής συντήρησης",
                    "Μετάβαση από έντυπες ροές σε Google Workspace και WordPress, με μείωση διοικητικού φόρτου"
                ]
            },
            {
                role: "IT Support Specialist",
                company: "ANEMOMYLOI ANDROS AE, Άνδρος",
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
                    "Μετρήσιμη αύξηση οργανικής επισκεψιμότητας μέσω structured data και βελτιστοποίησης απόδοσης"
                ]
            },
            {
                role: "Network Systems Technician",
                company: "Weballdesign, Αθήνα",
                duration: "2020 - Νοέμβριος 2022",
                tasks: [
                    "Εγκατάσταση και παραμετροποίηση συστημάτων Server/Client σε εκπαιδευτικά ιδρύματα",
                    "Συντήρηση δικτυακού εξοπλισμού (Routers, Switches, UPS) και διαγνωστικοί έλεγχοι",
                    "Εκπαίδευση προσωπικού στη χρήση νέων συστημάτων"
                ]
            }
        ],

        educationTitle: "ΕΚΠΑΙΔΕΥΣΗ",
        education: [
            {
                degree: "Integrated Master's in Computer Science (5ετές)",
                institution: "Πανεπιστήμιο Δυτικής Αττικής",
                duration: "Σεπτέμβριος 2019 - Ιούνιος 2025",
                details: [
                    "Ενεργό μέλος του Tech Society του πανεπιστημίου",
                    "Σχετικά μαθήματα: Προηγμένα Υπολογιστικά Συστήματα, AI, Ασφάλεια Δικτύων, Βάσεις Δεδομένων, Web Development, Cloud Computing",
                    "Μέσος Όρος (GPA): 7.6 / 10"
                ]
            },
            {
                degree: "Master of Science, Applied Computer Science",
                institution: "SRH Hochschule Heidelberg, Γερμανία",
                duration: "Απρίλιος 2023 - Οκτώβριος 2023",
                details: ["Εξάμηνο φοίτησης ERASMUS+", "Διάκριση ως ομιλητής και επικεφαλής ομάδας"]
            },
            {
                degree: "ITIL 4 Foundation Certificate in IT Service Management",
                institution: "AXELOS Global Best Practice",
                duration: "2024",
                details: ["Πιστοποίηση στο πλαίσιο ITIL 4", "Εξειδίκευση στις βέλτιστες πρακτικές διαχείρισης υπηρεσιών πληροφορικής (ITSM)"],
                link: "/files/itil-v4-cert.pdf"
            },
            {
                degree: "Άδεια Ασκήσεως Επαγγέλματος — Μηχανικός Πληροφορικής & Υπολογιστών",
                institution: "Τεχνικό Επιμελητήριο Ελλάδας (ΤΕΕ)",
                duration: "2025",
                details: [
                    "Θεσμοθετημένη άδεια άσκησης επαγγέλματος Μηχανικού Πληροφορικής στην Ελλάδα",
                    "Προϋποθέτει πενταετές ενιαίο και αδιάσπαστο μεταπτυχιακό δίπλωμα"
                ]
            },
            {
                degree: "Career Essentials in Generative AI",
                institution: "Microsoft & LinkedIn",
                duration: "2024",
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
                name: "Plano Plus - Επιγραφες & Οπτικη Ταυτοτητα",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend"],
                description: "Ιστοσελίδα στούντιο επιγραφών και οπτικής επικοινωνίας με Next.js App Router. Χαρακτηριστικά: light/dark theme, parallax effects, smooth scrolling, φόρμα επικοινωνίας με email integration, και σύγχρονο UI/UX. Εξυπηρετεί πελάτες σε όλη την Κρήτη με επαγγελματικές λύσεις επιγραφών και branding.",
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
                name: "Signature Craft",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Email Signatures"],
                description: "Open-source εργαλείο δημιουργίας email signatures με 32+ templates, χωρίς εγγραφή, και σύγχρονο dark-mode UI. Σχεδιάστε επαγγελματικές HTML υπογραφές για Gmail, Outlook, Apple Mail, Yahoo & Thunderbird σε λίγα λεπτά — εντελώς δωρεάν.",
                role: "Ατομικός σχεδιασμός και υλοποίηση · Open source",
                detail: "Open-source εργαλείο δημιουργίας email signatures για ένα πρόβλημα που έχουν όλες οι εταιρείες: υπογραφές που «σπάνε» μόλις φύγουν από τον υπολογιστή σου. Παράγει HTML βασισμένο σε πίνακες που εμφανίζεται σωστά στους βασικούς mail clients, χωρίς εγγραφή και χωρίς tracking.",
                highlights: [
                    "32+ templates: εταιρικά, minimal και δημιουργικά",
                    "HTML ελεγμένο σε Gmail, Outlook, Apple Mail, Yahoo και Thunderbird",
                    "Χωρίς εγγραφή, χωρίς tracking, πλήρως open source",
                    "Ζωντανή προεπισκόπηση με αντιγραφή με ένα κλικ"
                ],
                liveSiteLink: "https://signature-craft-tau.vercel.app/",
                image: "/images/signature-craft/signature-craft.png"
            },
            {
                name: "Προσωπικη Ιστοσελιδα Portfolio",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Framer Motion", "Canvas"],
                description: "Σχεδίαση και υλοποίηση modern portfolio με horizontal scroll εμπειρία, διαδραστικό Canvas glitch effect, animations και υποστήριξη Dark/Light mode σε δύο γλώσσες.",
                role: "Ατομικός σχεδιασμός και υλοποίηση",
                detail: "Αυτή η ιστοσελίδα. Οριζόντια εμπειρία πλοήγησης σε έξι ενότητες σε desktop, που μετατρέπεται σε καθαρή κάθετη διάταξη σε tablet και κινητό, με διαδραστικό Canvas glitch effect που αποκαλύπτεται μέσω μάσκας στον κέρσορα. Πλήρως δίγλωσση, με δύο θέματα και προσβασιμότητα από πληκτρολόγιο.",
                highlights: [
                    "Οριζόντιο track με snapping ανά ενότητα",
                    "Διαδραστικό Canvas letter-glitch effect",
                    "Πλήρες δίγλωσσο περιεχόμενο EN/GR και light/dark theme",
                    "Πλοήγηση από πληκτρολόγιο και υποστήριξη reduced motion"
                ],
                liveSiteLink: "https://andreas.technology",
                githubLink: "https://github.com/Andrewfragkiadakis/Portfolio-Webpage",
                image: "/images/portfolio-website/2026.png"
            },
            {
                name: "Thesis: Hybrid Wireless-Optical Networks for 5G",
                year: 2026,
                tags: ["Διπλωματική", "5G", "Radio over Fiber", "Έρευνα"],
                description: "Διπλωματική εργασία στα υβριδικά ασύρματα-οπτικά δίκτυα (Radio over Fiber) για δίκτυα 5ης γενιάς. Περιλαμβάνει τεχνική έρευνα και τεκμηρίωση.",
                role: "Μοναδικός ερευνητής · Διπλωματική M.Eng., Πανεπιστήμιο Δυτικής Αττικής",
                detail: "Έρευνα σε υβριδικά ασύρματα-οπτικά δίκτυα πρόσβασης για 5G, με επίκεντρο το Radio over Fiber ως τρόπο μεταφοράς της επεξεργασίας σήματος εκτός του σημείου κεραίας. Συγκρίνει κατανεμημένες και κεντρικοποιημένες αρχιτεκτονικές RAN και αξιολογεί πού η οπτική μετάδοση αλλάζει ουσιαστικά το συνολικό κόστος κτήσης.",
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
                name: "Silence Hero - Chrome Extension",
                year: 2024,
                tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "Επέκταση για Chrome που υπενθυμίζει τις ώρες κοινής ησυχίας στην Ελλάδα με οπτικές ενδείξεις και αντίστροφη μέτρηση.",
                role: "Ατομική υλοποίηση",
                detail: "Μικρή επέκταση Chrome με έναν και μόνο σκοπό: παρακολουθεί τις ώρες κοινής ησυχίας στην Ελλάδα και σου λέει με μια ματιά αν είναι καλή στιγμή να τρυπήσεις τον τοίχο. Οπτική ένδειξη και ζωντανή αντίστροφη μέτρηση.",
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
                name: "Nexus Party App",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "PWA"],
                description: "Συλλογή ελληνικών παιχνιδιών για πάρτι με 6 multiplayer παιχνίδια: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, και Truth or Dare. Κατασκευασμένο ως PWA με ομαλές animations, αυτόματη βαθμολογία, χρονοδιακόπτες, και παραμετροποιήσιμες ρυθμίσεις. Ιδανικό για άγριες νύχτες με φίλους.",
                role: "Ατομικός σχεδιασμός και υλοποίηση",
                detail: "Ελληνική συλλογή παιχνιδιών για πάρτι που συγκεντρώνει έξι multiplayer παιχνίδια σε μία εγκαταστάσιμη PWA. Λύνει ένα πραγματικό πρόβλημα στις παρέες: κανείς δεν θέλει να κατεβάσει έξι εφαρμογές. Αναλαμβάνει βαθμολογία, χρονομέτρηση και ρυθμίσεις ώστε η παρέα να παίζει αντί να μαλώνει για τους κανόνες.",
                highlights: [
                    "Έξι παιχνίδια: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, Truth or Dare",
                    "Εγκαταστάσιμη PWA που λειτουργεί offline",
                    "Αυτόματη βαθμολογία, χρονόμετρα και παραμετροποιήσιμοι κανόνες",
                    "Διαχείριση κατάστασης με Zustand, animations με Framer Motion"
                ],
                liveSiteLink: "https://nexus-party-app.vercel.app/",
                image: "/images/NexusPartyApp/nexuspartyapp.png"
            },
            {
                name: "HappyFox 🦊 - Εφαρμογη Ψυχικης Υγειας",
                year: 2023,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Σχεδιασμός UI/UX για εφαρμογή ψυχικής υγείας με στόχο την προώθηση της συναισθηματικής ευεξίας. Υλοποιήθηκε στα πλαίσια μεταπτυχιακού μαθήματος.",
                role: "Ομαδικό έργο · Σχεδιασμός UI/UX, SRH Heidelberg",
                detail: "Concept εφαρμογής ψυχικής υγείας που αναπτύχθηκε σε μεταπτυχιακό μάθημα στο SRH Heidelberg. Η ομάδα εστίασε στον σχεδιασμό για ανθρώπους σε κατάσταση χαμηλής ενέργειας: λιγότερα εμπόδια, χωρίς επικριτική γλώσσα, με καθημερινό check-in που ολοκληρώνεται σε λιγότερο από ένα λεπτό.",
                highlights: [
                    "Ολοκληρωμένο concept UI/UX σχεδιασμένο σε Figma",
                    "Σχεδιασμός γύρω από καθημερινά check-in χαμηλής προσπάθειας",
                    "Ομαδικό έργο με βραβευμένη παρουσίαση",
                    "Έμφαση σε προσβάσιμο και μη επικριτικό σχεδιασμό"
                ],
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Ιστοσελιδα Κεντρων Ξενων Γλωσσων Schiller",
                year: 2026,
                tags: ["Wix", "Wix Studio", "Web Development", "Educational"],
                description: "Ανάπτυξη ιστοσελίδας για τα εκπαιδευτικά κέντρα Schiller στο Ρέθυμνο. Παρουσίαση προγραμμάτων σπουδών Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής.",
                role: "Ατομική υλοποίηση · Έργο πελάτη",
                detail: "Η ιστοσελίδα των κέντρων ξένων γλωσσών Schiller στο Ρέθυμνο, με προγράμματα Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής. Υλοποιήθηκε σε Wix Studio ώστε το προσωπικό της σχολής να ενημερώνει μόνο του τα προγράμματα χωρίς να χρειάζεται προγραμματιστή.",
                highlights: [
                    "Κατάλογος προγραμμάτων σε Αγγλικά, Γερμανικά και Εκπαιδευτική Ρομποτική",
                    "Σχεδιασμένη για αυτόνομη συντήρηση από μη τεχνικό προσωπικό",
                    "Δομημένη για τοπική αναζήτηση στο Ρέθυμνο",
                    "Σε πλήρη λειτουργία από τη σχολή"
                ],
                liveSiteLink: "https://www.schiller.edu.gr/",
                image: "/images/Schiller Project/schiller.png"
            },
            {
                name: "Raspberry Pi Adblocker & Streamer",
                year: 2024,
                tags: ["Raspberry Pi", "Linux", "Networking", "Pi-hole", "Plex"],
                description: "Παραμετροποίηση Raspberry Pi ως Network-wide Adblocker (Pi-hole) και Media Server (Plex) για οικιακή χρήση.",
                role: "Ατομική υλοποίηση · Home lab",
                detail: "Ένα Raspberry Pi με δύο ρόλους: αποκλεισμός διαφημίσεων σε επίπεδο δικτύου με Pi-hole και media streaming με Plex. Πρακτική άσκηση στο να βγάζεις χρήσιμη, μόνιμα διαθέσιμη υποδομή από ελάχιστο υλικό, και στη δουλειά DNS, δικτύου και υπηρεσιών που τη διατηρεί σε λειτουργία.",
                highlights: [
                    "Αποκλεισμός διαφημίσεων σε επίπεδο DNS για όλο το δίκτυο",
                    "Plex media server για τοπικό streaming",
                    "Λειτουργεί αδιάλειπτα σε υλικό χαμηλής κατανάλωσης",
                    "Πρακτική εμπειρία σε διαχείριση υπηρεσιών Linux και δικτύων"
                ],
                image: "/images/Raspberry Pi Adblocker & Streamer/raspberry-pi.png"
            },
            {
                name: "Ερευνα: LLMs & Ανθρωπινη Γνωση",
                year: 2024,
                tags: ["Research", "Cognitive Science", "LLMs", "GPT-3", "Python"],
                description: "Συγκριτική μελέτη απόδοσης GPT-3 και ανθρώπων στο 'False Belief Task'. Η έρευνα δημοσιεύθηκε στο περιοδικό Cognitive Science.",
                role: "Συμμετοχή στην έρευνα · Δημοσίευση στο Cognitive Science",
                detail: "Συγκριτική μελέτη απόδοσης GPT-3 και ανθρώπων στο False Belief Task, καθιερωμένο εργαλείο της αναπτυξιακής ψυχολογίας για την αξιολόγηση της θεωρίας του νου. Το ερώτημα: ένα γλωσσικό μοντέλο που παράγει ρέοντα κείμενα για πεποιθήσεις όντως αποδίδει πεποιθήσεις, ή απλώς αναγνωρίζει μοτίβα;",
                highlights: [
                    "Σύγκριση GPT-3 με ανθρώπινες επιδόσεις στο False Belief Task",
                    "Εφαρμογή μεθοδολογίας αναπτυξιακής ψυχολογίας σε αξιολόγηση μοντέλων",
                    "Δημοσίευση με κριτές στο Cognitive Science (Wiley)",
                    "Ανάλυση δεδομένων σε Python"
                ],
                reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
                publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
                image: "/images/Research LLMs & Human Knowledge/llm-research.png"
            },
            {
                name: "The Friendly Wheelchair (Concept)",
                year: 2023,
                tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
                description: "Ανάπτυξη πλάνου διαχείρισης έργου (PM Plan) και τεχνικών προδιαγραφών για concept αυτόνομου αμαξιδίου με AI, για τις κλινικές της Χαϊδελβέργης.",
                role: "Επικεφαλής διαχείρισης έργου · SRH Heidelberg",
                detail: "Πλάνο διαχείρισης έργου και τεχνικές προδιαγραφές για αυτόνομο αναπηρικό αμαξίδιο με υποστήριξη AI, για τις κλινικές της Χαϊδελβέργης. Δεν επρόκειτο για prototype: κάλυπτε αντικείμενο, κινδύνους, χαρτογράφηση εμπλεκομένων, κανονιστικές παραμέτρους και σχεδιασμό παράδοσης για ιατροτεχνολογικό βοήθημα.",
                highlights: [
                    "Πλήρες πλάνο διαχείρισης έργου σε πλαίσιο Agile/SCRUM",
                    "Τεχνική προδιαγραφή για πλοήγηση AI και αλληλεπίδραση NLP",
                    "Ανάλυση κινδύνων και εμπλεκομένων για κλινικό περιβάλλον",
                    "Σχεδιασμός εντός περιορισμών healthcare IT"
                ],
                reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
                image: "/images/The Friendly Wheelchair (Concept)/friendly-wheelchair.png"
            }
        ],

        contactTitle: "ΕΠΙΚΟΙΝΩΝΙΑ",
        copyright: "© 2026 Created By Ανδρέας Φραγκιαδάκης. All rights reserved."
    }
}
