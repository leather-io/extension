import React from 'react'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import Test from '@components/test'

export default {
  title: 'Welcome'
}

export const toStorybook = () => <Welcome showApp={linkTo('Button')} />

export const tester = () => <Test name="Hello" />

toStorybook.story = {
  name: 'to Storybook'
}
