import React from 'react';
import { Box, Flex, Portal, space, Fade, themeColor, color } from '@blockstack/ui';
import { useDocSearchKeyboardEvents } from '@docsearch/react/dist/umd';

import { border } from '@common/utils';
import { Text } from '@components/typography';
import SearchIcon from 'mdi-react/SearchIcon';
import Router from 'next/router';
import Link from 'next/link';

const searchOptions = {
  apiKey: '40753d06eed43b94e6fd1fe4342479b9',
  indexName: 'blockstack_design',
};

function Hit({ hit, children }: any) {
  return (
    <Link href={hit.url.replace()}>
      <a>{children}</a>
    </Link>
  );
}

let DocSearchModal: any = null;

export const SearchBox: React.FC<any> = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const importDocSearchModalIfNeeded = React.useCallback(function importDocSearchModalIfNeeded() {
    if (DocSearchModal) {
      setIsLoaded(true);
      return Promise.resolve();
    }

    return Promise.all([import('@docsearch/react/modal')]).then(([{ DocSearchModal: Modal }]) => {
      setIsLoaded(true);
      DocSearchModal = Modal;
    });
  }, []);

  const onOpen = React.useCallback(
    function onOpen() {
      importDocSearchModalIfNeeded().then(() => {
        setIsOpen(true);
      });
    },
    [importDocSearchModalIfNeeded, setIsOpen]
  );

  const onClose = React.useCallback(
    function onClose() {
      setIsOpen(false);
    },
    [setIsOpen]
  );

  React.useEffect(() => {
    if (isOpen && typeof document !== 'undefined') {
      const element = document.getElementById('docsearch-input');
      if (document.activeElement !== element) {
        element.focus();
      }
    }
  }, [isOpen]);

  useDocSearchKeyboardEvents({ isOpen, onOpen, onClose });

  return (
    <>
      {isLoaded && (
        <Portal>
          <Fade in={isOpen}>
            {styles => (
              <Box position="absolute" zIndex={9999} style={styles}>
                <DocSearchModal
                  {...searchOptions}
                  onClose={onClose}
                  navigator={{
                    navigate({ suggestionUrl }: any) {
                      Router.push(suggestionUrl);
                    },
                  }}
                  transformItems={(items: any[]) => {
                    return items.map(item => {
                      const url = new URL(item.url);
                      return {
                        ...item,
                        url: item.url.replace(url.origin, '').replace('#__next', ''),
                      };
                    });
                  }}
                  hitComponent={Hit}
                />
              </Box>
            )}
          </Fade>
        </Portal>
      )}
      <Box pt={space('base-loose')} px={space('base')} display={['none', 'none', 'block', 'block']}>
        <Flex
          onClick={onOpen}
          border={border()}
          borderRadius="6px"
          px={space('base-tight')}
          py={space('tight')}
          align="center"
          _hover={{ borderColor: themeColor('blue.400'), cursor: 'pointer' }}
        >
          <Box mr={space('tight')}>
            <SearchIcon size="18px" />
          </Box>
          <Text fontSize={'14px'} color={color('text-caption')}>
            Search docs
          </Text>
        </Flex>
      </Box>
    </>
  );
};

export default SearchBox;
