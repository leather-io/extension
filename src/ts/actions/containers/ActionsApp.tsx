import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import styled, { ThemeProvider } from 'styled-components'
import Identity from 'blockstack-keychain/lib-esm/identity'
import Wallet from 'blockstack-keychain/lib-esm/wallet'
import { hot } from 'react-hot-loader/root'
import { IAppState } from '../../background/store'
import GlobalStyle from '../../components/styles/GlobalStyle'
import { themes, ThemeTypes } from '../../components/styles/themes'

interface IActionsApp {
  identities: Identity[]
  authRequest: string | null
  theme: ThemeTypes
  dispatch: Dispatch
}

interface DemoProps {
  authRequest: string | null
}

const Demo: React.FC<DemoProps> = ({ authRequest }: DemoProps) => {
  return <p>{authRequest}</p>
}

class ActionsApp extends React.Component<IActionsApp> {
  render() {
    return (
      <ThemeProvider theme={themes[this.props.theme]}>
        <React.Fragment>
          <GlobalStyle />
          <ActionsAppContainer>
            <p>poptest</p>
            <Demo authRequest={this.props.authRequest} />
          </ActionsAppContainer>
        </React.Fragment>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = (state: IAppState) => {
  return {
    identities: (state.wallet.currentWallet as Wallet).identities,
    authRequest: state.permissions.authRequest,
    theme: state.settings.theme
  }
}

export default hot(connect(mapStateToProps)(ActionsApp))

const ActionsAppContainer = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: center;
  justify-items: center;
  align-items: center;
  height: 200px;
  width: 300px;
  margin: 10px;
  background-color: ${p => p.theme.backgroundColor};
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
`
