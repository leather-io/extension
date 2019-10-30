import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Box } from '@blockstack/ui'
import { doAuthRequest } from '../../background/store/permissions'
import * as PermissionsActions from '../../background/store/permissions/actions'
import { openPopup } from '../../actions/utils'

interface Props {
  doAuthRequest: typeof doAuthRequest
}

const DevActions = ({ doAuthRequest }: Props) => {
  const [authRequest, setAuthRequest] = useState('')

  const saveAuthRequest = (evt: React.FormEvent) => {
    evt && evt.preventDefault()
    doAuthRequest(authRequest)
    openPopup('http://localhost:8080/actions.html')
    console.log(authRequest)
  }

  return (
    <Box width={1}>
      <br />
      <p>Dev Console:</p>
      <form action="/" onSubmit={saveAuthRequest}>
        <input type="text" value={authRequest} onChange={e => setAuthRequest(e.target.value)} />
        <input type="submit" value="Save authRequest" />
      </form>
    </Box>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ ...PermissionsActions }, dispatch)

export default connect(
  null,
  mapDispatchToProps
)(DevActions)
