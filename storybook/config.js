import { configure} from '@storybook/react';
import { setOptions } from '@storybook/addon-options'
import { setDefaults } from '@storybook/addon-info';


setOptions({
    name: 'swm-grid',
    url: '#',
    showDownPanel: false,
})

setDefaults({
    header: true,
    inline: true
})

const loadStories = () => {
    require('../documentation/README.story')
    require('../documentation/grid.story')
    require('../documentation/complex-grid.story')
}

configure(loadStories, module)