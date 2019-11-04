import React from 'react'
import { storiesOf } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import { Button } from '@blockstack/ui'

// export default { title: 'Button' }

const stories = storiesOf('Buttons', module)

export const Solid = () => <Button>Hello there!</Button>

export const Link = () => {
  ;<Button variant="link">Nice day?</Button>
}

stories.add('Button', withInfo({ inline: true })(() => <Button>With info!</Button>))
