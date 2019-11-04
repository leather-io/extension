import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Gutter from '@components/gutter'
import { number } from '@storybook/addon-knobs'

const stories = storiesOf('Components', module)

stories.add('Gutter', withInfo({ inline: true })(() => <Gutter multiplier={number('multiplier', 1)} />))
