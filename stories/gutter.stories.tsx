import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { Flex, Box, Text } from '@blockstack/ui'
import Gutter from '../src/ts/components/gutter'
import { number } from '@storybook/addon-knobs/react'

// export default { title: 'Button' }

const stories = storiesOf('Components', module)

// export const Solid = () => (
//   <Button>Hello there!</Button>
// )

// export const Link = () => {
//   <Button variant="link">Nice day?</Button>
// }

// stories.add("Button", withInfo({ inline: true })(() => (
//   <Button>With info!</Button>
// )))

Flex.displayName = "Flex"
Box.displayName = "Box"

stories.add("Gutter", withInfo({ inline: true, skipPropsWithoutDoc: true })(() => (
  <Flex wrap="wrap">
    <Box width="100%">
      <Text>One thing here</Text>
    </Box>
      <Gutter multiplier={number('multiplier', 5)} />
    <Box width="100%">
      <Text>Something down here</Text>
    </Box>
  </Flex>
)))