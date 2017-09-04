import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

import { createGrid } from '../src'

import { GridProps } from '../src'
export { GridProps }
import { GlamorousComponent } from 'glamorous'
export { GlamorousComponent }

const stories = storiesOf('Grid', module)

export const { Grid, Row, Column } = createGrid({
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

const GridDocs = `
\`\`\`ts
createGrid({
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
\`\`\`
`

stories.add(
    "Creating a Grid",
    withInfo({
        header: true,
        inline: true,
        text: GridDocs,
        source: false,
        propTables: false,
    })(
        () => <div />
    )
)