import { CSSProperties } from 'glamorous'

const conditionalStyles = (
    condition: boolean | undefined,
    styles: CSSProperties
): CSSProperties => condition
    ? styles
    : {}

export default conditionalStyles