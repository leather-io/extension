import { h } from '@stencil/core';
import { PadlockIcon } from '../assets/padlock-icon';
import { EyeIcon } from '../assets/eye-icon';
import { state, Screens } from '../../../store';
import { LinkIcon } from '../assets/link-icon';
import { PadlockBox } from '../assets/padlock-box';

export const Intro = () => {
  return (
    <div>
      <div class="app-element-container">
        <div class="app-element-app-icon">
          <img src="http://localhost:3000/assets/messenger-app-icon.png" alt="Testing App" />
        </div>
        <div class="app-element-link">
          <LinkIcon />
        </div>
        <div class="app-element-lock">
          <PadlockBox />
        </div>
      </div>
      <span class="modal-header pxl">
        Testing App guarantees your privacy by encrypting everything
      </span>
      <div class="divider" />
      <div class="intro-entry">
        <div class="intro-entry-icon">
          <PadlockIcon />
        </div>
        <span class="intro-entry-copy">
          You'll get a Secret Key that automatically encrypts everything you do
        </span>
      </div>
      <div class="divider" />
      <div class="intro-entry">
        <div class="intro-entry-icon">
          <EyeIcon />
        </div>
        <span class="intro-entry-copy">
          You'll get a Secret Key that automatically encrypts everything you do
        </span>
      </div>
      <div class="button-container">
        <button class="button">
          <span>Get your Secret Key</span>
        </button>
      </div>
      <div class="modal-footer">
        <span class="link">Sign in</span>
        <span class="link" onClick={() => (state.screen = Screens.HOW_IT_WORKS)}>
          How it works
        </span>
        <span class="link">Install extension</span>
      </div>
    </div>
  );
};
