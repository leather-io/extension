import { Flex, Stack, StackProps } from '@stacks/ui';
import AddFunds from '@assets/images/add-funds.svg';
import BackUpSecretKey from '@assets/images/back-up-secret-key.svg';
import React, { memo, ReactNode } from 'react';
import { Caption, Title } from '@components/typography';
import { Link } from '@components/link';
import { FiCheck, FiArrowRight, FiXCircle } from 'react-icons/fi';
import { Text } from '@stacks/ui';
import { useCurrentAccount } from '@store/accounts/account.hooks';

const Badge: React.FC<StackProps> = () => {
  return (
    <Flex flexDirection={'row'} className="popup-invisible">
      <FiCheck />
      <Text ml={1} fontSize="12px">
        Done
      </Text>
    </Flex>
  );
};

const ResponsiveIconText: React.FC<{ image: ReactNode }> = props => {
  const { image } = props;
  return <img src={image} />;
};

interface IntroCardProps {
  image: ReactNode;
  done: boolean;
  body: string;
  title: string;
}

const IntroCard: React.FC<IntroCardProps> = memo(props => {
  const { image, done, body, title } = props;
  return (
    <Stack
      className="intro-card--item"
      overflow="hidden"
      display="block"
      alignItems="flex-start"
      spacing="base-tight"
      flexGrow={1}
      padding="12px"
    >
      <ResponsiveIconText image={image} />
      <Title>{title}</Title>
      <Caption className="popup-invisible">{body}</Caption>
      {!done ? (
        <Link
          onClick={() => window.open('', '_blank')}
          color="blue"
          display="flex"
          className="popup-invisible"
        >
          {'Start'}
          <Stack ml={1}>
            <FiArrowRight />
          </Stack>
        </Link>
      ) : (
        <Badge />
      )}
    </Stack>
  );
});
export const OnboardingIntro: React.FC<StackProps> = memo(props => {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) {
    console.error('Error! Homepage rendered without account state, which should never happen.');
    return null;
  }

  const tiles = [
    { title: 'Add some funds', body: 'Get some STX so you can start using apps', image: AddFunds },
    { title: 'Register a name', body: 'Register your unique decentralized name', image: AddFunds },
    {
      title: 'Backup secret key',
      body: "Don't lose access to your account and crypto",
      image: BackUpSecretKey,
      done: true,
    },
    {
      title: 'Explore apps',
      body: 'Try Stacks apps for finance, NFTs, blogging and more',
      image: BackUpSecretKey,
    },
  ];
  return (
    <Stack>
      <Stack ml={1} position="absolute" top={0} right="20px" className="popup-invisible">
        <FiXCircle fontSize="24px" color="#74777D" />
      </Stack>
      <Caption className="margin-bottom-bigger">Welcome to Stacks &#x1F44B;</Caption>
      <Title
        as="h1"
        lineHeight="1rem"
        fontSize={4}
        fontWeight={500}
        className="margin-bottom-bigger"
        {...props}
      >
        {' '}
        Next steps for you{' '}
      </Title>
      <Flex
        flexDirection="row"
        flexWrap="wrap"
        spacing="base-tight"
        alignItems="center"
        isInline
        className="intro-card margin-bottom-bigger"
        {...props}
      >
        {tiles.map(tile => {
          return <IntroCard {...tile} />;
        })}
      </Flex>
    </Stack>
  );
});
