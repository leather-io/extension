import React from 'react';
import { Box, PseudoBox, Flex, Text } from '@blockstack/ui';
import { useHover } from 'use-events';
import { Logo } from '../../../common/logo';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { Image } from '../../landing/image';
const ModalContext = React.createContext({ isOpen: false, doOpenModal: null, doCloseModal: null });

const useModalState = () => React.useContext(ModalContext);

const HeaderTitle = ({ hideIcon = false, title }) => (
  <Flex align="center">
    {hideIcon ? null : (
      <Logo mr={2} />
    )}
    <Text fontWeight="bold" fontSize={'12px'}>
      {title}
    </Text>
  </Flex>
);

const HeaderCloseButton = ({ onClick }) => (
  <PseudoBox color="ink.300" opacity={0.5} _hover={{ opacity: 1, cursor: 'pointer' }} onClick={onClick}>
    <CloseIcon size={20} />
  </PseudoBox>
);
interface IModalHeader {
  appIcon?: string;
  title: string;
  close: any;
  hideIcon?: boolean;
}

const AppIcon = ({ src, name, ...rest }) => (
  <Box size={6} {...rest}>
    <Image src={src} alt={name} title={name} />
  </Box>
);

const ModalHeader = ({ appIcon, close, title, hideIcon, ...rest }: IModalHeader) => {
  return (
    <Flex
      p={[4, 5]}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex align="center">
        {appIcon ? <AppIcon src={appIcon} name="replace with app name" /> : null}
        {appIcon ? (
          <Box pr={1} pl={2} color="ink.300">
            <ChevronRightIcon size={20} />
          </Box>
        ) : null}
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      <HeaderCloseButton onClick={close} />
    </Flex>
  );
};

const ModalContent = ({ children, ...rest }) => {
  return (
    <Flex width="100%" height="100%" {...rest}>
      {children}
    </Flex>
  );
};

const Modal = ({ footer = null, appIcon = null, title, hideIcon = false, close, children }) => {
  return (
    <>
      <Flex
        position="fixed"
        size="100%"
        left={0}
        top={0}
        align={['flex-end', 'center']}
        justify="center"
        bg="rgba(0,0,0,0.48)"
        zIndex={99}
      >
        <Flex
          bg="white"
          direction="column"
          minWidth={['100%', '440px']}
          width="100%"
          maxWidth={['100%', '440px']}
          maxHeight={['100vh', 'calc(100vh - 48px)']}
          borderRadius={['unset', '6px']}
          boxShadow="high"
        >
          <ModalHeader hideIcon={hideIcon} close={close} appIcon={appIcon} title={title} />
          <Flex width="100%" p={[5, 8]} overflowY="auto" flexGrow={1} position="relative">
            <ModalContent>{children}</ModalContent>
          </Flex>
          {footer ? footer : null}
        </Flex>
      </Flex>
    </>
  );
};

const ModalProvider = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const doOpenModal = () => (!isOpen ? setIsOpen(true) : null);
  const doCloseModal = () => (isOpen ? setIsOpen(true) : null);
  return (
    <ModalContext.Provider
      value={{
        isOpen,
        doOpenModal,
        doCloseModal
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, Modal, useModalState };
