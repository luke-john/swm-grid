import glamorous, { CSSProperties } from 'glamorous'

import calcRem from '../helpers/calc-rem'
import styleDiff from '../helpers/style-diff'
import conditionalStyles from '../helpers/conditional-styles'

import { GridOptions, Gutter } from './create-grid'

import { GlamorousComponent } from 'glamorous'
export { GlamorousComponent }

// You can either have isFluid OR fixedWidth set on a column, you cannot have both
export type ColumnVisualProps = {
    ratio: [number, number],
    gutterBleed?: number,
    gutterOverride?: Gutter,
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse',
    flexGrow?: number,
    fixedWidth?: number
    isFluid?: boolean,
    isHidden?: boolean,
    wrapContents?: boolean,
    isFlushToTop?: boolean,
    order?: number,
}

export type ColumnProps = {
    initial: ColumnVisualProps
    breakpoints?: ColumnVisualProps[],
}

const getRatioPart = (ratio: [number, number]): string => {
    const actualRatio = ratio[0] / ratio[1]

    if (actualRatio === 1) {
        return '100%'
    }
    if (actualRatio === 3 / 4) {
        return '75%'
    }
    if (actualRatio === 1 / 2) {
        return '50%'
    }
    if (actualRatio === 1 / 4) {
        return '25%'
    }

    return `100% * ${ratio[0]} / ${ratio[1]}`
}

const hasHorizontalGutter = (gutter: Gutter) => {
    switch (gutter.length) {
        case 1:
            return gutter[0] !== 0
        case 2:
            return gutter[1] !== 0
        case 4:
            return gutter[1] !== 0 || gutter[3] !== 0
        default:
            return false
    }
}

const getColumnWidth = ({
    gutter,
    ratio,
    gutterBleed = 0,
    isFluid,
    fixedWidth,
}: {
    gutter: Gutter,
    ratio: [number, number],
    gutterBleed?: number,
    isFluid?: boolean,
    fixedWidth?: number,
    isVerticallyFlush?: boolean,
}) => {

    if (isFluid) {
        return `auto`
    }

    if (fixedWidth) {
        return fixedWidth
    }

    // Ratio of the row the card should take up
    const ratioPart = getRatioPart(ratio)

    const simpleRatio = ratioPart.length <= 4 // possible to avoid calc
    const noGutters = !hasHorizontalGutter(gutter) && gutterBleed === 0

    if (simpleRatio && noGutters) {
        return ratioPart
    }

    if (noGutters) {
        // minus 1px due to a rounding bug in IE
        return `calc(${ratioPart} - 1px)`
    }

    let gutterPart: string

    // if there is a gutter we subtract it's width from the col as it will be added as margins
    switch (gutter.length) {
        case 1:
            gutterPart = calcRem(gutter[0])
            break
        case 2:
            gutterPart = calcRem(gutter[1])
            break
        case 4:
            // if the left/right gutters are defined separately, we take the average
            gutterPart = `0.5 * (${calcRem(gutter[1])} + ${calcRem(gutter[3])})`
            break
        default:
            gutterPart = '0px'
    }

    if (gutterBleed) {
        // gutterBleed is subtracted and multiplied by two, once for each side.
        const gutterBleedPart = `${calcRem(gutterBleed)} * 2`

        // minus 1px due to a rounding bug in IE
        return `calc(${ratioPart} - ${gutterPart} - ${gutterBleedPart} - 1px)`
    } else {
        // minus 1px due to a rounding bug in IE
        return `calc(${ratioPart} - ${gutterPart} - 1px)`
    }
}

/**
 * if gutter bleed is set add half the horizontal gutter to the negative gutter bleed
 * gutterBleed should only be set for horizontal gutter values
 */
const getColumnGutterValue = (val: number, gutterBleed = 0) => {
    if (val === 0 && gutterBleed === 0) {
        return '0'
    }

    const gutterValue = calcRem(val)

    if (gutterBleed) {
        const gutterBleedValue = calcRem(gutterBleed)
        return `calc(.5 * ${gutterValue} + ${gutterBleedValue})`
    } else {
        return `calc(.5 * ${gutterValue})`
    }
}

const getColumnGutter = ({
    gutter,
    gutterBleed,
}: {
    gutter: Gutter,
    gutterBleed?: number,
}) => {
    if (gutter.length === 1 || gutter.length === 2) {
        const verticalGutter = getColumnGutterValue(gutter[0])

        const horizontalGutterValue = gutter.length === 1
            ? gutter[0]
            : gutter[1]
        const horizontalGutter = getColumnGutterValue(horizontalGutterValue, gutterBleed)

        return `${verticalGutter} ${horizontalGutter}`
    }

    if (gutter.length === 4) {
        const topGutter = getColumnGutterValue(gutter[0])
        const rightGutter = getColumnGutterValue(gutter[1], gutterBleed)
        const bottomGutter = getColumnGutterValue(gutter[2])
        const leftGutter = getColumnGutterValue(gutter[3], gutterBleed)
        return `${topGutter} ${rightGutter} ${bottomGutter} ${leftGutter}`
    }
    return 0
}

const getColStyles = (
    initialGutter: Gutter,
    visualProps: ColumnVisualProps,
): CSSProperties => {
    const gutter = visualProps.gutterOverride || initialGutter

    const width = getColumnWidth({
        gutter,
        ratio: visualProps.ratio,
        gutterBleed: visualProps.gutterBleed,
        isFluid: visualProps.isFluid,
        fixedWidth: visualProps.fixedWidth,
    })

    // Override column margins with custom top, right, bottom, left values
    const gutterMargins = getColumnGutter({
        gutter,
        gutterBleed: visualProps.gutterBleed,
    })

    // Specify new flex-grow value for specific columns
    const growCol = visualProps.flexGrow ? visualProps.flexGrow : 0

    // if hide is true don't display column
    const columnVisibility = visualProps.isHidden ? 'none' : 'flex'

    const colStyles: CSSProperties = {
        boxSizing: 'border-box',
        // in ie10 calcs do not work for flex property values so we need to set the width
        width,
        display: columnVisibility,
        flexBasis: width,
        flex: `${growCol} ${visualProps.wrapContents ? 1 : 0} auto`,
        flexWrap: visualProps.wrapContents ? 'wrap' : 'nowrap',
        margin: gutterMargins,
        flexDirection: visualProps.flexDirection,
        order: visualProps.order,
        ...conditionalStyles(
            visualProps.isFlushToTop && visualProps.isFlushToTop,
            {
                '&:first-child': {
                    marginTop: 0,
                },
            },
        ),
    }

    return colStyles
}

const getColumnDynamicStylesMethod = (
    gridOptions: GridOptions,
) => (colProps: ColumnProps) => {

    const css: Partial<CSSProperties> = getColStyles(
        gridOptions.initial.gutter,
        colProps.initial,
    )

    let lastBreakpointStyles = css

    if (gridOptions.breakpoints && colProps.breakpoints) {
        for (let index = 0; index < gridOptions.breakpoints.length; index++) {
            const breakpointStyles = getColStyles(
                gridOptions.breakpoints[index].gutter,
                colProps.breakpoints[index],
            )
            // we only apply what actually changed in this breakpoint
            css[`@media(min-width: ${gridOptions.breakpoints[index].minWidth}px)`] = styleDiff(
                breakpointStyles,
                lastBreakpointStyles,
            )
            lastBreakpointStyles = breakpointStyles
        }
    }

    return css
}

export type ColumnOptions = {}

export const createColumn = (gridOptions: GridOptions) => {
    // add run time warnings if missing options for grid breakpoints
    const colDynamicStylesMethod = getColumnDynamicStylesMethod(gridOptions)
    const Column = glamorous.div<ColumnProps>(
        colDynamicStylesMethod,
    )
    Column.displayName = 'Column'

    return Column
}
