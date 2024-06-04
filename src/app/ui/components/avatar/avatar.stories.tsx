import StampsAvatarIconSrc from '@assets/avatars/stamps-avatar-icon.png';
import type { Meta, StoryObj } from '@storybook/react';

import { PlaceholderIcon } from '@leather-wallet/ui';

import { Avatar as Component } from './avatar';

const meta: Meta<typeof Component.Root> = {
  component: Component.Root,
  tags: ['autodocs'],
  title: 'Avatar',
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg', 'xl', 'xxl'],
      control: { type: 'radio' },
      defaultValue: 'lg',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Component.Root>;

export const Avatar: Story = {
  parameters: {
    controls: { include: ['size'] },
  },
  args: {
    children: (
      <>
        <Component.Image alt="ST" src={StampsAvatarIconSrc} />
        <Component.Fallback>ST</Component.Fallback>
      </>
    ),
    size: 'lg',
    variant: 'circle',
  },
};

export const Thumbnail: Story = {
  parameters: {
    controls: { include: ['size'] },
  },
  args: {
    children: (
      <>
        <Component.Fallback>B</Component.Fallback>
      </>
    ),
    size: 'lg',
    variant: 'square',
  },
};

export const WithSvg: Story = {
  parameters: {
    controls: { include: ['size'] },
  },
  args: {
    children: (
      <Component.Svg>
        <rect width="100%" height="100%" rx="16" fill="#F59300" />
        <path
          d="M21.966 13.8343C22.2365 12.048 20.8598 11.0878 18.9774 10.4472L19.588 8.02739L18.0971 7.66032L17.5026 10.0163C17.1107 9.91982 16.7081 9.82879 16.3081 9.7386L16.9068 7.36708L15.4168 7L14.8057 9.41892C14.4813 9.34592 14.1628 9.27378 13.8537 9.19784L13.8554 9.19029L11.7992 8.68309L11.4026 10.2563C11.4026 10.2563 12.5088 10.5067 12.4855 10.5222C13.0893 10.6712 13.1984 11.0659 13.1802 11.3789L12.4846 14.1355C12.5262 14.146 12.5802 14.1611 12.6396 14.1846C12.5899 14.1724 12.5369 14.159 12.4821 14.146L11.5071 18.0077C11.4332 18.1889 11.2459 18.4607 10.8238 18.3575C10.8387 18.3789 9.74016 18.0903 9.74016 18.0903L9 19.7763L10.9402 20.2541C11.3011 20.3435 11.6549 20.4371 12.0031 20.5252L11.3861 22.9726L12.8753 23.3397L13.4863 20.9182C13.8932 21.0273 14.2881 21.128 14.6745 21.2228L14.0656 23.6329L15.5565 24L16.1735 21.5572C18.7158 22.0325 20.6276 21.8408 21.4323 19.5691C22.0807 17.74 21.4 16.6849 20.0624 15.9969C21.0365 15.775 21.7703 15.1419 21.966 13.8343ZM18.5595 18.5534C18.0988 20.3825 14.9815 19.3937 13.9709 19.1458L14.7896 15.9034C15.8002 16.1525 19.0411 16.6459 18.5595 18.5534ZM19.0207 13.8079C18.6003 15.4717 16.0057 14.6264 15.1641 14.4191L15.9064 11.4783C16.748 11.6856 19.4585 12.0724 19.0207 13.8079Z"
          fill="white"
        />
      </Component.Svg>
    ),
    size: 'lg',
    variant: 'circle',
  },
};

export const WithDefaultIcon: Story = {
  parameters: {
    controls: { include: [] },
  },
  args: {
    children: (
      <Component.Icon>
        <PlaceholderIcon />
      </Component.Icon>
    ),
    size: 'lg',
    variant: 'circle',
  },
};

export const WithSmallIcon: Story = {
  parameters: {
    controls: { include: [] },
  },
  args: {
    children: (
      <Component.Icon>
        <PlaceholderIcon variant="small" />
      </Component.Icon>
    ),
    size: 'md',
    variant: 'circle',
  },
};
