import { Component, h } from '@stencil/core';
import { state, Screens } from '../../store';
import { CloseIcon } from './assets/close-icon';
import { ChevronIcon } from './assets/chevron-icon';
import { Intro } from './screens/screens-intro';
import { HowItWorks } from './screens/screens-how-it-works';

@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.sass',
  assetsDirs: ['screens', 'assets'],
})
export class ModalBody {
  render() {
    return (
      <div class="modal-container">
        <div class="modal-body">
          <div class="modal-top">
            {state.screen === Screens.HOW_IT_WORKS ? <ChevronIcon /> : null}
            <div />
            {state.screen !== Screens.HOW_IT_WORKS ? <CloseIcon /> : null}
          </div>
          <div class="modal-content">
            {state.screen === Screens.INTRO && <Intro />}
            {state.screen === Screens.HOW_IT_WORKS && <HowItWorks />}
          </div>
        </div>
      </div>
    );
  }
}
