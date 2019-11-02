import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Gutter from '../src/ts/components/gutter'
import { number } from '@storybook/addon-knobs/react'

const stories = storiesOf('Components', module)

stories.addDecorator(withInfo).add("Gutter", withInfo({ inline: true, skipPropsWithoutDoc: true })(() => (
  <Gutter multiplier={number('multiplier', 1)} />
)))