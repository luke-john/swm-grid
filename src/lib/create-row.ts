import glamorous, { CSSProperties } from 'glamorous'

import calcRem from '../helpers/calc-rem'
import styleDiff from '../helpers/style-diff'

import { GridOptions } from './create-grid'

import { GlamorousComponent } from 'glamorous'
export { GlamorousComponent }

export type RowVisualProps = {
    alignment?: 'left' | 'right',
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch',
}

export type RowProps = {
    initial?: RowVisualProps
    breakpoints?: RowVisualProps[],
}

const getRowDynamicStylesMethod = (gridOptions: GridOptions) => (
    rowProps: RowProps,
) => {
    const rowAlignment = rowProps.initial && rowProps.initial.alignment || 'left'
    const css: Partial<CSSProperties> = {
        textAlign: 'left',
        flexDirection: rowAlignment === 'left'
            ? 'row'
            : 'row-reverse',
        flexWrap: gridOptions.initial.wrap ? 'wrap' : 'nowrap',
        alignItems: rowProps.initial && rowProps.initial.alignItems || 'flex-start',
    }

    let lastBreakpointStyles = css

    if (gridOptions.breakpoints && rowProps.breakpoints) {
        for (let index = 0; index < gridOptions.breakpoints.length; index++) {
            const gridBreakpoint = gridOptions.breakpoints[index]
            const breakpointRowAlignment = rowProps.breakpoints[index].alignment || 'left'

            if (gridBreakpoint) {
                const breakpointStyles: CSSProperties = {
                    alignItems: rowProps.breakpoints[index].alignItems || 'flex-start',
                    flexDirection: breakpointRowAlignment === 'left'
                        ? 'row'
                        : 'row-reverse',
                    flexWrap: gridBreakpoint.wrap ? 'wrap' : 'nowrap',
                }
                css[`@media(min-width: ${calcRem(gridBreakpoint.minWidth)})`] = styleDiff(
                    breakpointStyles,
                    lastBreakpointStyles,
                )

                lastBreakpointStyles = breakpointStyles
            }
        }
    }

    return css
}


export const createRow = (gridOptions: GridOptions) => {

    // add run time warnings if missing options for grid breakpoints
    const rowDynamicStylesMethod = getRowDynamicStylesMethod(gridOptions)
    const Row = glamorous.div<RowProps>(
        {
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'flex-start',
            // Flex grow of 1 allows flex item to grow when offseting margins to break outside grid
            flex: '1 1 auto',
            width: '100%',
        },
        rowDynamicStylesMethod,
    )
    Row.displayName = 'Row'

    return  Row
}
