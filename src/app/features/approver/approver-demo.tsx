import { Box, Circle, styled } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';
import { Callout } from '@app/ui/components/callout/callout';
import { Flag } from '@app/ui/components/flag/flag';
import { ItemInteractive } from '@app/ui/components/item/item-interactive';
import { ItemLayout } from '@app/ui/components/item/item.layout';

import { Approver } from './approver';

export function ApproverDemo() {
  return (
    <styled.div minH="100vh">
      <Approver>
        <Approver.Header title="Some prompt that breaks two lines" requester="gamma.io" />
        <Callout title="Some callout">Hey watch out for this sketchy app</Callout>
        <Approver.Section>
          <Approver.Subheader>Demo section 1</Approver.Subheader>
          <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />} align="top">
            <Box width="90%" height="16px" backgroundColor="ink.border-default" />
            <Box width="75%" height="12px" backgroundColor="ink.border-default" mt="space.02" />
          </Flag>
        </Approver.Section>
        <Approver.Section>
          <Approver.Subheader>Demo section 2</Approver.Subheader>
          <ItemLayout
            titleLeft="Example"
            titleRight="Example"
            captionLeft="Example"
            captionRight="Example"
            flagImg={<Circle size="40px" backgroundColor="ink.border-default" />}
          />
        </Approver.Section>
        <Approver.Advanced>
          <Approver.Section>
            Section 3
            <ItemInteractive onClick={() => {}} mt="space.03">
              <ItemLayout
                captionLeft="Example"
                captionRight="Example"
                flagImg={<Circle size="40px" backgroundColor="ink.border-default" />}
                titleLeft="Example"
                titleRight="Example"
              />
            </ItemInteractive>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
          <Approver.Section>
            <Approver.Subheader>Demo section 1</Approver.Subheader>
            <Flag img={<Circle size="40px" backgroundColor="ink.border-default" />}>
              <Box width="100%" height="20px" backgroundColor="ink.border-default" />
            </Flag>
          </Approver.Section>
        </Approver.Advanced>
        <Approver.Actions
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Approve</Button>
            </>
          }
        />
      </Approver>
    </styled.div>
  );
}
