/**
 * Button/link label that rolls up on hover or keyboard focus while an identical copy
 * rolls in from below. Pure CSS (see `.roll-text` in globals.css); the duplicate is
 * hidden from assistive tech so the accessible name is read once.
 */
export default function RollText({ children }: { children: string }) {
    return (
        <span className="roll-text">
            <span className="roll-text__track">
                <span>{children}</span>
                <span aria-hidden="true">{children}</span>
            </span>
        </span>
    )
}
