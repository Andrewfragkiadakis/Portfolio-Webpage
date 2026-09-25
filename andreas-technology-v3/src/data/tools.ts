/**
 * Tools shown in the About marquee. Only tools in active, day-to-day use belong here.
 *
 * `row` splits the marquee into two opposing tracks:
 *   'ops'   — Apple fleet, security, identity and infrastructure
 *   'build' — code, AI and collaboration
 */
export interface Tool {
    label: string
    /** Font Awesome 6 free class. */
    icon: string
    row: 'ops' | 'build'
}

export const TOOLS: Tool[] = [
    // Apple fleet & endpoint
    { label: 'Jamf Pro', icon: 'fab fa-apple', row: 'ops' },
    { label: 'Apple Business Manager', icon: 'fab fa-apple', row: 'ops' },
    { label: 'macOS', icon: 'fas fa-laptop', row: 'ops' },
    { label: 'Checkpoint Harmony EDR', icon: 'fas fa-shield-halved', row: 'ops' },
    { label: 'Microsoft Sentinel', icon: 'fas fa-satellite-dish', row: 'ops' },
    // Identity & access
    { label: 'Microsoft Entra ID', icon: 'fab fa-microsoft', row: 'ops' },
    { label: 'DUO MFA', icon: 'fas fa-key', row: 'ops' },
    { label: '1Password', icon: 'fas fa-lock', row: 'ops' },
    { label: 'Active Directory', icon: 'fas fa-users-gear', row: 'ops' },
    // Infrastructure
    { label: 'Cisco ISE', icon: 'fas fa-network-wired', row: 'ops' },
    { label: 'Proxmox', icon: 'fas fa-server', row: 'ops' },
    { label: 'VMware ESXi', icon: 'fas fa-server', row: 'ops' },
    { label: 'Linux', icon: 'fab fa-linux', row: 'ops' },
    { label: "acme.sh / Let's Encrypt", icon: 'fas fa-certificate', row: 'ops' },

    // Code
    { label: 'Python', icon: 'fab fa-python', row: 'build' },
    { label: 'Bash / zsh', icon: 'fas fa-terminal', row: 'build' },
    { label: 'Swift', icon: 'fab fa-swift', row: 'build' },
    { label: 'AppleScript', icon: 'fas fa-scroll', row: 'build' },
    { label: 'TypeScript', icon: 'fab fa-js', row: 'build' },
    { label: 'React / Next.js', icon: 'fab fa-react', row: 'build' },
    { label: 'Git / GitHub', icon: 'fab fa-github', row: 'build' },
    // AI
    { label: 'Claude Code', icon: 'fas fa-robot', row: 'build' },
    { label: 'MCP Servers', icon: 'fas fa-plug', row: 'build' },
    { label: 'Google Gemini', icon: 'fas fa-wand-magic-sparkles', row: 'build' },
    { label: 'Atlassian Rovo', icon: 'fab fa-atlassian', row: 'build' },
    // Collaboration & ITSM
    { label: 'Jira Service Management', icon: 'fab fa-jira', row: 'build' },
    { label: 'Confluence', icon: 'fab fa-confluence', row: 'build' },
    { label: 'Google Workspace', icon: 'fab fa-google', row: 'build' },
    { label: 'Slack', icon: 'fab fa-slack', row: 'build' },
]
