import { ClarityType } from '@stacks/transactions';
import { Box, BoxProps, Flex, FlexProps } from 'leather-styles/jsx';

interface TupleDisplayerProps extends BoxProps {
  isRoot: boolean;
}
export function TupleDisplayer({ isRoot, ...rest }: TupleDisplayerProps) {
  const rootStyles = isRoot
    ? {
        flex: '1 100%',
        pt: '12px',
        marginLeft: 0,
        fontFamily: 'Fira Code',
      }
    : {};
  return <Box ml="space.04" overflow="visible" {...rest} style={{ ...rootStyles }} />;
}

interface TupleNodeDisplayerProps {
  clarityType: ClarityType;
  children: React.ReactNode;
}
export function TupleNodeDisplayer({ clarityType, ...props }: TupleNodeDisplayerProps) {
  return clarityType === ClarityType.Tuple ? <Box {...props} /> : <Flex {...props} />;
}
export function TupleNodeLabelDisplayer(props: BoxProps) {
  return <Box mr="space.04" color="ink.text-subdued" {...props} />;
}

export function TupleNodeValueDisplayer(props: FlexProps) {
  return <Flex wordWrap="break-word" whiteSpace="pre-line" {...props} />;
}
