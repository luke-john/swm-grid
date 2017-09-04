import * as React from 'react'
import { storiesOf } from '@storybook/react'
import * as ReactMarkdown from 'react-markdown'

const readmeMd = require('../README.md') as string

const stories = storiesOf('Intro', module)

const linkToGithub = `
The following documentation is available on the \`swm-grid\` github project at the following link:

https://github.com/luke-john/swm-grid

`

stories.add("README", () => (
    <ReactMarkdown
        source={linkToGithub + readmeMd}
    />
))