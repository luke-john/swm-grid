declare module '@storybook/addon-info' {
    import { RenderFunction } from 'storybook__react'

    export function withInfo(
        /**
         * documentation text
         */
        documentation: string
    ): (story: RenderFunction) => RenderFunction

    export interface WithInfoOptions {
        /**
         * Toggles display of header with component name and description
         * default: false
         */
        header?: boolean,
        /**
         * Displays info inline vs click button to view
         * default: true
         */
        inline?: boolean,
        /**
         * String or React Element with docs about my component
         */
        text?: string | JSX.Element
        /**
         * Displays the source of story Component
         * default: true
         */
        source?: boolean, 
        /**
         * Displays Prop Tables with these components
         * default: []
         */
        propTables?: false | string[],
        
        /**
         * Exclude Components from being shown in Prop Tables section
         * default: []
         */
        propTablesExclude?: string[],
        /**
         * Overrides styles of addon
         */
        styles?: any,
        /**
         * Overrides components used to display markdown. Warning! This option's name will be likely deprecated in favor to "components" with the same API in 3.3 release. Follow this PR #1501 for details
         */
        marksyConf?: any,
        /**
         * Max props to display per line in source code
         */
        maxPropsIntoLine?: number,
        maxPropObjectKeys?: number,
        maxPropArrayLength?: number,
        maxPropStringLength?: number,
    }

    export function withInfo(
        /**
         * documentation options
         */
        options: WithInfoOptions
    ): (story: RenderFunction) => RenderFunction
}