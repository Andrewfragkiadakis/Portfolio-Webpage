Role & Goal
Act as an Elite Creative Technologist and Lead Front-End Architect. Your goal is to engineer a high-performance, visionary masterplan and code foundation for a world-class personal portfolio. The output must balance bleeding-edge aesthetics with technical rigor, specifically optimized for the Next.js App Router and static deployment.

Technical Stack
Framework: Next.js 15 (App Router) + TypeScript (Strict Mode).

Styling: Tailwind CSS (Custom Glassmorphism config).

3D/Graphics: React Three Fiber (R3F) + Drei + Custom GLSL Shaders.

Animation: Framer Motion (Layout transitions + Scroll-linked logic).

UX/Smoothness: Lenis Scroll + Custom SVG Reactive Cursor.

Design & UI Philosophy: "The Glass Nexus"
Aesthetic: Dark-themed Glassmorphism. Implement a depth-heavy UI using backdrop-blur-xl, bg-white/5, and border-white/10.

Lighting: Use CSS Mesh Gradients and Radial Spotlights that follow the mouse.

The 3D Hero: A custom Fragment Shader on a plane or sphere. Use Perlin Noise to drive organic, morphing distortions. The shader must be optimized for GPU performance (no frame drops).

Typography: High-contrast sans-serif (e.g., Inter or Geist) with oversized headers and subtle letter-spacing animations.

I. The Architectural Blueprint
File Hierarchy: Provide a modular src/ directory structure. Separate components/ui (stateless), components/sections (logic-heavy), and hooks/ (scroll/state).

Tailwind Extension: Provide a tailwind.config.ts snippet that includes custom keyframes for "border-glow" and "mesh-drift."

Smooth Scroll: Provide a SmoothScroll wrapper using @studio-freight/lenis.

II. Core Implementation (The "Wow" Factor)
Shader Hero Component: Create a HeroCanvas.tsx using @react-three/fiber. Include a GLSL fragmentShader that produces a morphing, organic glass-like blob.

Interactive Cursor: A Cursor.tsx component using framer-motion's useSpring. It must morph (scale/change color) when hovering over data-cursor="pointer" elements.

"Story Mode" Timeline: A vertical component where a motion.div progress bar fills based on useScroll. Use sticky positioning for year-markers that "light up" when they enter the viewport.

Project Grid: Implement a "Tilt" effect using Framer Motion's useMotionValue for a 3D perspective hover on project cards.

III. Internationalization (Bilingual EN/GR)
State Strategy: Use a lightweight ContentContext to toggle between en and gr.

Metadata: Show how to implement a dynamic generateMetadata function that swaps SEO tags based on the active language.

IV. Static Optimization & Deployment
Static Export: Configuration for next.config.js with output: 'export' and images: { unoptimized: true }.

GitHub Actions: A YAML workflow to build and deploy to GitHub Pages automatically.

Content Data
Use the provided TypeScript content object to populate all UI elements. Ensure the "Experience" section is mapped correctly to the "Story Mode" timeline.
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
        description: string[]
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
    contactTitle: string
    copyright: string
}

export const content: Record<'en' | 'gr', Content> = {
    en: {
        name: "ANDREAS FRAGKIADAKIS",
        title: "Creative Technologist",
        location: "Athens, Greece",
        phone: "(+30) 697-345-3683",
        email: "andrewfragkiadakis@gmail.com",
        github: "https://github.com/Andrewfragkiadakis",
        linkedin: "https://linkedin.com/in/andreas-fragkiadakis",

        nav: {
            about: "ABOUT",
            experience: "EXPERIENCE",
            projects: "PROJECTS",
            services: "WHAT I DO",
            contact: "CONTACT"
        },

        about: {
            title: "ABOUT ME",
            description: [
                "Dedicated IT & Computer Engineering student with expertise in networking, system administration, and project management. Analytical and detail-oriented, with hands-on experience in web development, technical support, and infrastructure coordination.",
                "Fluent in English (C2) and German (B2), delivering innovative solutions to drive efficiency and growth.",
                "Currently writing my thesis on 'New Hybrid Wireless-Optical Networks (Radio over Fiber) for Fifth Generation (5G) Networks' and working at OMILIA LTD as an IT Engineer."
            ]
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
            }
        ],

        projectsTitle: "PROJECTS",
        projects: [
            {
                name: "Portfolio Website",
                year: 2025,
                tags: ["Next.js", "Three.js", "React", "TypeScript", "Framer Motion"],
                description: "Designed and built this modern portfolio (2025) with 3D graphics, smooth interactions, and animated sections. Features dark mode, responsive design, and professional animations.",
                githubLink: "https://github.com/Andrewfragkiadakis/andrewfragkiadakis.github.io",
                image: "/images/Porftolio website/portfolio-site-2025.png"
            },
            {
                name: "HappyFox 🦊 - Mental Health App",
                year: 2025,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Developed UI/UX concepts for a user-friendly mental health app aimed at promoting emotional well-being during a Master's course.",
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Schiller Language Centers Website",
                year: 2025,
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
                name: "Thesis: Hybrid Wireless-Optical Networks for 5G",
                year: 2025,
                tags: ["Thesis", "5G", "Radio over Fiber", "Research"],
                description: "Master's thesis on new hybrid wireless-optical networks (Radio over Fiber) for 5G. Includes research and full thesis documentation.",
                liveSiteLink: "/thesis-presentation.html",
                reportLink: "https://drive.usercontent.google.com/download?id=1iayG5SCoUykioRzLPl1BeOkO7iwxxHkD&export=download&authuser=0",
                image: "/images/thesis-presentation/thesis-image.png"
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
                name: "Silence Hero - Chrome Extension",
                year: 2024,
                tags: ["Chrome Extension", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "A Chrome extension that helps you remember Greek quiet hours with visual cues and a countdown timer. Never disturb your neighbors again!",
                githubLink: "https://github.com/Andrewfragkiadakis/Silence-Hero",
                image: "/images/silence-hero/silence-hero.png"
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
        copyright: "© 2025 Created By Andreas Fragkiadakis. All rights reserved."
    },

    gr: {
        name: "ΑΝΔΡΕΑΣ ΦΡΑΓΚΙΑΔΑΚΗΣ",
        title: "Creative Technologist",
        location: "Αθήνα, Ελλάδα",
        phone: "(+30) 697-345-3683",
        email: "andrewfragkiadakis@gmail.com",
        github: "https://github.com/Andrewfragkiadakis",
        linkedin: "https://linkedin.com/in/andreas-fragkiadakis",

        nav: {
            about: "ΣΧΕΤΙΚΑ",
            experience: "ΕΜΠΕΙΡΙΑ",
            projects: "PROJECTS",
            services: "ΥΠΗΡΕΣΙΕΣ",
            contact: "ΕΠΙΚΟΙΝΩΝΙΑ"
        },

        about: {
            title: "ΣΧΕΤΙΚΑ ΜΕ ΕΜΕΝΑ",
            description: [
                "Αφοσιωμένος Φοιτητής Πληροφορικής & Μηχανικής Υπολογιστών με εξειδίκευση στα Δίκτυα, τη διαχείριση συστημάτων και το project management. Αναλυτικός και προσηλωμένος στη λεπτομέρεια, με πρακτική εμπειρία στην ανάπτυξη ιστοσελίδων, τεχνική υποστήριξη και συντονισμό υποδομών.",
                "Άπταιστη γνώση της Αγγλικής (C2) και Γερμανικής (B2), παρέχοντας καινοτόμες λύσεις για την αύξηση της αποδοτικότητας και της ανάπτυξης.",
                "Αυτή τη στιγμή γράφω τη Διπλωματική μου εργασία με τίτλο 'Νέα Υβριδικά Ασύρματα-Οπτικά Δίκτυα (Radio over Fiber) για Δίκτυα Πέμπτης Γενιάς (5G)' και εργάζομαι στην OMILIA LTD ως Μηχανικός Υποστήριξης Πληροφορικής."
            ]
        },

        skillsTitle: "ΒΑΣΙΚΕΣ ΔΕΞΙΟΤΗΤΕΣ",
        skills: [
            {
                icon: "fas fa-network-wired",
                label: "Δικτύωση & Διαχ. Συστημάτων",
                detail: "Άριστη γνώση στη διαμόρφωση και συντήρηση πολύπλοκων δικτυακών υποδομών, εξασφαλίζοντας βέλτιστη απόδοση και ασφάλεια. Εμπειρία με Cisco, Active Directory και διάφορα εργαλεία παρακολούθησης."
            },
            {
                icon: "fas fa-laptop-code",
                label: "Ανάπτυξη Web",
                detail: "Δεξιότητες σε τεχνολογίες front-end και back-end, συμπεριλαμβανομένων HTML, CSS, JavaScript και React. Πάθος για τη δημιουργία responsive και φιλικών προς τον χρήστη διαδικτυακών εφαρμογών."
            },
            {
                icon: "fas fa-shield-alt",
                label: "Ασφάλεια Συστημάτων",
                detail: "Γνώση στην εφαρμογή βέλτιστων πρακτικών ασφαλείας, ενίσχυση τερματικών σημείων και διαχείριση ελέγχων πρόσβασης. Εξοικείωση με τις απαιτήσεις συμμόρφωσης PCI/SOC2."
            },
            {
                icon: "fas fa-lightbulb",
                label: "Επίλυση Προβλημάτων",
                detail: "Εμπειρία στη διάγνωση και επίλυση προβλημάτων υλικού, λογισμικού και δικτύου με αποτελεσματικότητα, ελαχιστοποιώντας τον χρόνο εκτός λειτουργίας και τον αντίκτυπο στους χρήστες."
            },
            {
                icon: "fas fa-tasks",
                label: "Διαχείριση Έργων",
                detail: "Εμπειρία στην καθοδήγηση και συντονισμό έργων πληροφορικής, από τον σχεδιασμό και την εκτέλεση έως την παρακολούθηση και την παράδοση, διασφαλίζοντας την ολοκλήρωση των έργων εντός χρονοδιαγράμματος και προϋπολογισμού."
            },
            {
                icon: "fas fa-language",
                label: "Εξαιρετική Επικοινωνία",
                detail: "Ισχυρές προφορικές και γραπτές επικοινωνιακές δεξιότητες στα Αγγλικά (C2), Ελληνικά (Μητρική) και Γερμανικά (B2), διευκολύνοντας τη σαφή και αποτελεσματική συνεργασία με τεχνικούς και μη τεχνικούς συνεργάτες."
            }
        ],

        servicesTitle: "ΥΠΗΡΕΣΙΕΣ",
        services: [
            {
                icon: "fas fa-laptop-code",
                title: "Ανάπτυξη Web",
                description: "Κατασκευή γρήγορων, responsive και κλιμακούμενων διαδικτυακών εφαρμογών χρησιμοποιώντας σύγχρονα frameworks όπως Next.js, React και TypeScript, με έμφαση στον καθαρό κώδικα, την απόδοση και την εμπειρία χρήστη."
            },
            {
                icon: "fas fa-headset",
                title: "Υπηρεσίες & Υποστήριξη IT",
                description: "Διαχείριση περιβαλλόντων IT με έμφαση στην επίλυση προβλημάτων και την τήρηση βέλτιστων πρακτικών ITIL για επαγγελματική διαχείριση υπηρεσιών."
            },
            {
                icon: "fas fa-robot",
                title: "AI & Αυτοματισμός",
                description: "Ανάπτυξη και ενσωμάτωση λύσεων τεχνητής νοημοσύνης και αυτοματοποίηση ροών εργασίας για αύξηση αποδοτικότητας, βελτίωση λήψης αποφάσεων και βελτιστοποίηση επιχειρηματικών λειτουργιών."
            }
        ],

        experienceTitle: "ΕΠΑΓΓΕΛΜΑΤΙΚΗ ΕΜΠΕΙΡΙΑ",
        experience: [
            {
                role: "Μηχανικός Υποστήριξης Πληροφορικής",
                company: "OMILIA LTD, Αθήνα, Ελλάδα",
                duration: "Σεπτέμβριος 2024 – Σήμερα",
                tasks: [
                    "Παροχή εσωτερικής υποστήριξης χρηστών και αντιμετώπιση προβλημάτων υποδομής Πληροφορικής με εργαλεία όπως Anydesk και RDP",
                    "Διαχείριση ενίσχυσης τερματικών και εφαρμογή πολιτικών για ελέγχους PCI και SOC2",
                    "Επίβλεψη υποδομών cloud και δικτύου με εργαλεία όπως Jira Cloud, Cisco ISE, Microsoft Active Directory και ESXi",
                    "Διαχείριση λύσεων ασφάλειας και παραγωγικότητας όπως Google Workspace, συστήματα HID και 1Password"
                ]
            },
            {
                role: "Συντονιστής Υποστήριξης & Υποδομών Πληροφορικής",
                company: "KEEP EAT HEALTHY, Αθήνα, Ελλάδα",
                duration: "Μάιος 2022 - Σήμερα",
                tasks: [
                    "Παροχή υποστήριξης πληροφορικής και συντονισμός υποδομών",
                    "Επίβλεψη της εγκατάστασης και της συντήρησης των συστημάτων ΤΠ",
                    "Αντιμετώπιση τεχνικών ζητημάτων και πρόταση σύγχρονων λύσεων"
                ]
            },
            {
                role: "Ειδικός Υποστήριξης Πληροφορικής",
                company: "ANEMOMYLOI ANDROS AE, Άνδρος, Ελλάδα",
                duration: "Ιανουάριος 2023 - Φεβρουάριος 2024",
                tasks: [
                    "Παροχή υπηρεσιών απομακρυσμένης υποστήριξης και συμβουλών ΤΠ",
                    "Συνδρομή στην υποδομή πληροφορικής και την υποστήριξη εταιρικών έργων",
                    "Οργάνωση portfolio εταιρίας & οικονομικών αρχείων"
                ]
            },
            {
                role: "Web Developer",
                company: "Freelance, Αθήνα, Ελλάδα",
                duration: "2020 - Νοέμβριος 2023",
                tasks: [
                    "Ανάπτυξη και λανσάρισμα λειτουργίας δύο πλήρως λειτουργικών ιστότοπων"
                ]
            },
            {
                role: "Τεχνικός Εγκατάστασης και Διαμόρφωσης Δικτυακών Συστημάτων",
                company: "Weballdesign, Αθήνα, Ελλάδα",
                duration: "2020 - Νοέμβριος 2022",
                tasks: [
                    "Ρύθμιση και διαμόρφωση συστημάτων διακομιστών και πελατών σε εκπαιδευτικά ιδρύματα & σχολεία",
                    "Ρύθμιση και συντήρηση υποδομών δικτύου, συμπεριλαμβανομένων Routers, Switches και UPS",
                    "Διασφάλιση της σωστής συνδεσιμότητα δικτύου και διενέργεια διαγνωστικών δικτύου"
                ]
            }
        ],

        educationTitle: "ΕΚΠΑΙΔΕΥΣΗ",
        education: [
            {
                degree: "Integrated Master's degree (5yrs), Computer Science",
                institution: "Πανεπιστήμιο Δυτικής Αττικής",
                duration: "Σεπτέμβριος 2019 - Παρόν",
                details: [
                    "Διακεκριμένο μέλος του Tech Society του πανεπιστημίου",
                    "Σχετικές γνώσεις: Υπολογιστικά Συστήματα, Τεχνητή Νοημοσύνη, Ασφάλεια Δικτύων, Συστήματα Διαχείρισης Βάσεων Δεδομένων, Τεχνολογία Λογισμικού, Ανάπτυξη Ιστού, Υπολογιστικό Νέφος",
                    "ΜΈΣΟΣ ΌΡΟΣ ΒΑΘΜΟΛΟΓΊΑΣ: 7.6 (2.98 GPA)"
                ]
            },
            {
                degree: "Μεταπτυχιακός τίτλος σπουδών (MS), Εφαρμοσμένη Πληροφορική",
                institution: "SRH Hochschule Heidelberg",
                duration: "Απρίλιος 2023 - Οκτώβριος 2023 (Ακαδ. Εξάμηνο)",
                details: ["Φοιτητικό εξάμηνο ERASMUS+", "Βραβευμένος ομιλητής & επικεφαλής ομάδας"]
            }
        ],

        projectsTitle: "ΠΡΟΣΩΠΙΚΑ PROJECTS",
        projects: [
            {
                name: "Προσωπική Ιστοσελίδα Portfolio",
                year: 2025,
                tags: ["Next.js", "Three.js", "React", "TypeScript", "Framer Motion"],
                description: "Σχεδίαση και κατασκευή αυτής της σύγχρονης ιστοσελίδας (2025) με 3D γραφικά, ομαλές αλληλεπιδράσεις και animated τμήματα. Διαθέτει dark mode, responsive design και επαγγελματικά animations.",
                githubLink: "https://github.com/Andrewfragkiadakis/andrewfragkiadakis.github.io",
                image: "/images/Porftolio website/portfolio-site-2025.png"
            },
            {
                name: "HappyFox 🦊 - Εφαρμογή Ψυχικής Υγείας",
                year: 2025,
                tags: ["UI/UX Design", "Figma", "Team Project", "SRH Heidelberg"],
                description: "Ανάπτυξη concepts UI/UX για μια φιλική προς τον χρήστη εφαρμογή ψυχικής υγείας με στόχο την προώθηση της συναισθηματικής ευεξίας κατά τη διάρκεια μεταπτυχιακού μαθήματος.",
                githubLink: "https://github.com/Andrewfragkiadakis/Mental-Health-Project/tree/main",
                image: "/images/happyfox/happyfox-app.png"
            },
            {
                name: "Ιστοσελίδα Κέντρων Ξένων Γλωσσών Schiller",
                year: 2025,
                tags: ["Wix", "Wix Studio", "Ανάπτυξη Web", "Εκπαιδευτικό"],
                description: "Ανάπτυξη της ιστοσελίδας για τα Κέντρα Ξένων Γλωσσών Schiller στο Ρέθυμνο. Η σελίδα παρουσιάζει μαθήματα Αγγλικών, Γερμανικών και Εκπαιδευτικής Ρομποτικής.",
                liveSiteLink: "https://www.schiller.edu.gr/",
                image: "/images/Schiller Project/schiller.png"
            },
            {
                name: "Raspberry Pi Adblocker & Streamer",
                year: 2024,
                tags: ["Raspberry Pi", "Linux", "Networking", "Pi-hole", "Plex"],
                description: "Διαμόρφωση Raspberry Pi για αποκλεισμό διαφημίσεων σε όλο το δίκτυο (Pi-hole) και streaming πολυμέσων (Plex) σε οικιακό δίκτυο.",
                image: "/images/Raspberry Pi Adblocker & Streamer/raspberry-pi.png"
            },
            {
                name: "Διπλωματική: Υβριδικά ασύρματα-οπτικά δίκτυα για 5G",
                year: 2025,
                tags: ["Διπλωματική", "5G", "Radio over Fiber", "Έρευνα"],
                description: "Διπλωματική εργασία με θέμα τα νέα υβριδικά ασύρματα-οπτικά δίκτυα (Radio over Fiber) για 5G. Περιλαμβάνει έρευνα και πλήρη τεκμηρίωση.",
                liveSiteLink: "/thesis-presentation.html",
                reportLink: "https://drive.usercontent.google.com/download?id=1iayG5SCoUykioRzLPl1BeOkO7iwxxHkD&export=download&authuser=0",
                image: "/images/thesis-presentation/thesis-image.png"
            },
            {
                name: "Έρευνα: LLMs & Ανθρώπινη Γνώση",
                year: 2024,
                tags: ["Research", "Cognitive Science", "LLMs", "GPT-3", "Python"],
                description: "Σύγκριση απόδοσης GPT-3 και ανθρώπων στο False Belief Task για την αξιολόγηση της απόδοσης πεποιθήσεων σε LLMs. Δημοσιεύθηκε στο Cognitive Science.",
                reportLink: "https://drive.google.com/uc?export=download&id=1w_3VG01O34Q9lNhrvKmhXno2OfptYJYi",
                publicationLink: "https://onlinelibrary.wiley.com/doi/10.1111/cogs.13309",
                image: "/images/Research LLMs & Human Knowledge/llm-research.png"
            },
            {
                name: "Silence Hero - Επέκταση για Chrome",
                year: 2024,
                tags: ["Επέκταση Chrome", "JavaScript", "HTML", "CSS", "UI/UX"],
                description: "Επέκταση Chrome που σας βοηθά να θυμάστε τις ώρες κοινής ησυχίας στην Ελλάδα με οπτικές ενδείξεις και χρονόμετρο αντίστροφης μέτρησης. Μη ξαναενοχλήσετε τους γείτονές σας!",
                githubLink: "https://github.com/Andrewfragkiadakis/Silence-Hero",
                image: "/images/silence-hero/silence-hero.png"
            },
            {
                name: "The Friendly Wheelchair (Concept)",
                year: 2023,
                tags: ["Project Management", "AI", "NLP", "Agile/SCRUM", "Healthcare IT"],
                description: "Ανάπτυξη λεπτομερούς σχεδίου διαχείρισης έργου και τεχνικών προδιαγραφών για ένα concept αυτόνομου αναπηρικού αμαξιδίου με AI για τις κλινικές της Χαϊδελβέργης.",
                reportLink: "https://drive.google.com/uc?export=download&id=18gqsCB6UYA1wMTBFjkw2jBoYMqK_HsZT",
                image: "/images/The Friendly Wheelchair (Concept)/friendly-wheelchair.png"
            }
        ],

        contactTitle: "ΕΠΙΚΟΙΝΩΝΙΑ",
        copyright: "© 2025 Created By Ανδρέας Φραγκιαδάκης. All rights reserved."
    }
}
