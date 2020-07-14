import React from 'react';
import { Box, BoxProps } from '@blockstack/ui';
import { Text } from '@components/typography';
import { css } from '@styled-system/css';

export const H1: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Box {...rest}>
    <Text
      css={css({
        display: 'block',
        fontWeight: 'bolder',
        fontSize: ['44px', '44px', '66px'],
        lineHeight: ['48px', '48px', '68px'],
        padding: '0.05px 0',
        ':before': {
          content: "''",
          marginTop: ['-0.18295454545454543em', '-0.18295454545454543em', '-0.15227272727272725em'],
          display: 'block',
          height: 0,
        },
        ':after': {
          content: "''",
          marginBottom: [
            '-0.18295454545454545em',
            '-0.18295454545454545em',
            '-0.15227272727272728em',
          ],
          display: 'block',
          height: 0,
        },
      })}
      as="h1"
    >
      {children}
    </Text>
  </Box>
);

export const H2: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Box {...rest}>
    <Text
      css={css({
        display: 'block',
        fontWeight: 'bold',
        fontSize: '38.5px',
        lineHeight: '42px',
        padding: '0.05px 0',
        ':before': {
          content: "''",
          marginTop: '-0.1831168831168831em',
          display: 'block',
          height: 0,
        },
        ':after': {
          content: "''",
          marginBottom: '-0.18311688311688312em',
          display: 'block',
          height: 0,
        },
      })}
      as="h1"
    >
      {children}
    </Text>
  </Box>
);
export const BodyLarge: React.FC<BoxProps> = ({ children, ...rest }) => (
  <Text
    as="h2"
    css={css({
      display: 'block',
      fontSize: '22px',
      lineHeight: '32px',
      padding: '0.05px 0',
      ':before': {
        content: "''",
        marginTop: '-0.3659090909090909em',
        display: 'block',
        height: 0,
      },
      ':after': {
        content: "''",
        marginBottom: '-0.3659090909090909em',
        display: 'block',
        height: 0,
      },
      ...rest,
    })}
  >
    {children}
  </Text>
);

export const SubHeading = ({ as, children, ...rest }: any) => (
  <Text
    as={as}
    css={css({
      display: 'block',
      fontWeight: 600,
      fontSize: '22px',
      lineHeight: '28px',
      padding: '0.05px 0',
      ':before': {
        content: "''",
        marginTop: '-0.27499999999999997em',
        display: 'block',
        height: 0,
      },
      ':after': {
        content: "''",
        marginBottom: '-0.27499999999999997em',
        display: 'block',
        height: 0,
      },
      ...rest,
    })}
  >
    {children}
  </Text>
);
export const Body = ({ as, children, ...rest }: any) => (
  <Text
    as={as}
    css={css({
      display: 'block',
      fontSize: '16.5px',
      lineHeight: '24px',
      padding: '0.05px 0',
      ':before': {
        content: "''",
        marginTop: '-0.3666666666666667em',
        display: 'block',
        height: 0,
      },
      ':after': {
        content: "''",
        marginBottom: '-0.3666666666666667em',
        display: 'block',
        height: 0,
      },
      ...rest,
    })}
  >
    {children}
  </Text>
);
