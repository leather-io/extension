import { Meta, StoryObj } from '@storybook/react';
import { Box, Circle, Flex } from 'leather-styles/jsx';

import { Button } from '@app/ui/components/button/button';
import { Flag } from '@app/ui/components/flag/flag';
import { ItemLayout } from '@app/ui/components/item-layout/item-layout';
import { Pressable } from '@app/ui/components/pressable/pressable';
import { ZapIcon } from '@app/ui/icons';

import { Approver } from './approver';

const meta: Meta<typeof Approver> = {
  component: Approver,
  tags: ['autodocs'],
  title: 'Feature/Approver',
  render: ({ children, ...args }) => (
    <Flex maxW="390px" h="680px" border="1px solid lightgrey" overflowY="auto">
      <Approver {...args}>{children}</Approver>
    </Flex>
  ),
};

export default meta;

type Story = StoryObj<typeof Approver>;

function DemoApproverContent() {
  return (
    <>
      {' '}
      <Approver.Section>
        <Approver.Subheader>
          Subheader with icon <ZapIcon variant="small" />
        </Approver.Subheader>
        <Pressable>
          <ItemLayout
            img={<Circle size="40px" backgroundColor="ink.border-default" />}
            titleLeft={<Box width="180px" height="14px" backgroundColor="ink.border-default" />}
            titleRight={<Box width="50px" height="14px" backgroundColor="ink.border-default" />}
            captionLeft={<Box width="70px" height="12px" backgroundColor="ink.border-default" />}
            captionRight={<Box width="40px" height="12px" backgroundColor="ink.border-default" />}
          />
        </Pressable>
        <Approver.Subheader mt="space.05">Subheader 2</Approver.Subheader>
        <Flag
          img={<Circle size="40px" backgroundColor="ink.border-default" />}
          align="top"
          mb="space.03"
        >
          <Box width="90%" height="16px" backgroundColor="ink.border-default" />
          <Box width="75%" height="12px" backgroundColor="ink.border-default" mt="space.02" />
        </Flag>
      </Approver.Section>
      <Approver.Section>
        <Approver.Subheader>Example rich content with avatar</Approver.Subheader>
        <ItemLayout
          titleLeft="Michelly token"
          titleRight="100 MICA"
          captionLeft="SIP-10"
          captionRight="$894,891"
          img={<Circle size="40px" backgroundColor="ink.border-default" />}
        />
      </Approver.Section>
      <Approver.Advanced>
        <Approver.Section>
          <Approver.Subheader>In the advanced section</Approver.Subheader>
          <Pressable onClick={() => {}} mt="space.03" mb="space.03">
            <ItemLayout
              titleLeft="Pressable"
              titleRight="Mr. Clicky"
              captionLeft="Interactive item"
              captionRight="Click me"
              img={<Circle size="40px" backgroundColor="ink.border-default" />}
            />
          </Pressable>
        </Approver.Section>
        <Approver.Section>
          <Approver.Subheader>Inputs & Outputs</Approver.Subheader>
          <Flag align="top" img={<Circle size="40px" backgroundColor="ink.border-default" />}>
            <Box width="100%" height="20px" backgroundColor="ink.border-default" />
          </Flag>
        </Approver.Section>
        <Approver.Section>
          <Approver.Subheader>Transaction raw data</Approver.Subheader>
          <Flag align="top" img={<Circle size="40px" backgroundColor="ink.border-default" />}>
            <Box width="100%" height="20px" backgroundColor="ink.border-default" />
          </Flag>
        </Approver.Section>
        <Approver.Section>
          <Approver.Subheader>Additional info</Approver.Subheader>
          <Flag align="top" img={<Circle size="40px" backgroundColor="ink.border-default" />}>
            <Box width="100%" height="20px" backgroundColor="ink.border-default" />
          </Flag>
        </Approver.Section>
      </Approver.Advanced>
    </>
  );
}

export const Pending: Story = {
  args: {
    children: (
      <>
        <Approver.Header title="Some prompt that breaks two lines" requester="gamma.io" />
        <Approver.Status status="pending"></Approver.Status>
        <DemoApproverContent />
        <Approver.Actions
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Approve</Button>
            </>
          }
        />
      </>
    ),
  },
};
export const Completed: Story = {
  args: {
    children: (
      <>
        <Approver.Header title="Completed" requester="alexlab.co" />
        <Approver.Status status="completed"></Approver.Status>
        <DemoApproverContent />
        <Approver.Actions
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Approve</Button>
            </>
          }
        />
      </>
    ),
  },
};

export const ActionsAlignToBottom: Story = {
  args: {
    children: (
      <>
        <Approver.Header
          title="Action align to bottom of page"
          requester="…… even when there's no content to push it there"
        />

        <Approver.Actions
          actions={
            <>
              <Button variant="outline">Cancel</Button>
              <Button>Approve</Button>
            </>
          }
        />
      </>
    ),
  },
};
