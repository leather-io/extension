import React from 'react';
import { useConnect } from '../../hooks/use-connect';
import { Modal } from '../modal';
import ShadowDOM from 'react-shadow/styled-components';

export const Shadow: React.FC= () => {
  const { isOpen } = useConnect();
  return (
    <ShadowDOM.div style={{ minHeight: '100vh', display: isOpen ? 'block' : 'none' }} id="__connect-shadow-root">
      <Modal />
    </ShadowDOM.div>
  )
}