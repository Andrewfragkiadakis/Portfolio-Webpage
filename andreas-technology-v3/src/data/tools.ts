/**
 * Tools shown in the tech-specs table and the service toolkits. Only tools in active, day-to-day use belong here.
 *
 * `row` splits the marquee into two opposing tracks:
 *   'ops'   — Apple fleet, security, identity and infrastructure
 *   'build' — code, AI and collaboration
 */
export interface Tool {
    label: string
    /**
     * File name (no extension) in public/logos. Official marks only: Simple Icons
     * (added via `node scripts/add-logo.mjs <slug>`) or the vendor's own brand kit.
     */
    logo: string
    /** Width ÷ height of the logo's viewBox, used as its CSS aspect-ratio; defaults to 1 (square). */
    ratio?: number
    /** Brand colour shown on hover. Near-black brands fall back to the theme foreground. */
    brand: string
    row: 'ops' | 'build'
    /** Row of the "Tech specs" table on the services slide. */
    group: ToolGroup
}

/** Tech-spec rows, in display order. Labels live in content.ts (keynote.services.groups). */
export const TOOL_GROUPS = ['apple', 'security', 'infra', 'code', 'ai', 'collab'] as const
export type ToolGroup = (typeof TOOL_GROUPS)[number]

export const TOOLS = [
    // Apple fleet & endpoint
    { label: 'Jamf Pro', logo: 'jamf', ratio: 2.875, brand: '#000000', row: 'ops', group: 'apple' },
    { label: 'Apple Business Manager', logo: 'apple', brand: '#000000', row: 'ops', group: 'apple' },
    { label: 'macOS', logo: 'macos', ratio: 4.26, brand: '#000000', row: 'ops', group: 'apple' },
    { label: 'Checkpoint Harmony EDR', logo: 'checkpoint', ratio: 1.05, brand: '#EE0C5D', row: 'ops', group: 'security' },
    { label: 'Microsoft Sentinel', logo: 'microsoft-sentinel', brand: '#0078D4', row: 'ops', group: 'security' },
    // Identity & access
    { label: 'Microsoft Entra ID', logo: 'entra-id', brand: '#0078D4', row: 'ops', group: 'security' },
    { label: 'DUO MFA', logo: 'duo', ratio: 2.06, brand: '#6DC04B', row: 'ops', group: 'security' },
    { label: '1Password', logo: '1password', brand: '#145FE4', row: 'ops', group: 'security' },
    { label: 'Active Directory', logo: 'active-directory', brand: '#0078D4', row: 'ops', group: 'security' },
    // Infrastructure
    { label: 'Cisco ISE', logo: 'cisco', ratio: 1.9, brand: '#1BA0D7', row: 'ops', group: 'infra' },
    { label: 'Proxmox', logo: 'proxmox', brand: '#E57000', row: 'ops', group: 'infra' },
    { label: 'VMware ESXi', logo: 'vmware', ratio: 6.32, brand: '#607078', row: 'ops', group: 'infra' },
    { label: 'Linux', logo: 'linux', brand: '#FCC624', row: 'ops', group: 'infra' },
    { label: "acme.sh / Let's Encrypt", logo: 'letsencrypt', brand: '#003A70', row: 'ops', group: 'infra' },

    // Code
    { label: 'Python', logo: 'python', brand: '#3776AB', row: 'build', group: 'code' },
    { label: 'Bash / zsh', logo: 'gnubash', brand: '#4EAA25', row: 'build', group: 'code' },
    { label: 'Swift', logo: 'swift', brand: '#F05138', row: 'build', group: 'code' },
    { label: 'AppleScript', logo: 'apple', brand: '#000000', row: 'build', group: 'code' },
    { label: 'TypeScript', logo: 'typescript', brand: '#3178C6', row: 'build', group: 'code' },
    { label: 'React / Next.js', logo: 'react', brand: '#61DAFB', row: 'build', group: 'code' },
    { label: 'Git / GitHub', logo: 'github', brand: '#181717', row: 'build', group: 'code' },
    // AI
    { label: 'Claude Code', logo: 'claude', brand: '#D97757', row: 'build', group: 'ai' },
    { label: 'MCP Servers', logo: 'modelcontextprotocol', brand: '#000000', row: 'build', group: 'ai' },
    { label: 'Google Gemini', logo: 'googlegemini', brand: '#8E75B2', row: 'build', group: 'ai' },
    { label: 'Atlassian Rovo', logo: 'atlassian', brand: '#0052CC', row: 'build', group: 'ai' },
    // Collaboration & ITSM
    { label: 'Jira Service Management', logo: 'jira', brand: '#0052CC', row: 'build', group: 'collab' },
    { label: 'Confluence', logo: 'confluence', brand: '#172B4D', row: 'build', group: 'collab' },
    { label: 'Google Workspace', logo: 'google', brand: '#4285F4', row: 'build', group: 'collab' },
    { label: 'Slack', logo: 'slack', brand: '#E01E5A', row: 'build', group: 'collab' },
] as const satisfies readonly Tool[]

/** Every tool name, so other content can reference tools with compile-time checking. */
export type ToolLabel = (typeof TOOLS)[number]['label']

export const TOOL_BY_LABEL: ReadonlyMap<ToolLabel, Tool> = new Map(TOOLS.map((tool) => [tool.label, tool]))
