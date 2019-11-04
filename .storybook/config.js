import { configure, addDecorator, setAddon } from '@storybook/react'
import { withPropsTable } from 'storybook-addon-react-docgen'
import ThemeDecorator from './theme-decorator'
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, select } from '@storybook/addon-knobs/react';

addDecorator(withKnobs);
setAddon(JSXAddon);

addDecorator(ThemeDecorator);
addDecorator(withPropsTable)

// automatically import all files ending in *.stories.tsx
configure(require.context('../src/ts/stories', true, /\.stories\.(js|tsx?)$/), module);