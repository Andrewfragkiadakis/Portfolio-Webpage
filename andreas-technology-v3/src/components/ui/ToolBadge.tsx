import type { CSSProperties } from 'react'
import type { Tool } from '@/data/tools'

function luminance(hex: string): number {
    const n = parseInt(hex.slice(1), 16)
    const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
        const v = c / 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * Brand colour for a logo on a light square (`light`) and on a near-black one (`dark`).
 * Near-black brands become the theme's text colour, pale brands (React cyan, Linux
 * yellow) are deepened on white, and deep navy brands are lifted on black.
 */
export function brandInks(tool: Tool): { light: string; dark: string } {
    const l = luminance(tool.brand)
    return {
        light: l < 0.06 ? '#1d1d1f' : l > 0.4 ? `color-mix(in srgb, ${tool.brand} 68%, #000)` : tool.brand,
        dark: l < 0.06 ? '#f5f5f7' : l < 0.14 ? `color-mix(in srgb, ${tool.brand} 55%, #fff)` : tool.brand,
    }
}

/** Official tool logo drawn as a mask in the current text colour. */
export function ToolLogo({ tool, className = '' }: { tool: Tool; className?: string }) {
    const url = `url(/logos/${tool.logo}.svg)`
    return (
        <span
            className={`tool-logo ${className}`}
            aria-hidden="true"
            style={{ aspectRatio: tool.ratio ?? 1, maskImage: url, WebkitMaskImage: url }}
        />
    )
}

/**
 * Logo in a uniform square tile, so every tool reads at the same size whether its logo
 * is a square mark or a wide wordmark. `colour` overrides the mark colour (brand inks).
 */
export function ToolTile({ tool, className = '', colour, style }: { tool: Tool; className?: string; colour?: string; style?: CSSProperties }) {
    const url = `url(/logos/${tool.logo}.svg)`
    return (
        <span
            className={`tool-tile ${className}`}
            title={tool.label}
            style={{ ...(colour ? { '--mark-colour': colour } : {}), ...style } as CSSProperties}
        >
            <span
                className="tool-tile__logo"
                aria-hidden="true"
                style={{ '--ratio': tool.ratio ?? 1, maskImage: url, WebkitMaskImage: url } as CSSProperties}
            />
        </span>
    )
}

/**
 * A service's toolkit as a small cluster of overlapping white discs, each carrying the
 * tool's official mark in its brand colour. Decorative: the dialog lists the names.
 */
export function LogoCluster({ tools, className = '' }: { tools: Tool[]; className?: string }) {
    return (
        <span className={`logo-cluster ${className}`} aria-hidden="true">
            {tools.map((tool, i) => (
                <ToolTile key={tool.label} tool={tool} colour={brandInks(tool).light} style={{ zIndex: tools.length - i }} />
            ))}
        </span>
    )
}
