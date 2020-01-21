import React from 'react';
import { Flex } from '@blockstack/ui';
import { BoxProps } from '@blockstack/ui/dist/box';
import { OnboardingHeader } from '../header';
import { ScreenHeader } from './screen-header';
import { ScreenBody } from './screen-body';
import { ScreenContent } from './screen-content';
import { ScreenActions } from './screen-actions';
import { ScreenFooter } from './screen-footer';



interface IScreenTemplate {
  title: string | React.ElementType;
  body?: (string | JSX.Element)[];
  headerTitle?: string | JSX.Element;
  action: any;
  back?: () => void;
  after?: string | JSX.Element;
  before?: string | JSX.Element;
  footer?: string | JSX.Element;
  isLoading?: boolean;
  noMinHeight?: boolean;
  appIcon?: boolean;
}

const ScreenTemplate = ({
  before,
  title,
  body,
  headerTitle,
  action,
  after,
  footer,
  isLoading,
  noMinHeight = false,
  appIcon,
  ...rest
}: IScreenTemplate & BoxProps) => {
  return (
    <>
      <ScreenHeader isLoading={isLoading} />

      <ScreenBody noMinHeight={noMinHeight} isLoading={isLoading} {...rest}>
        <OnboardingHeader appIcon={appIcon} title={headerTitle || 'Data Vault'} close={() => console.log('test')} />

        {before && before}

        <ScreenContent title={title} body={body} />

        <ScreenActions action={action} />

        {after ? after : null}
        {footer ? <ScreenFooter>{footer}</ScreenFooter> : null}
      </ScreenBody>
    </>
  );
};

export { ScreenTemplate };
