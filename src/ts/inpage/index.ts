const _window: any = window

_window.BlockstackApp = {
  auth: (authRequest: string) => {
    window.postMessage(
      {
        method: 'auth',
        authRequest,
        source: 'blockstack-app'
      },
      window.location.origin
    )
  }
}
