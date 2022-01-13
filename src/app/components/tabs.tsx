import { Box, BoxProps, color, Stack } from '@stacks/ui';

const TabButton = ({
  isActive,
  label,
  ...rest
}: { isActive?: boolean; label: string } & BoxProps) => {
  return (
    <Box
      flexGrow={1}
      px="base"
      py="tight"
      textAlign="center"
      borderRadius="10px"
      color={isActive ? color('text-title') : color('text-caption')}
      fontSize={1}
      fontWeight={isActive ? 500 : 400}
      as="button"
      _hover={!isActive ? { color: color('text-title') } : undefined}
      border={0}
      position="relative"
      zIndex={4}
      {...rest}
    >
      {label}
    </Box>
  );
};

function BackgroundPill({ alignment }: { alignment: 'start' | 'end' }) {
  return (
    <Box
      position="absolute"
      height="calc(100% - 8px)"
      width="calc(50% - 4px)"
      bg={color('bg')}
      top="4px"
      transition="all 0.65s cubic-bezier(0.23, 1, 0.32, 1)"
      left={0}
      transform={alignment === 'start' ? 'translateX(4px)' : 'translateX(calc(100% + 4px))'}
      borderRadius="8px"
    />
  );
}

interface Tabs {
  slug: string;
  label: string;
}

export function Tabs({
  tabs,
  activeTab,
  onTabClick,
  ...rest
}: {
  tabs: Tabs[];
  activeTab: number;
  onTabClick: (index: number) => void;
}) {
  return (
    <Stack
      bg={color('bg-4')}
      borderRadius="10px"
      isInline
      p="extra-tight"
      position="relative"
      width={['100%', '193px']}
      {...rest}
    >
      <BackgroundPill alignment={activeTab === 0 ? 'start' : 'end'} />
      <>
        {tabs.map((tab, index) => (
          <TabButton
            onClick={() => onTabClick(index)}
            isActive={activeTab === index}
            key={tab.slug}
            label={tab.label}
          />
        ))}
      </>
    </Stack>
  );
}
