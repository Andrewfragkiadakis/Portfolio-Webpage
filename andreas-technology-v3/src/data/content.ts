// Bilingual content data for Andreas Fragkiadakis portfolio

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
        about: string
        experience: string
        projects: string
        services: string
        contact: string
    }
    about: {
        title: string
        tagline: string
        description: string[]
        readMore: string
        showLess: string
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
        opportunitesTitle: string
        opportunitesDescription: string
        sendMessage: string
        downloadResume: string
    }
    skillsTitle: string
    skills: Skill[]
    servicesTitle: string
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
    contactTitle: string
    copyright: string
}
export const content: Record<'en' | 'gr', Content> = {
    en: {
        name: "ANDREAS FRAGKIADAKIS",
        title: "IT & Security Engineer",
        location: "Athens, Greece",
        phone: "(+30) 697-345-3683",
        email: "andrewfragkiadakis@gmail.com",
        github: "https://github.com/Andrewfragkiadakis",
        linkedin: "https://www.linkedin.com/in/andreas-fragkiadakis/",

        nav: {
            about: "ABOUT",
            experience: "EXPERIENCE",
            projects: "PROJECTS",
            services: "WHAT I DO",
            contact: "CONTACT"
        },

        about: {
            title: "ABOUT ME",
            tagline: "Computer Engineer with a passion for building exceptional digital products",
            readMore: "Read more",
            showLess: "Show less",
            description: [
                "I am an IT & Computer Engineer (M.Eng.) specializing in SecOps, Infrastructure Automation, and AI Integration. My approach combines deep technical research with hands-on engineering to build secure, scalable, and automated environments.",
                "Currently, I balance my role as an IT Engineer at Omilia, while fulfilling my military service as an IT Operations Administrator. My academic background is rooted in 5G research, specifically in Hybrid Wireless-Optical Networks (Radio over Fiber).",
                "With a focus on Endpoint Hardening, Network Security, and AI-driven operations (Atlassian Rovo, Gemini), I bridge the gap between complex infrastructure and operational efficiency.",
                "Based in Greece | Fluent in English (C2) & German (B2)",
                "I am a Computer and IT Engineer (M.Eng.) specializing in SecOps, infrastructure automation, and AI integration. Graduate of a Polytechnic-level University of computer engineering and informatics."
            ]
        },
        hero: {
            firstName: "ANDREAS",
            lastName: "FRAGKIADAKIS",
            typewriter: [
                    "MSc. COMPUTER ENGINEER",
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
            opportunitesTitle: "Open to Opportunities",
            opportunitesDescription: "Looking for full-time positions, freelance projects, or interesting collaborations. Let's build something amazing together.",
            sendMessage: "Send Message",
            downloadResume: "Download Resume"
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
                    "Provide internal user support and troubleshoot IT infrastructure using tools like Anydesk and RDP",
                    "Manage endpoint hardening and implement policies for PCI and SOC2 audits",
                    "Oversee cloud and network infrastructure with Jira Cloud, Cisco ISE, Microsoft Active Directory, and ESXi",
                    "Administer security and productivity tools including Google Workspace, HID systems, and 1Password"
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
                duration: "September 2019 – Present",
                details: [
                    "Distinguished member of the university's Tech Society",
                    "Relevant coursework: Advanced Computer Systems, AI, Network Security, Databases, Web Development, Cloud Computing",
                    "GPA: 2.98"
                ]
            },
            {
                degree: "Master of Science, Applied Computer Science",
                institution: "SRH Hochschule Heidelberg, Germany",
                duration: "April 2023 – October 2023 (ERASMUS+ Semester)",
                details: ["Awarded presenter and team leader"]
            },
            {
                degree: "ITIL 4 Foundation certified in IT Service Management",
                institution: "AXELOS Global Best Practice",
                duration: "2024",
                details: ["Knowledge of the ITIL 4 framework", "Focus on IT service management (ITSM) best practices"],
                link: "https://media.licdn.com/dms/document/media/v2/D4D1FAQFne7vVBSwMWg/feedshare-document-pdf-analyzed/B4DZpe2rFjJIAY-/0/1762527984124?e=1767225600&v=beta&t=qq_xBVY_ZcmQxX3w1qg6PVRKpANaqFN9jhh_BW15tBs"
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
        projectsTitle: "PROJECTS",
        projects: [
            {
                name: "Portfolio Website",
                year: 2026,
                tags: ["Next.js", "Three.js", "React", "TypeScript", "Framer Motion"],
                description: "Designed and built this modern portfolio (2026) with 3D graphics, smooth interactions, and animated sections. Features dark mode, responsive design, and professional animations.",
                githubLink: "https://github.com/Andrewfragkiadakis/andrewfragkiadakis.github.io",
                image: "/images/Porftolio website/2026.png"
            },
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
                year: 2026,
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
        github: "https://github.com/Andrewfragkiadakis",
        linkedin: "https://www.linkedin.com/in/andreas-fragkiadakis/",

        nav: {
            about: "ΣΧΕΤΙΚΑ",
            experience: "ΕΜΠΕΙΡΙΑ",
            projects: "PROJECTS",
            services: "ΥΠΗΡΕΣΙΕΣ",
            contact: "ΕΠΙΚΟΙΝΩΝΙΑ"
        },

        about: {
            title: "ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ",
            tagline: "Μηχανικός Πληροφορικής με πάθος για την κατασκευή εξαιρετικών ψηφιακών προϊόντων",
            readMore: "Διαβάστε περισσότερα",
            showLess: "Λιγότερα",
            description: [
                "Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) με εξειδίκευση σε SecOps, αυτοματισμό υποδομών και ενσωμάτωση Τεχνητής Νοημοσύνης. Η προσέγγισή μου συνδυάζει τη βαθιά τεχνική έρευνα με την εφαρμοσμένη μηχανική για τη δημιουργία ασφαλών, κλιμακούμενων και αυτοματοποιημένων περιβαλλόντων.",
                "Αυτή τη στιγμή, συνδυάζω τον ρόλο μου ως Μηχανικός Πληροφορικής στην Omilia, ενώ παράλληλα εκπληρώνω τις στρατιωτικές μου υποχρεώσεις ως Υπεύθυνος Πληροφορικής. Το ακαδημαϊκό μου υπόβαθρο βασίζεται στην έρευνα δικτύων 5G, και συγκεκριμένα στα Υβριδικά Ασύρματα-Οπτικά Δίκτυα (Radio over Fiber).",
                "Με έμφαση στην ενίσχυση τερματικών σημείων (Endpoint Hardening), την ασφάλεια δικτύων και τις λειτουργίες που βασίζονται στην Τεχνητή Νοημοσύνη (Atlassian Rovo, Gemini), γεφυρώνω το χάσμα μεταξύ πολύπλοκων υποδομών και επιχειρησιακής αποτελεσματικότητας.",
                "Με έδρα την Ελλάδα | Άριστη γνώση Αγγλικών (C2) & Γερμανικών (B2)",
                "Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) με εξειδίκευση σε SecOps, αυτοματισμό υποδομών και ενσωμάτωση Τεχνητής Νοημοσύνης. Απόφοιτος Πολυτεχνικού επιπέδου σχολής μηχανικών ηλεκτρονικών υπολογιστών και πληροφορικής."
            ]
        },
        hero: {
            firstName: "ΑΝΔΡΕΑΣ",
            lastName: "ΦΡΑΓΚΙΑΔΑΚΗΣ",
            typewriter: [
                "SYSTEM ENGINEER // IT & SECURITY ENGINEER",
                "NETWORK & SYSTEMS ENGINEER",
                "CONVERSATIONAL AI ENGINEER",
                "INFRASTRUCTURE & SUPPORT ENGINEER",
                "CLOUD & DEVOPS ENTHUSIAST",
                "APPLIED COMPUTER SCIENCE SPECIALIST",
                "CREATIVE PROBLEM SOLVER"
            ],
            viewWork: "View My Work",
            getInTouch: "Get In Touch",
            scroll: "SCROLL TO NAVIGATE"
        },
        contact: {
            title: "ΕΠΙΚΟΙΝΩΝΙΑ",
            subtitle: "ΕΛΑΤΕ ΣΕ ΕΠΑΦΗ",
            infoTitle: "Στοιχεία Επικοινωνίας",
            socialTitle: "Βρείτε με στα social",
            opportunitesTitle: "Διαθέσιμος για νέες ευκαιρίες",
            opportunitesDescription: "Freelance projects ή ενδιαφέρουσες συνεργασίες. Ας δημιουργήσουμε κάτι μοναδικό μαζί.",
            sendMessage: "Αποστολη Μηνυματος",
            downloadResume: "Ληψη Βιογραφικου"
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
        services: [
            {
                icon: "fas fa-laptop-code",
                title: "Ανάπτυξη Web",
                description: "Κατασκευή γρήγορων, responsive και κλιμακούμενων εφαρμογών με σύγχρονα frameworks (Next.js, React, TypeScript), εστιάζοντας στον καθαρό κώδικα και την εμπειρία χρήστη."
            },
            {
                icon: "fas fa-headset",
                title: "IT Service & Support",
                description: "Διαχείριση περιβαλλόντων IT με έμφαση στην αξιοπιστία, την επίλυση προβλημάτων και την τήρηση βέλτιστων πρακτικών ITIL."
            },
            {
                icon: "fas fa-robot",
                title: "AI & Αυτοματισμός",
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
                    "Παροχή εσωτερικής υποστήριξης χρηστών και troubleshooting υποδομών IT (Anydesk, RDP)",
                    "Διαχείριση θωράκισης τερματικών (endpoint hardening) και εφαρμογή πολιτικών για ελέγχους PCI και SOC2",
                    "Επίβλεψη υποδομών Cloud και δικτύου (Jira Cloud, Cisco ISE, Active Directory, ESXi)",
                    "Διαχείριση εργαλείων ασφάλειας και παραγωγικότητας (Google Workspace, HID systems, 1Password)"
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
                duration: "Σεπτέμβριος 2019 - Παρόν",
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
                link: "https://media.licdn.com/dms/document/media/v2/D4D1FAQFne7vVBSwMWg/feedshare-document-pdf-analyzed/B4DZpe2rFjJIAY-/0/1762527984124?e=1767225600&v=beta&t=qq_xBVY_ZcmQxX3w1qg6PVRKpANaqFN9jhh_BW15tBs"
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
            githubCta: "Δείτε το πλήρες Portfolio στο GitHub"
        },
        projectsTitle: "PROJECTS",
        projects: [
            {
                name: "Προσωπική Ιστοσελίδα Portfolio",
                year: 2026,
                tags: ["Next.js", "Three.js", "React", "TypeScript", "Framer Motion"],
                description: "Σχεδίαση και υλοποίηση modern portfolio με 3D γραφικά, ομαλές αλληλεπιδράσεις (animations) και Dark Mode.",
                githubLink: "https://github.com/Andrewfragkiadakis/andrewfragkiadakis.github.io",
                image: "/images/Porftolio website/2026.png"
            },
            {
                name: "Plano Plus - Επιγραφές & Οπτική Ταυτότητα",
                year: 2026,
                tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Resend"],
                description: "Ιστοσελίδα στούντιο επιγραφών και οπτικής επικοινωνίας με Next.js App Router. Χαρακτηριστικά: light/dark theme, parallax effects, smooth scrolling, φόρμα επικοινωνίας με email integration, και σύγχρονο UI/UX. Εξυπηρετεί πελάτες σε όλη την Κρήτη με επαγγελματικές λύσεις επιγραφών και branding.",
                liveSiteLink: "https://www.planoplus.gr/",
                githubLink: "https://github.com/Andrewfragkiadakis/Plano-Plus",
                image: "/images/PlanoPlus/plano.png"
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
                name: "HappyFox 🦊 - Εφαρμογή Ψυχικής Υγείας",
                year: 2026,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Σχεδιασμός UI/UX για εφαρμογή ψυχικής υγείας με στόχο την προώθηση της συναισθηματικής ευεξίας. Υλοποιήθηκε στα πλαίσια μεταπτυχιακού μαθήματος.",
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Ιστοσελίδα Κέντρων Ξένων Γλωσσών Schiller",
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
                name: "Έρευνα: LLMs & Ανθρώπινη Γνώση",
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