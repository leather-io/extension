import React from 'react';

import { Header } from './Header';

export default {
  title: 'Blockstack/Header',
  component: Header,
};

const Template = args => <Header {...args} />;

export const LoggedIn = Template.bind({});
LoggedIn.args = {
  user: {},
};

export const LoggedOut = Template.bind({});
LoggedOut.args = {};
