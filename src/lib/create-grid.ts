import glamorous, { CSSProperties } from 'glamorous'

import calcRem from '../helpers/calc-rem'
import styleDiff from '../helpers/style-diff'

import { createRow } from './create-row'
import { createColumn } from './create-column'

import { GlamorousComponent } from 'glamorous'
export { GlamorousComponent }

export type GridVisualOptions = {
    margin: Margin,
    gutter: Gutter,
    wrap: boolean,
    centre?: boolean,
}

export interface GridBreakpointOptions extends GridVisualOptions {
    minWidth: number
}

export type GridOptions = {
    maxWidth?: number
    initial: GridVisualOptions
    breakpoints?: GridBreakpointOptions[],
}

export type Margin =
    | [number] // vertical & horizontal
    | [number, number] // vertical, horizontal

export type Gutter =
    | [number] // vertical & horizontal
    | [number, number] // vertical, horizontal
    | [number, number, number, number] // top, right, bottom, left

// Take grid margin and subtract gutter / 2 
const calcPadding = (marginPart: number, gutter: number) => {
    if (marginPart - gutter * .5 <= 0) {
        return '0'
    }

    if (gutter === 0) {
        return calcRem(marginPart)
    }
    return `calc(${calcRem(marginPart)} - .5 * ${calcRem(gutter)})`
}

// If gutter calculate padding from gutter otherwise return the margin
const getPadding = (margin: Margin, gutter: Gutter) => {
    if (margin.length === 1) {
        if (gutter.length === 0) {
            return calcRem(margin[0])
        }

        return gutter.map((gutterValue) => calcPadding(margin[0], gutterValue)).join(' ')
    }

    switch (gutter.length) {
        case 1:
            // One gutter for all sides: return (margin - gutter)
            return margin.map((marginVal) => calcPadding(marginVal, gutter[0])).join(' ')
        case 2:
            // Horizontal/Vertical gutters: return (margin - Top/Bottom gutters) for each
            return gutter.map((gutterVal, idx) => calcPadding(margin[idx], gutterVal)).join(' ')
        case 4:
            // Top/Bottom/Left/Right gutters: return (margin - Top/Bottom/Left/Right gutters)
            const marginSet = [margin[0], margin[1], margin[0], margin[1]]

            return gutter.map((gutterVal, idx) => calcPadding(marginSet[idx], gutterVal)).join(' ')
        default:
            // No gutter is set: return the horizontal & vertical margins as rems
            return `${calcRem(margin[0])} ${calcRem(margin[1])}`
    }
}

const getGridStyles = (
    options: GridOptions,
): Partial<CSSProperties> => {
    const styles: Partial<CSSProperties> = {
        boxSizing: 'border-box',
        display: 'flex',
        flexWrap: 'wrap',
        maxWidth: options.maxWidth && calcRem(options.maxWidth),
        padding: getPadding(options.initial.margin, options.initial.gutter),
        margin: options.initial.centre
            ? '0 auto'
            : '0',
        width: '100%',
    }

    if (options.breakpoints) {
        let lastBreakpoint = 0
        let lastBreakpointStyles = {
            padding: styles.padding,
        }
        for (const breakpoint of options.breakpoints) {
            // breakpoints have to be defined in order so that we can only apply the
            // CSS properties that actually changed
            if (breakpoint.minWidth < lastBreakpoint) {
                console.error('Grid breakpoints have to be defined in ascending order!')
            }
            lastBreakpoint = breakpoint.minWidth

            const breakpointStyles = {
                padding: getPadding(breakpoint.margin, breakpoint.gutter),
            }

            styles[`@media(min-width: ${calcRem(breakpoint.minWidth)})`] = styleDiff(
                breakpointStyles,
                lastBreakpointStyles,
            )

            lastBreakpointStyles = breakpointStyles
        }
    }

    return styles
}

export interface GridProps {
    /**
     * backgroundColor of grid
     * default: 'transparent'
     */
     backgroundFill?: string
}

export const createGrid = (gridOptions: GridOptions) => {
    const gridStyles = getGridStyles(gridOptions)

    const Grid = glamorous.div<GridProps>(
        gridStyles,
    (props) => ({
        backgroundColor: props.backgroundFill || 'transparent',
    }))
    Grid.displayName = 'Grid'

    const Row = createRow(gridOptions)
    const Column = createColumn(gridOptions)

    return {
        Grid,
        Row,
        Column,
    }
}
