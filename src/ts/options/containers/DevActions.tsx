import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import * as WalletActions from '../../background/store/wallet/actions'

const DevActions = () => {
  const [authRequest, setAuthRequest] = useState('')

  const saveAuthRequest = (evt: React.FormEvent) => {
    evt && evt.preventDefault
    console.log(authRequest)
  }

  return (
    <>
      <br />
      <p>Dev Console</p>
      <form action="/" onSubmit={saveAuthRequest}>
        <input type="text" value={authRequest} onChange={e => setAuthRequest(e.target.value)} />
        <input type="submit" value="Save authRequest" />
      </form>
    </>
  )
}

export default DevActions
