/**
 * Tools shown in the Tech specs table, the service toolkits and the current role's stack.
 * Only tools in active, day-to-day use belong here.
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
    /** Row of the Tech specs table. */
    group: ToolGroup
}

/** Tech-spec rows, in display order. Labels live in the content files (keynote.specs.groups). */
export const TOOL_GROUPS = ['apple', 'security', 'infra', 'code', 'ai', 'collab'] as const
export type ToolGroup = (typeof TOOL_GROUPS)[number]

export const TOOLS = [
    // Apple fleet & endpoint
    { label: 'Jamf Pro', logo: 'jamf', ratio: 2.875, group: 'apple' },
    { label: 'Apple Business Manager', logo: 'apple', group: 'apple' },
    { label: 'macOS', logo: 'macos', ratio: 4.26, group: 'apple' },
    { label: 'Check Point Harmony Endpoint', logo: 'checkpoint', ratio: 1.05, group: 'security' },
    { label: 'Microsoft Sentinel', logo: 'microsoft-sentinel', group: 'security' },
    // Identity & access
    { label: 'Microsoft Entra ID', logo: 'entra-id', group: 'security' },
    { label: 'Duo MFA', logo: 'duo', ratio: 2.06, group: 'security' },
    { label: '1Password', logo: '1password', group: 'security' },
    { label: 'Active Directory', logo: 'active-directory', group: 'security' },
    // Infrastructure
    { label: 'Cisco ISE', logo: 'cisco', ratio: 1.9, group: 'infra' },
    { label: 'Proxmox', logo: 'proxmox', group: 'infra' },
    { label: 'VMware ESXi', logo: 'vmware', ratio: 6.32, group: 'infra' },
    { label: 'Linux', logo: 'linux', group: 'infra' },
    { label: "acme.sh / Let's Encrypt", logo: 'letsencrypt', group: 'infra' },

    // Code
    { label: 'Python', logo: 'python', group: 'code' },
    { label: 'Bash / zsh', logo: 'gnubash', group: 'code' },
    { label: 'Swift', logo: 'swift', group: 'code' },
    { label: 'AppleScript', logo: 'apple', group: 'code' },
    { label: 'TypeScript', logo: 'typescript', group: 'code' },
    { label: 'React / Next.js', logo: 'react', group: 'code' },
    { label: 'Git / GitHub', logo: 'github', group: 'code' },
    // AI
    { label: 'Claude Code', logo: 'claude', group: 'ai' },
    { label: 'MCP Servers', logo: 'modelcontextprotocol', group: 'ai' },
    { label: 'Google Gemini', logo: 'googlegemini', group: 'ai' },
    { label: 'Grok Bot', logo: 'grok', group: 'ai' },
    { label: 'Atlassian Rovo', logo: 'atlassian', group: 'ai' },
    // Collaboration & ITSM
    { label: 'Jira Service Management', logo: 'jira', group: 'collab' },
    { label: 'Confluence', logo: 'confluence', group: 'collab' },
    { label: 'Google Workspace', logo: 'google', group: 'collab' },
    { label: 'Slack', logo: 'slack', group: 'collab' },
] as const satisfies readonly Tool[]

/** Every tool name, so other content can reference tools with compile-time checking. */
export type ToolLabel = (typeof TOOLS)[number]['label']

/**
 * Whether a tool's logo is a symbol (shown next to its name) rather than a wordmark that
 * spells the name out ("jamf", "macOS", "DUO"); wordmarks would repeat the label beside them.
 */
export const hasSymbol = (tool: Tool) => (tool.ratio ?? 1) <= 1.3

export const TOOL_BY_LABEL: ReadonlyMap<ToolLabel, Tool> = new Map(TOOLS.map((tool) => [tool.label, tool]))
