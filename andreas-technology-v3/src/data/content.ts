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
    description: string
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
        title: "IT & Security Engineer",
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
            tagline: "Computer Engineer with a passion for building exceptional digital products",
            readMore: "Read more",
            showLess: "Show less",
            currentFocus: "Current Focus",
            currentFocusDetail: "Systems & AI Engineering",
            statsLabels: ["Years Experience", "Projects Completed", "Technologies", "Commitment"],
            description: [
                "I am an IT & Computer Engineer (M.Eng.) specializing in SecOps, Infrastructure Automation, and AI Integration. My approach combines deep technical research with hands-on engineering to build secure, scalable, and automated environments.",
                "Currently, I balance my role as an IT Engineer at Omilia, while fulfilling my military service as an IT Operations Administrator. My academic background is rooted in 5G research, specifically in Hybrid Wireless-Optical Networks (Radio over Fiber).",
                "With a focus on Endpoint Hardening, Network Security, and AI-driven operations (Atlassian Rovo, Gemini), I bridge the gap between complex infrastructure and operational efficiency.",
                "Based in Greece | Fluent in English (C2) & German (B2)"
            ]
        },

        hero: {
            firstName: "ANDREAS",
            lastName: "FRAGKIADAKIS",
            typewriter: [
                "M.ENG. COMPUTER ENGINEER",
                "IT ENGINEER",
                "FRONTEND DEVELOPER",
                "PROBLEM SOLVER",
                "ITIL V4 CERTIFIED",
                "SCRIPTING EXPERT",
                "INFRASTRUCTURE & SECURITY ENGINEER",
                "CONVERSATIONAL AI ENGINEER",
                "AI AUTOMATION SPECIALIST",
                "CLOUD & DEVOPS ENTHUSIAST",
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
                icon: "fas fa-laptop-code",
                title: "Web Development",
                description: "Building fast, responsive, and scalable web applications using modern frameworks like Next.js, React, and TypeScript, with a focus on clean code, performance, and user experience."
            },
            {
                icon: "fas fa-headset",
                title: "IT Service & Support",
                description: "Managing IT environments with a focus on service reliability, incident resolution, and adherence to ITIL best practices for professional service management."
            },
            {
                icon: "fas fa-robot",
                title: "AI & Automation",
                description: "Developing and integrating AI-driven solutions and automating workflows to increase efficiency, improve decision-making, and streamline business operations."
            }
        ],

        experienceTitle: "EXPERIENCE",
        experience: [
            {
                role: "Information Technology Support Engineer",
                company: "OMILIA LTD, Athens, Greece",
                duration: "September 2024 – Present",
                tasks: [
                    "Build and maintain automation for IT support and ticketing workflows",
                    "Manage device onboarding and endpoint deployment using MDM and zero-touch enrollment",
                    "Implement security hardening and compliance measures (CIS benchmarks, firewall policies)",
                    "Automate deployment of endpoint security tools and maintain scripts for policy enforcement",
                    "Support internal AI and productivity tool rollouts; create and maintain IT documentation and runbooks",
                    "Curate corporate software catalog; plan fleet upgrades and manage critical vendor escalations"
                ]
            },
            {
                role: "Information Technology Support & Infrastructure Coordinator",
                company: "KEEP EAT HEALTHY, Athens, Greece",
                duration: "May 2022 – Present",
                tasks: [
                    "Coordinate IT infrastructure installation and maintenance",
                    "Troubleshoot technical issues and propose modern solutions"
                ]
            },
            {
                role: "Information Technology Support Specialist",
                company: "ANEMOMYLOI ANDROS AE, Andros, Greece",
                duration: "January 2023 – February 2024",
                tasks: [
                    "Delivered remote IT support and consultation services",
                    "Supported company projects with IT infrastructure management",
                    "Organized work portfolios and financial records"
                ]
            },
            {
                role: "Web Developer",
                company: "Self-Employed, Athens, Greece",
                duration: "2020 – November 2023",
                tasks: [
                    "Developed and launched two fully operational websites",
                    "Self-taught web development technologies and methodologies"
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
                    "GPA: 7.6 / 10"
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
            githubCta: "View Full Portfolio on GitHub"
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
                liveSiteLink: "https://www.planoplus.gr/",
                githubLink: "https://github.com/Andrewfragkiadakis/Plano-Plus",
                image: "/images/PlanoPlus/plano.png"
            },
            {
                name: "Signature Craft",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Email Signatures"],
                description: "Open-source email signature builder with 32+ templates, zero sign-up, and a polished dark-mode UI. Design stunning HTML signatures for Gmail, Outlook, Apple Mail, Yahoo & Thunderbird in minutes — completely free.",
                liveSiteLink: "https://signature-craft-tau.vercel.app/",
                image: "/images/signature-craft/signature-craft.png"
            },
            {
                name: "Portfolio Website",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Framer Motion", "Canvas"],
                description: "Designed and built this modern portfolio (2026) with a horizontal scroll experience, an interactive Canvas glitch effect, and motion-driven sections. Features dark/light mode, full bilingual support, and responsive design.",
                liveSiteLink: "https://andreas.technology",
                githubLink: "https://github.com/Andrewfragkiadakis/Portfolio-Webpage",
                image: "/images/portfolio-website/2026.png"
            },
            {
                name: "Thesis: Hybrid Wireless-Optical Networks for 5G",
                year: 2026,
                tags: ["Thesis", "5G", "Radio over Fiber", "Research"],
                description: "Master's thesis on new hybrid wireless-optical networks (Radio over Fiber) for 5G. Includes research and full thesis documentation.",
                liveSiteLink: "/thesis-presentation",
                reportLink: "https://drive.usercontent.google.com/download?id=1iayG5SCoUykioRzLPl1BeOkO7iwxxHkD&export=download&authuser=0",
                image: "/images/thesis-presentation/thesis-image.png"
            },
            {
                name: "Silence Hero - Chrome Extension",
                year: 2024,
                tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "A Chrome extension that helps you remember Greek quiet hours with visual cues and a countdown timer. Never disturb your neighbors again!",
                githubLink: "https://github.com/Andrewfragkiadakis/Silence-Hero",
                image: "/images/silence-hero/silence-hero.png"
            },
            {
                name: "Nexus Party App",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "PWA"],
                description: "Greek party game collection with 6 multiplayer games: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, and Truth or Dare. Built as a PWA with smooth animations, automatic scoring, timers, and configurable game settings. Perfect for wild nights with friends.",
                liveSiteLink: "https://nexus-party-app.vercel.app/",
                githubLink: "https://github.com/Andrewfragkiadakis/nexus-party-app",
                image: "/images/NexusPartyApp/nexuspartyapp.png"
            },
            {
                name: "HappyFox 🦊 - Mental Health App",
                year: 2023,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Developed UI/UX concepts for a user-friendly mental health app aimed at promoting emotional well-being during a Master's course.",
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Schiller Language Centers Website",
                year: 2026,
                tags: ["Wix", "Wix Studio", "Web Development", "Educational"],
                description: "Developed the website for Schiller Language Centers in Rethymno, Greece. The site showcases courses in English, German, and Educational Robotics.",
                liveSiteLink: "https://www.schiller.edu.gr/",
                image: "/images/Schiller Project/schiller.png"
            },
            {
                name: "Raspberry Pi Adblocker & Streamer",
                year: 2024,
                tags: ["Raspberry Pi", "Linux", "Networking", "Pi-hole", "Plex"],
                description: "Configured a Raspberry Pi for network-wide adblocking (Pi-hole) and media streaming (Plex) on a home network.",
                image: "/images/Raspberry Pi Adblocker & Streamer/raspberry-pi.png"
            },
            {
                name: "Research: LLMs & Human Knowledge",
                year: 2024,
                tags: ["Research", "Cognitive Science", "LLMs", "GPT-3", "Python"],
                description: "Compared GPT-3 and human performance on the False Belief Task to assess belief attribution in LLMs. Published in Cognitive Science.",
                reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
                publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
                image: "/images/Research LLMs & Human Knowledge/llm-research.png"
            },
            {
                name: "The Friendly Wheelchair (Concept)",
                year: 2023,
                tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
                description: "Developed a detailed project management plan and technical specifications for an AI-powered self-driving wheelchair concept for Heidelberg Clinics.",
                reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
                image: "/images/The Friendly Wheelchair (Concept)/friendly-wheelchair.png"
            }
        ],

        contactTitle: "GET IN TOUCH",
        copyright: "© 2026 Created By Andreas Fragkiadakis. All rights reserved."
    },

    gr: {
        name: "ΑΝΔΡΕΑΣ ΦΡΑΓΚΙΑΔΑΚΗΣ",
        title: "IT & Security Engineer",
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
            projects: "ΕΡΓΑ",
            services: "ΥΠΗΡΕΣΙΕΣ",
            contact: "ΕΠΙΚΟΙΝΩΝΙΑ"
        },

        about: {
            title: "ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ",
            subtitle: "// ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ",
            tagline: "Μηχανικός Πληροφορικής με πάθος για την κατασκευή εξαιρετικών ψηφιακών προϊόντων",
            readMore: "Διαβάστε περισσότερα",
            showLess: "Λιγότερα",
            currentFocus: "Τρεχουσα Εστιαση",
            currentFocusDetail: "Systems & AI Engineering",
            statsLabels: ["Χρονια Εμπειριας", "Ολοκληρωμενα Projects", "Τεχνολογιες", "Αφοσιωση"],
            description: [
                "Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) με εξειδίκευση σε SecOps, αυτοματισμό υποδομών και ενσωμάτωση Τεχνητής Νοημοσύνης. Η προσέγγισή μου συνδυάζει τη βαθιά τεχνική έρευνα με την εφαρμοσμένη μηχανική για τη δημιουργία ασφαλών, κλιμακούμενων και αυτοματοποιημένων περιβαλλόντων.",
                "Αυτή τη στιγμή, συνδυάζω τον ρόλο μου ως Μηχανικός Πληροφορικής στην Omilia, ενώ παράλληλα εκπληρώνω τις στρατιωτικές μου υποχρεώσεις ως Υπεύθυνος Πληροφορικής. Το ακαδημαϊκό μου υπόβαθρο βασίζεται στην έρευνα δικτύων 5G, και συγκεκριμένα στα Υβριδικά Ασύρματα-Οπτικά Δίκτυα (Radio over Fiber).",
                "Με έμφαση στην ενίσχυση τερματικών σημείων (Endpoint Hardening), την ασφάλεια δικτύων και τις λειτουργίες που βασίζονται στην Τεχνητή Νοημοσύνη (Atlassian Rovo, Gemini), γεφυρώνω το χάσμα μεταξύ πολύπλοκων υποδομών και επιχειρησιακής αποτελεσματικότητας.",
                "Με έδρα την Ελλάδα | Άριστη γνώση Αγγλικών (C2) & Γερμανικών (B2)"
            ]
        },

        hero: {
            firstName: "ΑΝΔΡΕΑΣ",
            lastName: "ΦΡΑΓΚΙΑΔΑΚΗΣ",
            typewriter: [
                "IT & SECURITY ENGINEER",
                "SYSTEMS ENGINEER",
                "NETWORK & SYSTEMS ENGINEER",
                "CONVERSATIONAL AI ENGINEER",
                "INFRASTRUCTURE & SUPPORT ENGINEER",
                "CLOUD & DEVOPS ENTHUSIAST",
                "APPLIED COMPUTER SCIENCE SPECIALIST",
                "CREATIVE PROBLEM SOLVER"
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
                icon: "fas fa-laptop-code",
                title: "Αναπτυξη Web",
                description: "Κατασκευή γρήγορων, responsive και κλιμακούμενων εφαρμογών με σύγχρονα frameworks (Next.js, React, TypeScript), εστιάζοντας στον καθαρό κώδικα και την εμπειρία χρήστη."
            },
            {
                icon: "fas fa-headset",
                title: "IT Service & Support",
                description: "Διαχείριση περιβαλλόντων IT με έμφαση στην αξιοπιστία, την επίλυση προβλημάτων και την τήρηση βέλτιστων πρακτικών ITIL."
            },
            {
                icon: "fas fa-robot",
                title: "AI & Αυτοματισμος",
                description: "Ανάπτυξη και ενσωμάτωση λύσεων AI και αυτοματοποίηση ροών εργασίας για αύξηση της αποδοτικότητας και βελτιστοποίηση επιχειρηματικών διαδικασιών."
            }
        ],

        experienceTitle: "ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΕΜΠΕΙΡΙΑ",
        experience: [
            {
                role: "Information Technology Support Engineer",
                company: "OMILIA LTD, Αθήνα",
                duration: "Σεπτέμβριος 2024 – Σήμερα",
                tasks: [
                    "Διαχείριση onboarding συσκευών και ανάπτυξης τερματικών μέσω MDM και zero-touch enrollment",
                    "Εφαρμογή μέτρων θωράκισης και συμμόρφωσης (CIS benchmarks, πολιτικές firewall)",
                    "Αυτοματισμός ανάπτυξης εργαλείων ασφάλειας τερματικών και συντήρηση scripts για εφαρμογή πολιτικών",
                    "Ανάπτυξη και συντήρηση αυτοματισμών για workflows IT υποστήριξης και ticketing",
                    "Υποστήριξη rollout εργαλείων AI και παραγωγικότητας· δημιουργία και συντήρηση τεκμηρίωσης και runbooks",
                    "Διαχείριση εταιρικού catalog λογισμικού· σχεδιασμός αναβαθμίσεων fleet και διαχείριση κρίσιμων vendor escalations"
                ]
            },
            {
                role: "IT Support & Infrastructure Coordinator",
                company: "KEEP EAT HEALTHY, Αθήνα",
                duration: "Μάιος 2022 - Σήμερα",
                tasks: [
                    "Συντονισμός εγκατάστασης και συντήρησης υποδομών πληροφορικής",
                    "Αντιμετώπιση τεχνικών ζητημάτων και πρόταση σύγχρονων τεχνολογικών λύσεων"
                ]
            },
            {
                role: "IT Support Specialist",
                company: "ANEMOMYLOI ANDROS AE, Άνδρος",
                duration: "Ιανουάριος 2023 - Φεβρουάριος 2024",
                tasks: [
                    "Παροχή υπηρεσιών απομακρυσμένης υποστήριξης και συμβουλευτικής IT",
                    "Υποστήριξη εταιρικών έργων και διαχείριση υποδομών",
                    "Οργάνωση εταιρικού χαρτοφυλακίου (portfolio) και ψηφιακών αρχείων"
                ]
            },
            {
                role: "Web Developer",
                company: "Freelance, Αθήνα",
                duration: "2020 - Νοέμβριος 2023",
                tasks: [
                    "Ανάπτυξη, σχεδιασμός και λανσάρισμα ιστοσελίδων",
                    "Εφαρμογή σύγχρονων μεθοδολογιών ανάπτυξης λογισμικού"
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
            githubCta: "Δειτε το πληρες Portfolio στο GitHub"
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
                liveSiteLink: "https://www.planoplus.gr/",
                githubLink: "https://github.com/Andrewfragkiadakis/Plano-Plus",
                image: "/images/PlanoPlus/plano.png"
            },
            {
                name: "Signature Craft",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Email Signatures"],
                description: "Open-source εργαλείο δημιουργίας email signatures με 32+ templates, χωρίς εγγραφή, και σύγχρονο dark-mode UI. Σχεδιάστε επαγγελματικές HTML υπογραφές για Gmail, Outlook, Apple Mail, Yahoo & Thunderbird σε λίγα λεπτά — εντελώς δωρεάν.",
                liveSiteLink: "https://signature-craft-tau.vercel.app/",
                image: "/images/signature-craft/signature-craft.png"
            },
            {
                name: "Προσωπικη Ιστοσελιδα Portfolio",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Framer Motion", "Canvas"],
                description: "Σχεδίαση και υλοποίηση modern portfolio με horizontal scroll εμπειρία, διαδραστικό Canvas glitch effect, animations και υποστήριξη Dark/Light mode σε δύο γλώσσες.",
                liveSiteLink: "https://andreas.technology",
                githubLink: "https://github.com/Andrewfragkiadakis/Portfolio-Webpage",
                image: "/images/portfolio-website/2026.png"
            },
            {
                name: "Thesis: Hybrid Wireless-Optical Networks for 5G",
                year: 2026,
                tags: ["Διπλωματική", "5G", "Radio over Fiber", "Έρευνα"],
                description: "Διπλωματική εργασία στα υβριδικά ασύρματα-οπτικά δίκτυα (Radio over Fiber) για δίκτυα 5ης γενιάς. Περιλαμβάνει τεχνική έρευνα και τεκμηρίωση.",
                liveSiteLink: "/thesis-presentation",
                reportLink: "https://drive.usercontent.google.com/download?id=1iayG5SCoUykioRzLPl1BeOkO7iwxxHkD&export=download&authuser=0",
                image: "/images/thesis-presentation/thesis-image.png"
            },
            {
                name: "Silence Hero - Chrome Extension",
                year: 2024,
                tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "Επέκταση για Chrome που υπενθυμίζει τις ώρες κοινής ησυχίας στην Ελλάδα με οπτικές ενδείξεις και αντίστροφη μέτρηση.",
                githubLink: "https://github.com/Andrewfragkiadakis/Silence-Hero",
                image: "/images/silence-hero/silence-hero.png"
            },
            {
                name: "Nexus Party App",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion", "PWA"],
                description: "Συλλογή ελληνικών παιχνιδιών για πάρτι με 6 multiplayer παιχνίδια: Quizball, Taboo, Παλέρμο, Πες Βρες, Impostor, και Truth or Dare. Κατασκευασμένο ως PWA με ομαλές animations, αυτόματη βαθμολογία, χρονοδιακόπτες, και παραμετροποιήσιμες ρυθμίσεις. Ιδανικό για άγριες νύχτες με φίλους.",
                liveSiteLink: "https://nexus-party-app.vercel.app/",
                githubLink: "https://github.com/Andrewfragkiadakis/nexus-party-app",
                image: "/images/NexusPartyApp/nexuspartyapp.png"
            },
            {
                name: "HappyFox 🦊 - Εφαρμογη Ψυχικης Υγειας",
                year: 2023,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Σχεδιασμός UI/UX για εφαρμογή ψυχικής υγείας με στόχο την προώθηση της συναισθηματικής ευεξίας. Υλοποιήθηκε στα πλαίσια μεταπτυχιακού μαθήματος.",
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Ιστοσελιδα Κεντρων Ξενων Γλωσσων Schiller",
                year: 2026,
                tags: ["Wix", "Wix Studio", "Web Development", "Educational"],
                description: "Ανάπτυξη ιστοσελίδας για τα εκπαιδευτικά κέντρα Schiller στο Ρέθυμνο. Παρουσίαση προγραμμάτων σπουδών Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής.",
                liveSiteLink: "https://www.schiller.edu.gr/",
                image: "/images/Schiller Project/schiller.png"
            },
            {
                name: "Raspberry Pi Adblocker & Streamer",
                year: 2024,
                tags: ["Raspberry Pi", "Linux", "Networking", "Pi-hole", "Plex"],
                description: "Παραμετροποίηση Raspberry Pi ως Network-wide Adblocker (Pi-hole) και Media Server (Plex) για οικιακή χρήση.",
                image: "/images/Raspberry Pi Adblocker & Streamer/raspberry-pi.png"
            },
            {
                name: "Ερευνα: LLMs & Ανθρωπινη Γνωση",
                year: 2024,
                tags: ["Research", "Cognitive Science", "LLMs", "GPT-3", "Python"],
                description: "Συγκριτική μελέτη απόδοσης GPT-3 και ανθρώπων στο 'False Belief Task'. Η έρευνα δημοσιεύθηκε στο περιοδικό Cognitive Science.",
                reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
                publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
                image: "/images/Research LLMs & Human Knowledge/llm-research.png"
            },
            {
                name: "The Friendly Wheelchair (Concept)",
                year: 2023,
                tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
                description: "Ανάπτυξη πλάνου διαχείρισης έργου (PM Plan) και τεχνικών προδιαγραφών για concept αυτόνομου αμαξιδίου με AI, για τις κλινικές της Χαϊδελβέργης.",
                reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
                image: "/images/The Friendly Wheelchair (Concept)/friendly-wheelchair.png"
            }
        ],

        contactTitle: "ΕΠΙΚΟΙΝΩΝΙΑ",
        copyright: "© 2026 Created By Ανδρέας Φραγκιαδάκης. All rights reserved."
    }
}
