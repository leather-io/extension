import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { IAppState } from '../../background/store'
import { doStoreSeed } from '../../background/store/wallet'
import * as WalletActions from '../../background/store/wallet/actions'

interface SeedProps {
  seed: string | null
  doStoreSeed: typeof doStoreSeed
}

const Seed = ({ doStoreSeed, seed: _seed }: SeedProps) => {
  const [seed, setSeed] = useState(_seed || "")
  const saveSeed = () => {
    doStoreSeed(seed)
  }

  return (
    <div>
      {/* <Box width={1}> */}
      <p>Seed is: {seed}</p>
      <input type="text" onChange={(evt) => setSeed(evt.target.value)} value={seed} />
      <p>
        <a href="#" onClick={saveSeed}>Save</a>
      </p>
      {/* </Box> */}
    </div>
  )
}

const mapStateToProps = (state: IAppState) => ({
  seed: state.wallet.seed
})

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ ...WalletActions }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Seed)
