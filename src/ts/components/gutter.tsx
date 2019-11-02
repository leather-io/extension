import React, { FC } from 'react'
import { Box } from '@blockstack/ui'
import { BoxProps } from '@blockstack/ui/dist/box'

interface GutterProps extends BoxProps {
  /** How many 'vertical spacing components' you want to create */
  multiplier: number
  /** The vertical padding you'd like to use in each individual component.  */
  base?: number
}

/**
 * A component that can be used to create large vertical spacing.
 * It's like using the `p` spacing prop, but creating a list of them.
 * This is used because our spacing system only goes up to 6,
 * and sometimes you want large bits of spacing, so you can do 6 * 3
 */
// export default function Gutter({ base = 6, multiplier, ...rest }: GutterProps)) {
export default function Gutter({ base = 6, multiplier, ...rest }: GutterProps) {
  const boxes = []
  for (let index = 0; index < multiplier; index++) {
    boxes.push(<Box py={base} {...rest} />)
  }
  return <>{boxes}</>
}

// export default Gutter
