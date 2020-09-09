import { Component, h, Prop, Event, EventEmitter } from '@stencil/core';
import { state, Screens } from '../../store';
import { CloseIcon } from './assets/close-icon';
import { ChevronIcon } from './assets/chevron-icon';
import { Intro } from './screens/screens-intro';
import { HowItWorks } from './screens/screens-how-it-works';
import { AuthOptions } from '@blockstack/connect/auth';

@Component({
  tag: 'connect-modal',
  styleUrl: 'modal.scss',
  assetsDirs: ['screens', 'assets'],
  shadow: true,
})
export class Modal {
  @Prop() authOptions: AuthOptions;
  @Event()
  signUp: EventEmitter;

  @Event()
  signIn: EventEmitter;

  @Event()
  closeModal: EventEmitter;

  render() {
    const handleContainerClick = (event: MouseEvent) => {
      const target = event.target as HTMLDivElement;
      if (target.className?.includes && target.className.includes('modal-container')) {
        this.closeModal.emit();
      }
    };
    return (
      <div class="modal-container" onClick={handleContainerClick}>
        <div class="modal-body">
          <div class="modal-top">
            {state.screen === Screens.HOW_IT_WORKS ? <ChevronIcon /> : null}
            <div />
            {state.screen !== Screens.HOW_IT_WORKS ? (
              <CloseIcon onClick={() => this.closeModal.emit()} />
            ) : null}
          </div>
          <div class="modal-content">
            {state.screen === Screens.INTRO && (
              <Intro authOptions={this.authOptions} signUp={this.signUp} signIn={this.signIn} />
            )}
            {state.screen === Screens.HOW_IT_WORKS && <HowItWorks />}
          </div>
        </div>
      </div>
    );
  }
}
