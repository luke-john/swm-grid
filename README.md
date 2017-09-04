** This is unpublished **

# swm-grid

## The problem

You need to setup configurable grids in your application and you want them to be cross browser accesible, flexible and simple.

## Installation

**This component is currently under development and is not yet released...**

```sh
yarn add swm-grid
```

## Usage

Things are still in flux a little bit (looking for feedback).

### createCrid component factory

The `createGrid` function is the main (only) export. It allows you to create the grid components which are `glamorous` components with a number of styles and style arguments setup.

```js
import { createGrid } from 'swm-grid'

const { Grid, Row, Col } = createGrid({/* createGrid options */})
```

`createGrid` allows you to invoke it with options that it uses to return `Grid`, `Row` and `Col` components based off those options.

#### createGrid options

```ts
export type Margin =
    | [number] // vertical & horizontal
    | [number, number] // vertical, horizontal

export type Gutter =
    | [number] // vertical & horizontal
    | [number, number] // vertical, horizontal
    | [number, number, number, number] // top, right, bottom, left

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
```

```js
const { Grid, Row, Col } = createGrid({
    maxWidth: 1200,
    initial: {
        gutter: [5, 10],
        margin: [20],
        wrap: true,
    },
    breakpoints: [
        {
            gutter: [10],
            margin: [50, 30],
            minWidth: 750,
            wrap: false,
        },
        {
            gutter: [10, 30, 15, 18],
            margin: [40, 50],
            minWidth: 970,
            wrap: false,
        },
    ],
})
```

### swm-grid components

These are the glamorous components returned by the createGrid factory.

#### Grid

##### Props

```ts
export interface GridProps {
    /**
     * backgroundColor of grid
     * default: 'transparent'
     */
     backgroundFill?: string
}
```

##### Usage

```jsx
<Grid>
    {/* Row components */}
</Grid>
```

#### Row

##### Props

```ts
export type RowVisualProps = {
    alignment?: 'left' | 'right',
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch',
}

export type RowProps = {
    initial?: RowVisualProps
    breakpoints?: RowVisualProps[],
}
```

##### Usage

```
<Row>
    {/* Col components */}
</Row>
```

#### Col

##### Props

```ts
export type ColVisualProps = {
    /**
     * `[antecedent, consequent]`
     * ie. [1, 2] = 1/2 = 50%
     */
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
```

##### Usage

```js
<Column
    initial={{
        ratio: [1, 1],
        gutterBleed: -20,
        flexGrow: 1,
    }}
    breakpoints={[
        {
            ratio: [1, 1],
            gutterBleed: -20,
            flexGrow: 1,
        },
        {
            ratio: [1, 1],
            gutterBleed: -20,
            flexGrow: 1,
        },
    ]}
>
    {/* Column contents */}
</Column>
```

## License

MIT
