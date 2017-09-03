let baseFontSize: number = 16

export const updateBaseFontSize = (newBaseFontSize: number) =>
    baseFontSize = newBaseFontSize

/**
 * Converts pixels to rems,
 * `calcRem(10) -> '0.625rem'`,
 * `calcRem(10, 20) -> '0.625rem 1.25rem'`
 */
export interface CalcRem {
    // tslint:disable unified-signatures
    /**
     * Converts pixels to rems,
     * `calcRem(10) -> '0.625rem'`,
     */
    (no1: number): string
    /**
     * Converts pixels to rems,
     * `calcRem(10, 20) -> '0.625rem 1.25rem'`
     */
    (no1: number, no2?: number): string
    /**
     * Converts pixels to rems,
     * `calcRem(10, 0, 20) -> '0.625rem 0 1.25rem'`
     */
    (no1: number, no2: number, no3?: number): string
    /**
     * Converts pixels to rems,
     * `calcRem(10, 0, 0, 20) -> '0.625rem 0 0 1.25rem'`
     */
    (no1: number, no2: number, no3: number, no4?: number): string
    // tslint:enable unified-signatures
}

const calcRem: CalcRem = (
    ...vals: number[],
) => vals
    .map((val) => val !== 0
        ? `${val / baseFontSize}rem`
        : '0',
    )
    .join(' ')

export default calcRem
