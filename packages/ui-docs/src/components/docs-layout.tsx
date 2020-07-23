import React from 'react';
import { Flex, color, space } from '@blockstack/ui';
import { SideNav } from './side-nav';
import { Header } from './header';
import { Main } from './main';
import { Footer } from './footer';
import { useRouter } from 'next/router';
import { GettingStartedHeader } from './getting-started-header';
import { ContentWrapper } from './content-wrapper';
import NotFoundPage from '@pages/404';
import { createGlobalStyle } from 'styled-components';
import { TableOfContents } from '@components/toc';

import { css } from '@styled-system/css';
import { SIDEBAR_WIDTH, TOC_WIDTH } from '@common/constants';
export const MdxOverrides = createGlobalStyle`

:root{
--docsearch-modal-background:  ${color('bg')};
--docsearch-primary-color-R: 84;
--docsearch-primary-color-G: 104;
--docsearch-primary-color-B: 255;
--docsearch-primary-color: ${color('accent')};
--docsearch-input-color: ${color('text-title')};
--docsearch-highlight-color: var(--docsearch-primary-color);
--docsearch-placeholder-color: ${color('text-caption')};
--docsearch-container-background: rgba(22,22,22,0.75);
--docsearch-modal-shadow: inset 1px 1px 0px 0px hsla(0,0%,100%,0.5),0px 3px 8px 0px #555a64;
--docsearch-searchbox-background: var(--ifm-color-emphasis-300);
--docsearch-searchbox-focus-background: #fff;
--docsearch-searchbox-shadow: inset 0px 0px 0px 2px rgba(var(--docsearch-primary-color-R),var(--docsearch-primary-color-G),var(--docsearch-primary-color-B),0.5);
--docsearch-hit-color: var(--ifm-color-emphasis-800);
--docsearch-hit-active-color: #fff;
--docsearch-hit-background: #fff;
--docsearch-hit-shadow: 0px 1px 3px 0px #d4d9e1;
--docsearch-key-gradient: linear-gradient(-225deg,#d5dbe4,#f8f8f8);
--docsearch-key-shadow: inset 0px -2px 0px 0px #cdcde6,inset 0px 0px 1px 1px #fff,0px 1px 2px 1px rgba(30,35,90,0.4);
--docsearch-footer-background: #fff;
--docsearch-footer-shadow: 0px -1px 0px 0px #e0e3e8;
--docsearch-logo-color: #5468ff;
--docsearch-muted-color: #969faf;
--docsearch-modal-width: 560px;
--docsearch-modal-height: 600px;
--docsearch-searchbox-height: 56px;
--docsearch-hit-height: 56px;
--docsearch-footer-height: 44px;
--docsearch-spacing: 12px;
--docsearch-icon-stroke-width: 1.4;
}

pre{
  display: inline-block;
}
p, ul, ol, table {
  color: ${color('text-body')};
  a > pre {
    color: ${color('accent')} !important;
  }
}
`;

const DocsLayout: React.FC<{ headings?: string[] }> = ({ children, headings }) => {
  const router = useRouter();
  let isErrorPage = false;

  // get if NotFoundPage
  React.Children.forEach(children, (child: any) => {
    if (child?.type === NotFoundPage) {
      isErrorPage = true;
    }
  });
  return (
    <Flex minHeight="100vh" flexDirection="column">
      <Header />
      <Flex width="100%" flexGrow={1}>
        <SideNav display={['none', 'none', 'block']} />
        <Flex
          flexGrow={1}
          maxWidth={[
            '100%',
            '100%',
            `calc(100% - ${SIDEBAR_WIDTH}px)`,
            `calc(100% - ${SIDEBAR_WIDTH}px)`,
          ]}
          mt={'50px'}
          flexDirection="column"
        >
          <Main mx="unset" width={'100%'}>
            <Flex
              flexDirection={['column', 'column', 'row', 'row']}
              maxWidth="98ch"
              mx="auto"
              flexGrow={1}
            >
              <ContentWrapper
                width={
                  headings?.length
                    ? ['100%', '100%', `calc(100% - ${TOC_WIDTH}px)`, `calc(100% - ${TOC_WIDTH}px)`]
                    : '100%'
                }
                mx="unset"
                px="unset"
                pt="unset"
                pr={space('base-tight')}
                css={css({
                  '& > *:not(pre):not(ul):not(ol)': {
                    px: space('extra-loose'),
                  },
                  '& > ul, & > ol': {
                    pr: space('extra-loose'),
                    pl: '64px ',
                  },
                  p: {
                    '& + p': {
                      mt: space('extra-loose'),
                    },
                  },
                  '& > *:not(pre) a > code': {
                    color: color('accent'),
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  },
                  pre: {
                    '& + h2': {
                      mt: space('base'),
                    },
                    '& + h3': {
                      mt: space('base'),
                    },
                  },
                  h1: {
                    '& + *': {
                      mt: space('base-loose'),
                    },
                  },
                  h2: {
                    '& + h3': {
                      mt: 0,
                    },
                  },
                  'h1, h2, h3, h4, h5, h6': {
                    '& + pre': {
                      mt: '0',
                    },
                    '& + ul, & + ol': {
                      mt: '0',
                    },
                    '& + blockquote': {
                      mt: '0',
                    },
                  },
                  blockquote: {
                    '& + pre': {
                      mt: '0',
                    },
                    '& + h2': {
                      mt: '0',
                    },
                  },
                  '& > pre > *:not(pre)': {
                    border: 'none',
                    px: space(['extra-loose', 'extra-loose', 'none', 'none']),
                  },
                  '& > pre > div[style]': {
                    px: space(['base-loose', 'base-loose', 'none', 'none']),
                  },
                  '& > pre > .code-editor': {
                    pl: space(['base', 'base', 'none', 'none']),
                  },
                  '& > pre': {
                    px: space(['none', 'none', 'extra-loose', 'extra-loose']),
                    border: 'none',
                    boxShadow: 'none',
                    my: space('extra-loose'),
                  },
                })}
              >
                {children}
              </ContentWrapper>
              {headings?.length && headings.length > 1 ? (
                <TableOfContents headings={headings} />
              ) : null}
            </Flex>
          </Main>
          <Footer justifySelf="flex-end" />
        </Flex>
      </Flex>
    </Flex>
  );
};

export { DocsLayout };
