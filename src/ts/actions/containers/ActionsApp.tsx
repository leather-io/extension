import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider, theme, CSSReset } from '@blockstack/ui'
import { Flex, Box, Text, Button } from '@blockstack/ui'
import { hot } from 'react-hot-loader/root'
import { IAppState } from '@store'
import { selectAuthRequest, selectDecodedAuthRequest } from '@store/permissions/selectors'
import { selectCurrentWallet } from '@store/wallet/selectors'
import { AppManifest } from '@dev/types'

const ActionsApp: React.FC = () => {
  const [manifest, setManifest] = useState<AppManifest | null>(null)
  const { decodedAuthRequest, identities } = useSelector((state: IAppState) => ({
    authRequest: selectAuthRequest(state),
    decodedAuthRequest: selectDecodedAuthRequest(state),
    identities: selectCurrentWallet(state).identities
  }))

  if (!decodedAuthRequest) {
    return <>No auth request found</>
  }

  console.log(decodedAuthRequest)
  const loadManifest = async () => {
    const res = await fetch(decodedAuthRequest.manifest_uri)
    const json: AppManifest = await res.json()
    console.log(json)
    setManifest(json)
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadManifest()
  }, [])

  const signIn = async () => {
    if (!manifest) {
      return
    }
    const gaiaUrl = 'https://hub.blockstack.org'
    const authResponse = await identities[0].makeAuthResponse({
      gaiaUrl,
      appDomain: manifest.start_url,
      transitPublicKey: decodedAuthRequest.public_keys[0]
    })
    console.log(authResponse)
  }

  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <CSSReset />
        <Flex pt={2} px={2} wrap="wrap">
          <Box width="100%" textAlign="center">
            <Text textStyle="display.large">{!manifest ? 'Loading...' : `Sign in to ${manifest.name}`}</Text>
          </Box>
          <Box width="100%" textAlign="center" pt={6} px={4}>
            <Button isLoading={!manifest} variant="solid" size="lg" onClick={signIn}>
              Continue
            </Button>
          </Box>
        </Flex>
      </React.Fragment>
    </ThemeProvider>
  )
}

export default hot(ActionsApp)
