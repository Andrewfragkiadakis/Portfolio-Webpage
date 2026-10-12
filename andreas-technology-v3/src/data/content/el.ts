import type { Content } from './types'
import { SOCIAL_URLS } from '@/data/site'

const el: Content = {
    location: "Αθήνα, Ελλάδα",
    email: "andrewfragkiadakis@gmail.com",
    github: SOCIAL_URLS.github,
    linkedin: SOCIAL_URLS.linkedin,

    about: {
        description: [
            "Είμαι Μηχανικός Πληροφορικής και Υπολογιστών (M.Eng.) και Team Lead της ομάδας Apple Fleet & IT Automation στην Omilia, μια παγκόσμια εταιρεία conversational AI. Έχω πλήρη ευθύνη για το Jamf Pro σε 550+ Mac και ηγούμαι του endpoint engineering για Check Point Harmony Endpoint, Microsoft Sentinel και αυτοματοποίηση πιστοποιητικών SSL.",
            "Στην πράξη: θωράκιση κατά CIS Benchmarks ενόψει ελέγχων PCI DSS και SOC 2, και zero‑touch enrollment που μείωσε τον χρόνο onboarding των Mac κατά 70%.",
            "Παράλληλα προωθώ την υιοθέτηση AI: Google Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents και ένα pipeline διαλογής αιτημάτων με AI που μείωσε τον μέσο χρόνο triage σε 350+ tickets.",
            "Jamf Certified Tech (Jamf 200) · Αδειούχος μηχανικός ΤΕΕ · ITIL 4 Foundation · Αθήνα · Αγγλικά (C2), Ελληνικά (μητρική), Γερμανικά (B2)"
        ]
    },

    skills: [
        {
            id: "apple-fleet",
            icon: "laptop",
            label: "Apple Fleet & MDM",
            detail: "Jamf Certified Tech (Jamf 200). Διαχειρίζομαι εξ ολοκλήρου το Jamf Pro για 550+ Mac: zero‑touch enrollment μέσω Apple Business Manager, configuration profiles, ενημερώσεις, Self Service και καθημερινή συντήρηση του στόλου."
        },
        {
            id: "endpoint-security",
            icon: "shield",
            label: "Endpoint Security & Identity",
            detail: "Check Point Harmony Endpoint, θωράκιση κατά CIS Benchmarks για ελέγχους PCI DSS και SOC 2, pipelines Microsoft Sentinel SIEM, και διαχείριση ταυτότητας και πρόσβασης με Microsoft Entra ID, Duo MFA και 1Password."
        },
        {
            id: "automation",
            icon: "terminal",
            label: "IT Automation & Scripting",
            detail: "Python, Bash/zsh, Swift/AppleScript και TypeScript πάνω σε πραγματικά APIs: εργαλεία Jamf API, log collectors για SIEM και pipeline acme.sh / Let's Encrypt που κατάργησε τις χειροκίνητες ανανεώσεις πιστοποιητικών σε Cisco ISE, ESXi και Proxmox."
        },
        {
            id: "ai-workflow",
            icon: "sparkles",
            label: "AI & Workflow Automation",
            detail: "Υιοθέτηση AI σε εταιρικό επίπεδο: Google Gemini σε όλο τον οργανισμό, Atlassian Rovo Agents, Claude Code και MCP servers, καθώς και pipeline AI ticket-triage στο Jira Service Management."
        }
    ],

    services: [
        {
            id: "endpoint-security",
            icon: "shield",
            title: "Ασφάλεια Τερματικών & Συμμόρφωση",
            oneLiner: "Mac θωρακισμένα κατά CIS, με EDR, έτοιμα για ελέγχους PCI DSS και SOC 2.",
            detail: "Ασφάλεια που αντέχει τόσο σε έλεγχο όσο και στην παραγωγή. Εφάρμοσα θωράκιση κατά CIS Benchmarks σε όλο τον στόλο πριν από ελέγχους PCI DSS και SOC 2, ηγήθηκα της μετάβασης σε Check Point Harmony Endpoint και τροφοδοτώ το Microsoft Sentinel με telemetry τερματικών ώστε η ανίχνευση να έχει πραγματικό πλαίσιο.",
            highlights: [
                "Θωράκιση κατά CIS Benchmarks πριν από ελέγχους PCI DSS και SOC 2",
                "Μετάβαση EDR με επίλυση συγκρούσεων FileVault και μηδενική απώλεια δεδομένων",
                "Pipelines Sentinel SIEM μέσω RFC 5424 + TLS"
            ],
            tools: ["Check Point Harmony Endpoint", "Microsoft Sentinel", "Jamf Pro", "Microsoft Entra ID", "Duo MFA", "1Password"]
        },
        {
            id: "apple-fleet",
            icon: "laptop",
            title: "Διαχείριση Στόλου Apple",
            oneLiner: "550+ Mac στο Jamf Pro. Zero‑touch enrollment, 70% λιγότερος χρόνος onboarding.",
            detail: "Διαχειρίζομαι εξ ολοκλήρου το Jamf Pro για στόλο 550+ Mac. Ένα νέο Mac εγγράφεται αυτόματα μέσω Apple Business Manager, λαμβάνει profiles και εφαρμογές και είναι έτοιμο από την πρώτη μέρα — το zero‑touch enrollment μείωσε τον χρόνο onboarding κατά 70%.",
            highlights: [
                "Jamf Certified Tech (Jamf 200)",
                "Zero‑touch enrollment: 70% λιγότερος χρόνος onboarding",
                "Configuration profiles, ενημερώσεις, Self Service και συντήρηση στόλου"
            ],
            tools: ["Jamf Pro", "Apple Business Manager", "macOS", "Bash / zsh", "Swift", "AppleScript"]
        },
        {
            id: "automation",
            icon: "gear",
            title: "Αυτοματισμός IT & Scripting",
            oneLiner: "Python, Bash και Swift πάνω σε πραγματικά APIs — τέλος στη χειροκίνητη δουλειά.",
            detail: "Ό,τι γίνεται δύο φορές, γίνεται script. Γράφω Bash, Python, Swift και TypeScript πάνω σε πραγματικά APIs, από εργαλεία Jamf έως ένα κεντρικό pipeline που ανανεώνει πιστοποιητικά SSL για Cisco ISE, ESXi, Proxmox και HPE iLO χωρίς χειροκίνητα βήματα.",
            highlights: [
                "Εργαλεία Jamf API και log collectors για SIEM",
                "Ανανεώσεις acme.sh / Let's Encrypt DNS-01 — χωρίς χειροκίνητη διαχείριση πιστοποιητικών",
                "Scripts με version control και review στο Git"
            ],
            tools: ["Python", "Bash / zsh", "TypeScript", "Swift", "Git / GitHub", "acme.sh / Let's Encrypt"]
        },
        {
            id: "ai-operations",
            icon: "sparkles",
            title: "Λειτουργίες IT με AI",
            oneLiner: "Gemini σε όλο τον οργανισμό, Rovo Agents και διαλογή αιτημάτων με AI στο Jira.",
            detail: "AI που κάνει πραγματική δουλειά. Εισήγαγα το Google Gemini σε όλο τον οργανισμό και τους Atlassian Rovo Agents, δημιούργησα pipeline διαλογής αιτημάτων με AI για το Jira Service Management και αναπτύσσω prototypes MCP servers ώστε βοηθοί όπως το Claude Code να δουλεύουν απευθείας με τα συστήματα IT.",
            highlights: [
                "Ανάπτυξη Google Gemini σε όλο τον οργανισμό",
                "Διαλογή αιτημάτων με AI σε 350+ tickets",
                "Prototypes MCP servers για εργαλεία IT"
            ],
            tools: ["Claude Code", "MCP Servers", "Google Gemini", "Grok Bot", "Atlassian Rovo", "Jira Service Management", "Slack"]
        },
        {
            id: "itsm",
            icon: "headphones",
            title: "IT Service Management",
            oneLiner: "Υπηρεσίες IT κατά ITIL 4: 350+ tickets με SLA άνω του 95%.",
            detail: "Υποστήριξη στην οποία μπορεί κανείς να βασιστεί. Με πιστοποίηση ITIL 4, συνδυάζω σαφείς διαδικασίες incident και request με αυτοματισμό και τεκμηρίωση, ώστε η ουρά να μένει μικρή και οι απαντήσεις να βρίσκονται εύκολα.",
            highlights: [
                "Πιστοποίηση ITIL 4 Foundation",
                "350+ Jira tickets με SLA 95%+",
                "40+ οδηγοί Confluence και διαχείριση 9 εταιρικών πλατφορμών"
            ],
            tools: ["Jira Service Management", "Confluence", "Atlassian Rovo", "Slack", "Google Workspace"]
        },
        {
            id: "infrastructure",
            icon: "network",
            title: "Δίκτυα & Υποδομές",
            oneLiner: "Cisco ISE, Active Directory, ESXi και Proxmox — η βάση κάτω από όλα.",
            detail: "Η βάση πάνω στην οποία στηρίζονται όλα: έλεγχος πρόσβασης δικτύου με Cisco ISE, ταυτότητα σε Active Directory και Entra ID, και virtualization σε VMware ESXi και Proxmox — με MFA, πιστοποιητικά και monitoring σε τάξη γύρω τους.",
            highlights: [
                "Έλεγχος πρόσβασης δικτύου με Cisco ISE",
                "Ταυτότητα σε Active Directory και Entra ID",
                "Virtualization σε VMware ESXi και Proxmox"
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
            company: "Omilia, Αθήνα",
            duration: "Απρίλιος 2026 – Σήμερα",
            tasks: [
                "Πλήρης ευθύνη για τον τομέα Apple Fleet & IT Automation, την πλατφόρμα Jamf Pro και τα AI pipelines σε 550+ τερματικά macOS",
                "Ηγεσία automation engineering σε Bash, Python και TypeScript — Jamf API, διαλογή αιτημάτων με AI, prototypes MCP servers και υποδομή ανανέωσης SSL",
                "Συνεργασία με Cyber, HR, Finance και Engineering για ταχύτερο onboarding, λιγότερα tickets και μηδενική χειροκίνητη διαχείριση πιστοποιητικών"
            ]
        },
        {
            id: "omilia-it-engineer",
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
            id: "military-service",
            role: "Στρατιωτική θητεία — IT & διοικητική υποστήριξη",
            company: "Ελληνικός Στρατός",
            duration: "Νοέμβριος 2025 – Αύγουστος 2026",
            tasks: [
                "Παροχή υπηρεσιών IT operations και διοικητικής υποστήριξης με αναφορά απευθείας στον Υποδιοικητή Τάγματος",
                "Εκσυγχρονισμός βάσης δεδομένων προσωπικού και αναβάθμιση δικτυακής υποδομής τάγματος"
            ]
        },
        {
            id: "keep-eat-healthy",
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
            id: "anemomyloi-andros",
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
            id: "freelance-web",
            role: "Web Developer",
            company: "Freelance, Ελλάδα",
            duration: "2020 – Νοέμβριος 2023",
            tasks: [
                "Ανάπτυξη ιστοσελίδων end-to-end: domain, DNS, SSL/TLS, hosting, MySQL, WordPress και SEO",
                "Βελτίωση της οργανικής προβολής στις μηχανές αναζήτησης με structured data και βελτιστοποίηση απόδοσης"
            ]
        },
        {
            id: "weballdesign",
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

    education: [
        {
            id: "uniwa-meng",
            degree: "Δίπλωμα Μηχανικού Πληροφορικής και Υπολογιστών (Integrated Master)",
            institution: "Πανεπιστήμιο Δυτικής Αττικής",
            duration: "Σεπτέμβριος 2019 – Ιούνιος 2025",
            details: [
                "Ενεργό μέλος του Tech Society του πανεπιστημίου",
                "Σχετικά μαθήματα: Προηγμένα Υπολογιστικά Συστήματα, AI, Ασφάλεια Δικτύων, Βάσεις Δεδομένων, Web Development, Cloud Computing"
            ]
        },
        {
            id: "srh-erasmus",
            degree: "Εξάμηνο Erasmus+, M.Sc. Applied Computer Science",
            institution: "SRH Hochschule Heidelberg, Γερμανία",
            duration: "Απρίλιος 2023 – Οκτώβριος 2023",
            details: ["Ένα εξάμηνο του προγράμματος M.Sc. Applied Computer Science, μέσω Erasmus+", "Διάκριση ως ομιλητής και επικεφαλής ομάδας"]
        },
        {
            id: "jamf-200",
            degree: "Jamf Certified Tech — Jamf Pro (Jamf 200)",
            institution: "Jamf",
            duration: "2026",
            kind: "certification",
            badge: "Jamf 200",
            details: [
                "Επιτυχία στις εξετάσεις πιστοποίησης Jamf 200 για το Jamf Pro",
                "Enrollment, inventory, policies, configuration profiles, Self Service και scoping για στόλους macOS και iOS"
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
            details: ["Πιστοποίηση στο πλαίσιο ITIL 4", "Έμφαση στις βέλτιστες πρακτικές διαχείρισης υπηρεσιών πληροφορικής (ITSM)"],
            link: "/files/itil-v4-cert.pdf"
        },
        {
            id: "tee-licence",
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
            id: "genai-essentials",
            degree: "Career Essentials in Generative AI",
            institution: "Microsoft & LinkedIn",
            duration: "2024",
            kind: "certification",
            details: ["Θεμέλια συστημάτων generative AI και υπεύθυνη υιοθέτηση", "Εφαρμογή σε εταιρικά rollouts AI και agentic automation"]
        }
    ],

    projects: [
        {
            id: "signature-craft",
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
            id: "portfolio-website",
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
            image: "/images/portfolio-website/2026.png",
            edges: ["#070517", "#050316"],
        },
        {
            id: "radio-over-fiber-thesis",
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
            image: "/images/thesis-presentation/thesis-image.png",
            edges: ["#0e2841", "#1d364d"],
        },
        {
            id: "raspberry-pi",
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
            id: "plano-plus",
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
            image: "/images/PlanoPlus/plano.png",
            edges: ["#010308", "#020409"],
        },
        {
            id: "schiller",
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
            image: "/images/schiller-project/schiller.png",
            edges: ["#fafafa", "#797e81"],
        },
        {
            id: "llms-research-review",
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
            image: "/images/research-llms-human-knowledge/llm-research.png",
            edges: ["#3a365d", "#dccdcd"],
        },
        {
            id: "nexus-party-app",
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
            id: "silence-hero",
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
            image: "/images/silence-hero/silence-hero.png",
            edges: ["#fbfafa", "#fbfafb"],
        },
        {
            id: "happyfox",
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
            id: "wheelchair-concept",
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
        common: { name: "Ανδρέας Φραγκιαδάκης", close: "Κλείσιμο", newTab: "ανοίγει σε νέα καρτέλα", skip: "Μετάβαση στο περιεχόμενο" },
        nav: {
            sections: { hero: "Επισκόπηση", about: "Σχετικά", services: "Υπηρεσίες", specs: "Εργαλεία", experience: "Καριέρα", projects: "Projects", contact: "Επικοινωνία" },
            main: "Κύρια πλοήγηση", menu: "Μενού", slides: "Διαφάνειες",
            cta: "Ας μιλήσουμε", openMenu: "Άνοιγμα μενού", closeMenu: "Κλείσιμο μενού", switchLanguage: "Switch to English",
            toLight: "Αλλαγή σε φωτεινό θέμα", toDark: "Αλλαγή σε σκοτεινό θέμα", appearance: "Εμφάνιση", language: "Γλώσσα", light: "Φωτεινό", dark: "Σκοτεινό"
        },
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
            stats: [
                { value: 550, suffix: "+", label: "Mac υπό διαχείριση στο Jamf Pro" },
                { value: 70, suffix: "%", label: "λιγότερος χρόνος onboarding, zero‑touch" },
                { value: 6, suffix: "+", unit: "έτη", label: "στο IT, τις υποδομές και την ασφάλεια" },
                { value: 95, suffix: "%+", label: "τήρηση SLA σε 350+ tickets" },
            ]
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
            highlights: "Βασικά σημεία"
        },
        contact: {
            eyebrow: "Επικοινωνία",
            headline: "Ας φτιάξουμε\nκάτι μαζί.",
            sub: "Ανοιχτός σε **θέσεις πλήρους απασχόλησης** και **freelance projects**.",
            send: "Αποστολή μηνύματος", subject: "Χαιρετισμούς από το andreas.technology",
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

    copyright: "© 2026 Ανδρέας Φραγκιαδάκης. Με την επιφύλαξη παντός δικαιώματος."
}

export default el
