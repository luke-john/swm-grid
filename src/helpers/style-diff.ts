import { CSSProperties, CSSPropertiesComplete } from 'glamorous'

/**
 * This typeguard is because of React.ReactChild being in the CSSProperties index signature
 */

const eliminateReactChild = (_val: any): _val is CSSPropertiesComplete => true

/**
 * Get a diff between two style objects
 * Example use: Only apply what actually changed for a breakpoint
 */
const styleDiff = (styles: CSSProperties, baseStyles?: CSSProperties): CSSProperties => {
    if (!baseStyles) {
        return styles
    }

    const result: CSSProperties = {}

    Object.keys(styles)
        .forEach((key) => {
            const val = styles[key]
            const baseVal = baseStyles[key]

            if (Array.isArray(val) || Array.isArray(baseVal)) {
                result[key] = val
            } else if (typeof val === 'object' && typeof baseVal === 'object') {
                if (eliminateReactChild(val) && eliminateReactChild(baseVal)) {
                    result[key] = styleDiff(val, baseVal)
                }
            } else if (val !== baseVal) {
                result[key] = val
            }
        })

    return result
}

export default styleDiff