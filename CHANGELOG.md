# [3.9.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.8.0...v3.9.0) (2022-05-16)


### Bug Fixes

* hide nfts with zero balance ([67294a2](https://github.com/hirosystems/stacks-wallet-web/commit/67294a259ffca1b87323cb9c7d4e5419bc64430f))
* refetch account balance ([20f11cb](https://github.com/hirosystems/stacks-wallet-web/commit/20f11cb62dc35416df6defd64bc29ad89dae8dfd))
* scrollbars from padding changes ([1dffe55](https://github.com/hirosystems/stacks-wallet-web/commit/1dffe55ddca70fca4e400a53999b9ee449b2667d))
* subtract pending txs from send max balance ([8de6523](https://github.com/hirosystems/stacks-wallet-web/commit/8de65235cbc4c015d6dc8e0967f5b05ac6dd9907))
* use recoverable key format ([c80e651](https://github.com/hirosystems/stacks-wallet-web/commit/c80e6515d7c5a336b90d4a228c963f369fcdd122))


### Features

* add signature for structured data, closes [#2387](https://github.com/hirosystems/stacks-wallet-web/issues/2387) ([23d9d9a](https://github.com/hirosystems/stacks-wallet-web/commit/23d9d9ac388ecf54f570be93f0b909cc662f0b2e))

# [3.8.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.7.2...v3.8.0) (2022-05-16)


### Bug Fixes

* choose account padding ([13d091e](https://github.com/hirosystems/stacks-wallet-web/commit/13d091eeaa2931e571f142bfe01010ad9863fc52))
* disable confirm button until fees are loaded ([0500796](https://github.com/hirosystems/stacks-wallet-web/commit/05007964d07d1f7eec3f3e54fe1e1038c24a5e2f))
* error message page ([228e9b7](https://github.com/hirosystems/stacks-wallet-web/commit/228e9b7f5118e3a0073a10065bff023104b8c971))
* scrollbars from padding changes ([1038ddb](https://github.com/hirosystems/stacks-wallet-web/commit/1038ddbc9aeef83f57238ac22bf9fd3d02f78410))
* transaction page, keep padding at all breakpoints ([feebd62](https://github.com/hirosystems/stacks-wallet-web/commit/feebd62e0eab314eb238a6cbf546299db6bba2e6))


### Features

* add arbitrary message signing ([cfb28e8](https://github.com/hirosystems/stacks-wallet-web/commit/cfb28e8d8eaef7db56741cdcff321129dac368f9)), closes [#1051](https://github.com/hirosystems/stacks-wallet-web/issues/1051)
* update NFTs URL ([5bd221a](https://github.com/hirosystems/stacks-wallet-web/commit/5bd221a1b2b44633ce8041bc04c7554d126723fc))

## [3.7.2](https://github.com/hirosystems/stacks-wallet-web/compare/v3.7.1...v3.7.2) (2022-04-26)


### Bug Fixes

* error message page ([e579961](https://github.com/hirosystems/stacks-wallet-web/commit/e5799617b9229bf5a6da4db6948f26a810292ab3))

## [3.7.1](https://github.com/hirosystems/stacks-wallet-web/compare/v3.7.0...v3.7.1) (2022-04-25)


### Bug Fixes

* bug where wallet doesn't sign out, closes [#2341](https://github.com/hirosystems/stacks-wallet-web/issues/2341) ([5d6d52d](https://github.com/hirosystems/stacks-wallet-web/commit/5d6d52d745d5ad58215c16c63f5bce9a609ee3aa))
* create account drawer to toast ([db7cbf3](https://github.com/hirosystems/stacks-wallet-web/commit/db7cbf38fb978a32eecd2105e3196f5ca79be762))
* switch account drawer ([1d59e69](https://github.com/hirosystems/stacks-wallet-web/commit/1d59e69d515100df27ad08ce57727e272d0875c0))

# [3.7.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.6.1...v3.7.0) (2022-04-06)


### Bug Fixes

* fee dropdown positioning ([936199a](https://github.com/hirosystems/stacks-wallet-web/commit/936199a7ef117ae0abc4dfa0708549236f008615))
* search and select asset ([dc077b1](https://github.com/hirosystems/stacks-wallet-web/commit/dc077b18488541e859ceca1d3ee0ce3833302859))
* track tx signing errors ([a387ef1](https://github.com/hirosystems/stacks-wallet-web/commit/a387ef15dd232d5d397445422ecdb8f775b129fd))
* unauthorized request error ([28c1fa5](https://github.com/hirosystems/stacks-wallet-web/commit/28c1fa55d2cf7df1e47b1ad8eb00cbda125dd9e9))


### Features

* track first deposit ([07f661b](https://github.com/hirosystems/stacks-wallet-web/commit/07f661b3ed300913f431677f822c272015b116e9)), closes [#2232](https://github.com/hirosystems/stacks-wallet-web/issues/2232)

## [3.6.1](https://github.com/hirosystems/stacks-wallet-web/compare/v3.6.0...v3.6.1) (2022-03-30)


### Bug Fixes

* fee dropdown positioning ([a5d9121](https://github.com/hirosystems/stacks-wallet-web/commit/a5d91216144c467bbc58fdfb7c56284201e68528))
* track tx signing errors ([48d854f](https://github.com/hirosystems/stacks-wallet-web/commit/48d854fcbb668dfee246bb3d3126c814cf129aaa))
* unauthorized request error ([a0377d8](https://github.com/hirosystems/stacks-wallet-web/commit/a0377d850aa1d9d484a389b21d01bd14bca94a5e))

# [3.6.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.5.1...v3.6.0) (2022-03-28)


### Bug Fixes

* add low fee caps ([7196a88](https://github.com/hirosystems/stacks-wallet-web/commit/7196a8856363fd6c52817b97b8b684b6bf9ca19b))
* re-add dependency array for getAccountDisplayName usage ([e69dcac](https://github.com/hirosystems/stacks-wallet-web/commit/e69dcacafd6c0682ce27d5fa60ddf9dde8761c97))
* remove conditional code for post conditions in fts ([d1ca5df](https://github.com/hirosystems/stacks-wallet-web/commit/d1ca5df88897422d8b23a948333f4789aa18cfbc))


### Features

* add moonpay fiat onramp ([e20a2ea](https://github.com/hirosystems/stacks-wallet-web/commit/e20a2ea8c2bfbe1dbdd0f69200f30bd79d59eb9e)), closes [#2068](https://github.com/hirosystems/stacks-wallet-web/issues/2068)
* add new onboarding home page ([8e17124](https://github.com/hirosystems/stacks-wallet-web/commit/8e1712477dadb8d850716f4ce6e4605d29b84810))
* show account username suffices ([f8d631e](https://github.com/hirosystems/stacks-wallet-web/commit/f8d631e3e93103a6e23b82abb481bdbfade7ee78))

## [3.5.1](https://github.com/hirosystems/stacks-wallet-web/compare/v3.5.0...v3.5.1) (2022-03-24)


### Bug Fixes

* add low fee caps ([f391ccf](https://github.com/hirosystems/stacks-wallet-web/commit/f391ccf77bff5d48c119e3173ea1f669690261d0))

# [3.5.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.4.0...v3.5.0) (2022-03-22)


### Bug Fixes

* re-add dependency array for getAccountDisplayName usage ([9a40fd8](https://github.com/hirosystems/stacks-wallet-web/commit/9a40fd87dd2853ab724921e5443452dc117c955f))
* remove conditional code for post conditions in fts ([16624e2](https://github.com/hirosystems/stacks-wallet-web/commit/16624e2918d7ca4ca1187a8ddfbc5d2aaf49dd67))


### Features

* revert "Release/2022 03 02 white buffalo" ([3dee883](https://github.com/hirosystems/stacks-wallet-web/commit/3dee883878fc788426754910f8a20655aea335d2))
* show account username suffices ([289b44d](https://github.com/hirosystems/stacks-wallet-web/commit/289b44dd45bf8b18966261bbb371749d296f3450))

# [3.4.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.3.0...v3.4.0) (2022-03-21)


### Bug Fixes

* pull request template cc ([756aa4a](https://github.com/hirosystems/stacks-wallet-web/commit/756aa4a9bc718d236a36621c804dbc9a602f6afc))


### Features

* force trigger release ([222a448](https://github.com/hirosystems/stacks-wallet-web/commit/222a448737b4a0ba5cc36205dfebbf26fa181d6f))
* force trigger release redo ([b8c9f87](https://github.com/hirosystems/stacks-wallet-web/commit/b8c9f874380432a9eaae70000092f295be5cd862))
* force trigger version action ([7f4e4dc](https://github.com/hirosystems/stacks-wallet-web/commit/7f4e4dcb84f7f9f2f71c43adf01a477c1f3704de))

# [3.3.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.2.1...v3.3.0) (2022-03-16)


### Bug Fixes

* account names not displayed on sign in screen ([c2448fc](https://github.com/hirosystems/stacks-wallet-web/commit/c2448fc9a7a40496b40602d85faa3189bb5cbf57))
* backup old wallet salt key to gaia ([58696e3](https://github.com/hirosystems/stacks-wallet-web/commit/58696e36d6d982a167d44495141da8b2b3189f1e)), closes [#2238](https://github.com/hirosystems/stacks-wallet-web/issues/2238)
* removing localstorage vaules, remove later ([e62ab64](https://github.com/hirosystems/stacks-wallet-web/commit/e62ab6401afc4e8937f3a490c223f625060b51e0))
* unlock auth routing bug ([04c093d](https://github.com/hirosystems/stacks-wallet-web/commit/04c093d806d31affcc20a3e06f4e0e2ccc10800a))


### Features

* add testnet survey msg, closes [#2253](https://github.com/hirosystems/stacks-wallet-web/issues/2253) ([4f98430](https://github.com/hirosystems/stacks-wallet-web/commit/4f98430d8ca5c546363f8350c83be493423bd1ee))

## [3.2.1](https://github.com/hirosystems/stacks-wallet-web/compare/v3.2.0...v3.2.1) (2022-03-09)


### Bug Fixes

* account names not displayed on sign in screen ([15f9bbd](https://github.com/hirosystems/stacks-wallet-web/commit/15f9bbd50dff98e9300bae7ee8ba9258eac54326))
* prismjs vulnerability ([0dbc1d7](https://github.com/hirosystems/stacks-wallet-web/commit/0dbc1d7fe3a442790bba83a0b59d17a2758bb4bf))

# [3.2.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.1.1...v3.2.0) (2022-02-21)


### Bug Fixes

* add back tippy styles ([7ee08c8](https://github.com/hirosystems/stacks-wallet-web/commit/7ee08c8bcc8c9e3a410bd1d36bfa8273a05929a2))
* add release rules to commit analyzer ([2080626](https://github.com/hirosystems/stacks-wallet-web/commit/20806261e65dc49db34041a708e786409d520ffb))
* change okcoin wording ([41e7255](https://github.com/hirosystems/stacks-wallet-web/commit/41e72558682cb6c5ffc66e2e007144d8ca571949)), closes [#2170](https://github.com/hirosystems/stacks-wallet-web/issues/2170)
* disable performance tracking ([4dda809](https://github.com/hirosystems/stacks-wallet-web/commit/4dda809be1a4d45f5506cbe72a71c4151efe2ccd))
* double scrollbar issue firefox, closes [#2228](https://github.com/hirosystems/stacks-wallet-web/issues/2228) ([75f60a7](https://github.com/hirosystems/stacks-wallet-web/commit/75f60a75f60a25605670522fb55c00d536168620))
* hitting api with metadata queries ([8776d6b](https://github.com/hirosystems/stacks-wallet-web/commit/8776d6bd19835e430a8631b728a39cef250ac6ee))
* missing account balance ([0d5cdd8](https://github.com/hirosystems/stacks-wallet-web/commit/0d5cdd81627ce46efa0025b8c7199037a0b08d0c))
* near render loop issue ([e60d527](https://github.com/hirosystems/stacks-wallet-web/commit/e60d527b49b3bc88a3ad7f5bdcdae987452a2d70))
* pending label styling ([4f671eb](https://github.com/hirosystems/stacks-wallet-web/commit/4f671eb141a2e60758f3080d220136579d275e51)), closes [#2187](https://github.com/hirosystems/stacks-wallet-web/issues/2187)
* remove suspense, causes scroll bug, closes [#2220](https://github.com/hirosystems/stacks-wallet-web/issues/2220) ([664a3ae](https://github.com/hirosystems/stacks-wallet-web/commit/664a3aeb44993d0d5b10a4323c42371951bf47cb))
* send form styles ([a52696e](https://github.com/hirosystems/stacks-wallet-web/commit/a52696e0558d2f17a95be45d1703238dac9bf5ba))
* send max invalid fee calculation, closes [#2175](https://github.com/hirosystems/stacks-wallet-web/issues/2175) ([db22161](https://github.com/hirosystems/stacks-wallet-web/commit/db221617c5ffcf9bcb6cbf989a8646336984c227))
* slow fetching of metadata, hit api faster ([0b5fb74](https://github.com/hirosystems/stacks-wallet-web/commit/0b5fb744853b67c8570e0a3f6f2f7b3cd4f5782f))
* slower render performance on create account list, fixes [#2139](https://github.com/hirosystems/stacks-wallet-web/issues/2139) ([1e21648](https://github.com/hirosystems/stacks-wallet-web/commit/1e21648c393d5b599569261c043784b128a2584d))
* slower render performance on create account list, fixes [#2139](https://github.com/hirosystems/stacks-wallet-web/issues/2139) ([4e372e4](https://github.com/hirosystems/stacks-wallet-web/commit/4e372e4dd17994954269b80701835e3c82a7e0c2))
* sponsored tx fee ([9cfa3fd](https://github.com/hirosystems/stacks-wallet-web/commit/9cfa3fd52ddc28a69a9bf9bac8c7cb8662bba81e))
* thrown error with sponsored tx ([396a87f](https://github.com/hirosystems/stacks-wallet-web/commit/396a87fbbd40a6d59014ac185709c7f99088201e))


### Features

* add analytics to tx signing & fiat onramp ([e943119](https://github.com/hirosystems/stacks-wallet-web/commit/e943119b06a76d3ac5776ad94a408fd7e0dfcd26)), closes [#2037](https://github.com/hirosystems/stacks-wallet-web/issues/2037) [#2035](https://github.com/hirosystems/stacks-wallet-web/issues/2035)
* add back up secret key page ([6e11303](https://github.com/hirosystems/stacks-wallet-web/commit/6e113032d13ed1690be6944f2839add8ae592eb5))
* add config for max fee estimations ([0a7a20e](https://github.com/hirosystems/stacks-wallet-web/commit/0a7a20e4fad2b63b62d4155c6d6946fc0f319339)), closes [#2039](https://github.com/hirosystems/stacks-wallet-web/issues/2039)
* add message in activity list ([f67f7ab](https://github.com/hirosystems/stacks-wallet-web/commit/f67f7ab8aeb3209513e9479405700fe6ca627acd)), closes [#2187](https://github.com/hirosystems/stacks-wallet-web/issues/2187)
* add set password page ([9d18c72](https://github.com/hirosystems/stacks-wallet-web/commit/9d18c72bdebc014dc0f8d648064023b2dbd61e3f))
* add welcome page ([431e63b](https://github.com/hirosystems/stacks-wallet-web/commit/431e63b7a09404a7e20317146b5bdde9521b636b))


### Reverts

* Revert "feat: upgrade @stacks package to 3.1.0" ([58e3ee0](https://github.com/hirosystems/stacks-wallet-web/commit/58e3ee0f6b74ea87af7677b62015dcda2a13cd4e))
* Revert "chore: upgrade @stacks/wallet-sdk,auth to 3.1.1" ([27de05c](https://github.com/hirosystems/stacks-wallet-web/commit/27de05c3054caf1dd4b352b586a46d54c9cb6f39))
* Revert "fix: missing stx derivation type err" ([6da1ad6](https://github.com/hirosystems/stacks-wallet-web/commit/6da1ad6a69265373a08b996a88adcd4352ebf750))

## [3.1.1](https://github.com/hirosystems/stacks-wallet-web/compare/v3.1.0...v3.1.1) (2022-02-07)


### Bug Fixes

* virtual account list ([d94deec](https://github.com/hirosystems/stacks-wallet-web/commit/d94deec7b9c7e3d9b4e02a1d1512a7cd51bac021))

# [3.1.0](https://github.com/hirosystems/stacks-wallet-web/compare/v3.0.0...v3.1.0) (2022-02-07)


### Bug Fixes

* add back tippy styles ([1c7f7d4](https://github.com/hirosystems/stacks-wallet-web/commit/1c7f7d40dbbca52647e7a02daf349c56f65a152c))
* change okcoin wording ([8437cf3](https://github.com/hirosystems/stacks-wallet-web/commit/8437cf36c958e07d15b9afaee361f5948f1c9f52)), closes [#2170](https://github.com/hirosystems/stacks-wallet-web/issues/2170)
* disable performance tracking ([5059e5f](https://github.com/hirosystems/stacks-wallet-web/commit/5059e5ff4717134ce0a470366627f30102816b2d))
* hitting api with metadata queries ([6283e9c](https://github.com/hirosystems/stacks-wallet-web/commit/6283e9cc7d025fc15ace044818deb7ff34929766))
* missing account balance ([c6f9bca](https://github.com/hirosystems/stacks-wallet-web/commit/c6f9bca428a2f439e7d225c2767e10edf35927bf))
* near render loop issue ([7b7d097](https://github.com/hirosystems/stacks-wallet-web/commit/7b7d0972cdfcf977e38d244b4a7027b451b117b7))
* send form styles ([4aa6fd3](https://github.com/hirosystems/stacks-wallet-web/commit/4aa6fd3e1e5c85b2f786bceb32d1cd7beeb23c04))
* send max invalid fee calculation, closes [#2175](https://github.com/hirosystems/stacks-wallet-web/issues/2175) ([f764ed2](https://github.com/hirosystems/stacks-wallet-web/commit/f764ed2104e8ae1343fb387e12cd4ce6d8553730))
* slower render performance on create account list, fixes [#2139](https://github.com/hirosystems/stacks-wallet-web/issues/2139) ([87077cf](https://github.com/hirosystems/stacks-wallet-web/commit/87077cf18d48074dc89976491490426301d9eda2))
* slower render performance on create account list, fixes [#2139](https://github.com/hirosystems/stacks-wallet-web/issues/2139) ([cbb1fa5](https://github.com/hirosystems/stacks-wallet-web/commit/cbb1fa53680208230fe3602e425182dbaf424ea4))
* sponsored tx fee ([b0203b3](https://github.com/hirosystems/stacks-wallet-web/commit/b0203b32065b8fc632cf9e40c318c890c5c6a3f0))
* thrown error with sponsored tx ([f943979](https://github.com/hirosystems/stacks-wallet-web/commit/f9439796330aedc0bffa7e9a217f0b82705c4772))


### Features

* add analytics to tx signing & fiat onramp ([d1a986e](https://github.com/hirosystems/stacks-wallet-web/commit/d1a986e23c549d35a806018aff0cb981ebda307a)), closes [#2037](https://github.com/hirosystems/stacks-wallet-web/issues/2037) [#2035](https://github.com/hirosystems/stacks-wallet-web/issues/2035)
* add back up secret key page ([7a0acc0](https://github.com/hirosystems/stacks-wallet-web/commit/7a0acc0a774a08103e2ebef3542850ec2113e37a))
* add config for max fee estimations ([4a3a1bd](https://github.com/hirosystems/stacks-wallet-web/commit/4a3a1bdb24a77da19872625f7744ce47818238a5)), closes [#2039](https://github.com/hirosystems/stacks-wallet-web/issues/2039)
* add set password page ([cd7962e](https://github.com/hirosystems/stacks-wallet-web/commit/cd7962eedf447fce36be3cd9ca8d98b5f47940b7))
* add welcome page ([bc17596](https://github.com/hirosystems/stacks-wallet-web/commit/bc175968339cb761670c5ddb3e91f7c5b4a81bea))

# [3.0.0](https://github.com/hirosystems/stacks-wallet-web/compare/v2.24.1...v3.0.0) (2022-01-26)


### Bug Fixes

* breaking change from stacks.js ([d09244c](https://github.com/hirosystems/stacks-wallet-web/commit/d09244c32fe27701074f1700a41bef0e8c4e31d1))
* can't unlock wallet after upgrade ([1882c1f](https://github.com/hirosystems/stacks-wallet-web/commit/1882c1f101f1a0be2d52e2df0d8cc1dead9fbb0c)), closes [#2124](https://github.com/hirosystems/stacks-wallet-web/issues/2124)
* change wallet config default branch to main ([400a55a](https://github.com/hirosystems/stacks-wallet-web/commit/400a55a2aa5034d21329150e2a09c57a8b62e2d8))
* gaia config being fetched on every key press, closes [#2101](https://github.com/hirosystems/stacks-wallet-web/issues/2101) ([013ec9e](https://github.com/hirosystems/stacks-wallet-web/commit/013ec9e88d049559bff2f0eab79c35bb80e5d277))
* improve list render performance ([fd0154e](https://github.com/hirosystems/stacks-wallet-web/commit/fd0154ea3628a939f839ec8cfd829d84ea86a9bd))
* increase fee showing zero ([297afa8](https://github.com/hirosystems/stacks-wallet-web/commit/297afa891de11543bd482ca33551f88aac3bbbb9))
* is asset transferable logic, closes [#2154](https://github.com/hirosystems/stacks-wallet-web/issues/2154) ([32dbd96](https://github.com/hirosystems/stacks-wallet-web/commit/32dbd967b330a5cea4ab1d9464ca79e98d61355f))
* lock and unlocking routes ([5df9e88](https://github.com/hirosystems/stacks-wallet-web/commit/5df9e8803107659da89aed16fbc5126b62005d7b))
* long white screens ([ad41051](https://github.com/hirosystems/stacks-wallet-web/commit/ad4105155b6fd77bd13f9a118501784f4f247902))
* null rendering when accounts are undefined, closes [#2000](https://github.com/hirosystems/stacks-wallet-web/issues/2000) ([973dcc4](https://github.com/hirosystems/stacks-wallet-web/commit/973dcc447d6e8fc1cb71f1cb77e4601306766a97))
* onboarding route flashing ([b2e478b](https://github.com/hirosystems/stacks-wallet-web/commit/b2e478bb32088b8caf5cd259875e51d4db915a41))
* remove disabled regtest option from networks list ([6aafe89](https://github.com/hirosystems/stacks-wallet-web/commit/6aafe8964a3b262aa9d59ad48376779e3bb07109))
* remove gaia call when unlocking wallet ([837cef7](https://github.com/hirosystems/stacks-wallet-web/commit/837cef72d508a61b0b5c3e17c709a42204a59a0d)), closes [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877)
* remove gaia call when unlocking wallet ([b717b03](https://github.com/hirosystems/stacks-wallet-web/commit/b717b03d125a6df88a2c0cb51402b6c3b3a6bcbf)), closes [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877)
* remove inline source maps in prod ([46ddd28](https://github.com/hirosystems/stacks-wallet-web/commit/46ddd2829ecb40d1343143b39f7c03fc2038104c))
* rename localnet to devnet ([5e489d5](https://github.com/hirosystems/stacks-wallet-web/commit/5e489d5334f39595ca2a896e92965eef37a7bddb))
* render whole account list when fewer than 10 accounts ([abe1597](https://github.com/hirosystems/stacks-wallet-web/commit/abe1597c3b44a475500181d314156a434c02a52e))
* routing sign and signed out ([61d4851](https://github.com/hirosystems/stacks-wallet-web/commit/61d485190718b99f019c58207571af856a733ce6))
* security vulnerability from audit ([c80cd98](https://github.com/hirosystems/stacks-wallet-web/commit/c80cd980905bc0efc198cb1b322a5b8fde79f36e))
* show fiat onramp buy button only on mainnet ([6d1df94](https://github.com/hirosystems/stacks-wallet-web/commit/6d1df94d07bbc7af4d58543b2dcf411b25b469b4)), closes [#2049](https://github.com/hirosystems/stacks-wallet-web/issues/2049)
* submitted transactions not appearing ([e1e902d](https://github.com/hirosystems/stacks-wallet-web/commit/e1e902daa4c6cc836fc6ab80045f3b7ed0a62243))
* switch account failing test ([7efd8c9](https://github.com/hirosystems/stacks-wallet-web/commit/7efd8c989cf87181a01faf14a18ea60ab7dd4225))
* trigger release ([691a14b](https://github.com/hirosystems/stacks-wallet-web/commit/691a14b4f1630fb33a5bc269ef3d15dfe5758c80))
* use saved hasSetPassword from storage ([f3cfbff](https://github.com/hirosystems/stacks-wallet-web/commit/f3cfbffc9686a4c76c8f3a21b4463b3f90140cc1))


### chore

* **release:** 2.25.0 ([1747358](https://github.com/hirosystems/stacks-wallet-web/commit/1747358ea2d41fb81824fc383c5fc41d991ac3f9)), closes [#2124](https://github.com/hirosystems/stacks-wallet-web/issues/2124) [#2101](https://github.com/hirosystems/stacks-wallet-web/issues/2101) [#2000](https://github.com/hirosystems/stacks-wallet-web/issues/2000) [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877) [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877) [#2049](https://github.com/hirosystems/stacks-wallet-web/issues/2049) [#2041](https://github.com/hirosystems/stacks-wallet-web/issues/2041) [#2062](https://github.com/hirosystems/stacks-wallet-web/issues/2062)


### Features

* activate okcoin fiat onramp integration ([881e88d](https://github.com/hirosystems/stacks-wallet-web/commit/881e88de1fe04dff3bc6c619340636309e552703)), closes [#2105](https://github.com/hirosystems/stacks-wallet-web/issues/2105)
* add metrics for fee estimation ([2788a9b](https://github.com/hirosystems/stacks-wallet-web/commit/2788a9b75d3ff09bee29b4af9b7556b313a1da01)), closes [#2041](https://github.com/hirosystems/stacks-wallet-web/issues/2041)
* add unlock waiting message ([e2cf9f1](https://github.com/hirosystems/stacks-wallet-web/commit/e2cf9f13df5a6b74a5c34a22ec841d83c41535c2)), closes [#2062](https://github.com/hirosystems/stacks-wallet-web/issues/2062)
* reduce sentry tracesSampleRate ([a08a36d](https://github.com/hirosystems/stacks-wallet-web/commit/a08a36df21c9601b6e7c7694481546383285478a))


### Reverts

* Revert "feat: add welcome page" ([4b7859a](https://github.com/hirosystems/stacks-wallet-web/commit/4b7859a4f926b7020967293bf8be98a2821e82e3))
* Revert "refactor: global styles" ([97b16c1](https://github.com/hirosystems/stacks-wallet-web/commit/97b16c1f50f1ef061ae71c35514ad4bf904ec93b))
* Revert "feat: add back up secret key page" ([95c3a76](https://github.com/hirosystems/stacks-wallet-web/commit/95c3a766b74b0670b18d4d4ba0428771020b3d38))
* Revert "feat: add set password page" ([4f44c48](https://github.com/hirosystems/stacks-wallet-web/commit/4f44c48ca68de9614b0027d7fa49c24e30ddba00))
* Revert "refactor: update existing styles to match changes" ([326b0b2](https://github.com/hirosystems/stacks-wallet-web/commit/326b0b2834884a143b9af0d96aa51bb71e8dabf0))
* Revert "refactor: add primary button" ([152fffd](https://github.com/hirosystems/stacks-wallet-web/commit/152fffd2d38edb05e338c37a1cc3466cdafde076))


### BREAKING CHANGES

* **release:** from stacks.js ([d09244c](https://github.com/hirosystems/stacks-wallet-web/commit/d09244c32fe27701074f1700a41bef0e8c4e31d1))

## [2.25.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.25.0...v2.25.1) (2022-01-18)


### Bug Fixes

* security vulnerability ([c9dd7f0](https://github.com/hirosystems/stacks-wallet-web/commit/c9dd7f0547460f72258ff684c25768d0d068926c))

# [2.25.0](https://github.com/hirosystems/stacks-wallet-web/compare/v2.24.1...v2.25.0) (2022-01-18)


### Bug Fixes

* breaking change from stacks.js ([d09244c](https://github.com/hirosystems/stacks-wallet-web/commit/d09244c32fe27701074f1700a41bef0e8c4e31d1))
* can't unlock wallet after upgrade ([1882c1f](https://github.com/hirosystems/stacks-wallet-web/commit/1882c1f101f1a0be2d52e2df0d8cc1dead9fbb0c)), closes [#2124](https://github.com/hirosystems/stacks-wallet-web/issues/2124)
* change wallet config default branch to main ([400a55a](https://github.com/hirosystems/stacks-wallet-web/commit/400a55a2aa5034d21329150e2a09c57a8b62e2d8))
* gaia config being fetched on every key press, closes [#2101](https://github.com/hirosystems/stacks-wallet-web/issues/2101) ([013ec9e](https://github.com/hirosystems/stacks-wallet-web/commit/013ec9e88d049559bff2f0eab79c35bb80e5d277))
* improve list render performance ([fd0154e](https://github.com/hirosystems/stacks-wallet-web/commit/fd0154ea3628a939f839ec8cfd829d84ea86a9bd))
* increase fee showing zero ([297afa8](https://github.com/hirosystems/stacks-wallet-web/commit/297afa891de11543bd482ca33551f88aac3bbbb9))
* long white screens ([ad41051](https://github.com/hirosystems/stacks-wallet-web/commit/ad4105155b6fd77bd13f9a118501784f4f247902))
* null rendering when accounts are undefined, closes [#2000](https://github.com/hirosystems/stacks-wallet-web/issues/2000) ([973dcc4](https://github.com/hirosystems/stacks-wallet-web/commit/973dcc447d6e8fc1cb71f1cb77e4601306766a97))
* onboarding route flashing ([b2e478b](https://github.com/hirosystems/stacks-wallet-web/commit/b2e478bb32088b8caf5cd259875e51d4db915a41))
* remove disabled regtest option from networks list ([6aafe89](https://github.com/hirosystems/stacks-wallet-web/commit/6aafe8964a3b262aa9d59ad48376779e3bb07109))
* remove gaia call when unlocking wallet ([837cef7](https://github.com/hirosystems/stacks-wallet-web/commit/837cef72d508a61b0b5c3e17c709a42204a59a0d)), closes [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877)
* remove gaia call when unlocking wallet ([b717b03](https://github.com/hirosystems/stacks-wallet-web/commit/b717b03d125a6df88a2c0cb51402b6c3b3a6bcbf)), closes [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877)
* remove inline source maps in prod ([46ddd28](https://github.com/hirosystems/stacks-wallet-web/commit/46ddd2829ecb40d1343143b39f7c03fc2038104c))
* rename localnet to devnet ([5e489d5](https://github.com/hirosystems/stacks-wallet-web/commit/5e489d5334f39595ca2a896e92965eef37a7bddb))
* render whole account list when fewer than 10 accounts ([abe1597](https://github.com/hirosystems/stacks-wallet-web/commit/abe1597c3b44a475500181d314156a434c02a52e))
* security vulnerability from audit ([c80cd98](https://github.com/hirosystems/stacks-wallet-web/commit/c80cd980905bc0efc198cb1b322a5b8fde79f36e))
* show fiat onramp buy button only on mainnet ([6d1df94](https://github.com/hirosystems/stacks-wallet-web/commit/6d1df94d07bbc7af4d58543b2dcf411b25b469b4)), closes [#2049](https://github.com/hirosystems/stacks-wallet-web/issues/2049)
* switch account failing test ([7efd8c9](https://github.com/hirosystems/stacks-wallet-web/commit/7efd8c989cf87181a01faf14a18ea60ab7dd4225))
* use saved hasSetPassword from storage ([f3cfbff](https://github.com/hirosystems/stacks-wallet-web/commit/f3cfbffc9686a4c76c8f3a21b4463b3f90140cc1))


### Features

* add metrics for fee estimation ([2788a9b](https://github.com/hirosystems/stacks-wallet-web/commit/2788a9b75d3ff09bee29b4af9b7556b313a1da01)), closes [#2041](https://github.com/hirosystems/stacks-wallet-web/issues/2041)
* add unlock waiting message ([e2cf9f1](https://github.com/hirosystems/stacks-wallet-web/commit/e2cf9f13df5a6b74a5c34a22ec841d83c41535c2)), closes [#2062](https://github.com/hirosystems/stacks-wallet-web/issues/2062)


### Reverts

* Revert "feat: add welcome page" ([4b7859a](https://github.com/hirosystems/stacks-wallet-web/commit/4b7859a4f926b7020967293bf8be98a2821e82e3))
* Revert "refactor: global styles" ([97b16c1](https://github.com/hirosystems/stacks-wallet-web/commit/97b16c1f50f1ef061ae71c35514ad4bf904ec93b))
* Revert "feat: add back up secret key page" ([95c3a76](https://github.com/hirosystems/stacks-wallet-web/commit/95c3a766b74b0670b18d4d4ba0428771020b3d38))
* Revert "feat: add set password page" ([4f44c48](https://github.com/hirosystems/stacks-wallet-web/commit/4f44c48ca68de9614b0027d7fa49c24e30ddba00))
* Revert "refactor: update existing styles to match changes" ([326b0b2](https://github.com/hirosystems/stacks-wallet-web/commit/326b0b2834884a143b9af0d96aa51bb71e8dabf0))
* Revert "refactor: add primary button" ([152fffd](https://github.com/hirosystems/stacks-wallet-web/commit/152fffd2d38edb05e338c37a1cc3466cdafde076))

## [2.24.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.24.0...v2.24.1) (2022-01-11)


### Reverts

* Revert "refactor(tx-signing): use unsigned serialised txs for fee estimation" ([114e1de](https://github.com/hirosystems/stacks-wallet-web/commit/114e1deaadf20e71dd39b7a30084a220af5ba616))
* Revert "refactor(tx-signing): remove implicit signing of transactions from send-form" ([3161ed7](https://github.com/hirosystems/stacks-wallet-web/commit/3161ed7ee72e1b1a0a3e4f6fbacd1d71b3709128))
* Revert "refactor(tx-signing): upgrade '@stacks/transaction', '@stacks/connect'" ([f4a3a52](https://github.com/hirosystems/stacks-wallet-web/commit/f4a3a52b9963fc7a507e1db84d5988e2ffc4c518))
* Revert "refactor(tx-signing): adjust unusual fee behaviour, kill signed tx file" ([e836021](https://github.com/hirosystems/stacks-wallet-web/commit/e836021913594d6efde0e2f56be35defbf1e3c36))
* Revert "fix: breaking change from stacks.js" ([1d9e6ba](https://github.com/hirosystems/stacks-wallet-web/commit/1d9e6ba9d83373a30c78178a92a6bb44c8464af5))
* Revert "chore: update webpack mode to 'production'" ([8b77480](https://github.com/hirosystems/stacks-wallet-web/commit/8b77480ab334e536738025c78d1bc7c4bd38f9bb))
* Revert "fix: change wallet config default branch to main" ([0e2159b](https://github.com/hirosystems/stacks-wallet-web/commit/0e2159b687b53768b1ae8e356312b9a939e7bbbc))
* Revert "refactor: app routes and account gate" ([2a2cb56](https://github.com/hirosystems/stacks-wallet-web/commit/2a2cb5648304c8f0d1c6d71f67828f5e2a31f7bf))
* Revert "refactor: address code comments" ([fa240f1](https://github.com/hirosystems/stacks-wallet-web/commit/fa240f100aac4ef3e0b83eca4d896c199e1f54f6))
* Revert "refactor: replace useChangeScreen with useNavigate" ([2ad1117](https://github.com/hirosystems/stacks-wallet-web/commit/2ad11175dd7aa473ef969cc2316f00d15f41075c))
* Revert "refactor(onboarding): use layout component for welcome page" ([31b787c](https://github.com/hirosystems/stacks-wallet-web/commit/31b787c820f387cb6e32d81ff8740386eb71977c))
* Revert "refactor: routing fixes and cleanup" ([18c9ca3](https://github.com/hirosystems/stacks-wallet-web/commit/18c9ca3e69e62f5f3247cd97bbc752c185af6b43))
* Revert "feat: add metrics for fee estimation" ([37ca5ae](https://github.com/hirosystems/stacks-wallet-web/commit/37ca5ae8f2e1316f59ac642acb53347967c184ef))
* Revert "fix: show fiat onramp buy button only on mainnet" ([813de90](https://github.com/hirosystems/stacks-wallet-web/commit/813de9088ffde25cd0583f68bf4db2ea5016ceaf))
* Revert "refactor: use container route with layout" ([a48e74b](https://github.com/hirosystems/stacks-wallet-web/commit/a48e74b3acf9cb1f11a4ed32b625f2926861aef0))
* Revert "refactor: header for layout route" ([9b51528](https://github.com/hirosystems/stacks-wallet-web/commit/9b51528d5a708112d8692453434541284d136a5d))
* Revert "fix: increase fee showing zero" ([9938d20](https://github.com/hirosystems/stacks-wallet-web/commit/9938d20ef9ff9b051e6e865b54a3e900433e2c27))
* Revert "fix: onboarding route flashing" ([c51972b](https://github.com/hirosystems/stacks-wallet-web/commit/c51972b09c55556f55b78835388296a879fbf573))
* Revert "refactor: tidy up <SwitchAccount /> component" ([60797e3](https://github.com/hirosystems/stacks-wallet-web/commit/60797e3e2ba6b5be7251f4c620a560ca958ca5b5))
* Revert "fix: null rendering when accounts are undefined, closes #2000" ([f5fdfc8](https://github.com/hirosystems/stacks-wallet-web/commit/f5fdfc846f903188c44bb832180c689e520fa9ef)), closes [#2000](https://github.com/hirosystems/stacks-wallet-web/issues/2000)
* Revert "fix: improve list render performance" ([72e2b7c](https://github.com/hirosystems/stacks-wallet-web/commit/72e2b7c94e89fc07c63a2a8e71a37ffbb3bd5b3c))
* Revert "refactor(deps): upgrade @stacks/wallet-sdk" ([0989ec6](https://github.com/hirosystems/stacks-wallet-web/commit/0989ec617d7b8724ac6104dcf21b7fc954f86507))
* Revert "refactor(deps): upgrade @stacks/{common,auth,network}" ([3c26ab2](https://github.com/hirosystems/stacks-wallet-web/commit/3c26ab2c886ff819c8ec3d7d36d26a281a93509d))
* Revert "refactor(deps): upgrade @stacks/{transactions,encryption}" ([6427aa1](https://github.com/hirosystems/stacks-wallet-web/commit/6427aa1e014c14eb488982f58c6cf84640568cbe))
* Revert "refactor: improve switch account behaviour" ([96727af](https://github.com/hirosystems/stacks-wallet-web/commit/96727af0b122250159dcdf3e979b20c1d942213a))
* Revert "refactor: move type definitions" ([359cf83](https://github.com/hirosystems/stacks-wallet-web/commit/359cf83f21c63e12ba1ad2b1e2d7f1131d6237b2))
* Revert "fix: use saved hasSetPassword from storage" ([9168f31](https://github.com/hirosystems/stacks-wallet-web/commit/9168f31f0b6bc09e122cc51d5c28c4fa6a2fca13))
* Revert "fix: switch account failing test" ([e68c7c2](https://github.com/hirosystems/stacks-wallet-web/commit/e68c7c20ed845b60f818ac40d929592875eaec5d))
* Revert "refactor: move vault utility" ([5bfba0a](https://github.com/hirosystems/stacks-wallet-web/commit/5bfba0acbe7c6d2c3750cc6784ef4f55f17607c9))
* Revert "fix: long white screens" ([489ec81](https://github.com/hirosystems/stacks-wallet-web/commit/489ec8155f3d5a26418e9adb2f1aaa7709269755))
* Revert "refactor: remove ShowDelay" ([df06783](https://github.com/hirosystems/stacks-wallet-web/commit/df06783645d0021a7d232e0d0fc22b33aa5c42c8))
* Revert "refactor: use React jsx transform" ([3524860](https://github.com/hirosystems/stacks-wallet-web/commit/3524860c7048f51ae60515c4bc675d2bf1c42425))
* Revert "refactor: remove unnecessary imports" ([564c2fb](https://github.com/hirosystems/stacks-wallet-web/commit/564c2fbdfb22885a8f9ac30c32eb436aea254a08))
* Revert "refactor: add test for unlock route" ([dbf69fc](https://github.com/hirosystems/stacks-wallet-web/commit/dbf69fc330eee8509efa46dac52f8fce75f207ba))
* Revert "fix: remove gaia call when unlocking wallet" ([2ffb470](https://github.com/hirosystems/stacks-wallet-web/commit/2ffb4700b63264d67e78ffe5ae6ede4c962710d7))
* Revert "refactor: move vault utility" ([6e0342e](https://github.com/hirosystems/stacks-wallet-web/commit/6e0342efdc3379c67c6fcfa0dec835b968edd5dc))
* Revert "fix: remove gaia call when unlocking wallet" ([098d90a](https://github.com/hirosystems/stacks-wallet-web/commit/098d90a9a5f28d85fc6187a5f0cb21d36097ee41))
* Revert "refactor: add test for unique route paths" ([f26c850](https://github.com/hirosystems/stacks-wallet-web/commit/f26c85059871338dd00e09b522a42356f897dd24))
* Revert "feat: add unlock waiting message" ([95c012a](https://github.com/hirosystems/stacks-wallet-web/commit/95c012a1249683ec802e2d42e2f5533384ea4218))
* Revert "refactor(folders): move components" ([2f977d6](https://github.com/hirosystems/stacks-wallet-web/commit/2f977d68517ade25711cf30890b0747c76eb6b72))
* Revert "refactor: rename linting actions" ([13814d7](https://github.com/hirosystems/stacks-wallet-web/commit/13814d734059ee2969f794c6182288bc2857cce8))
* Revert "refactor(deps): update client deps" ([91eadd6](https://github.com/hirosystems/stacks-wallet-web/commit/91eadd6715b4caa97a45d00afd3beb8291ae0b0c))
* Revert "refactor(deps): update dev deps" ([d528d77](https://github.com/hirosystems/stacks-wallet-web/commit/d528d7711d22db2180d2cfb610ef8b4095cb3e13))
* Revert "fix: render whole account list when fewer than 10 accounts" ([b568c85](https://github.com/hirosystems/stacks-wallet-web/commit/b568c85100185e1094de325e858588e22e7d9705))
* Revert "fix: gaia config being fetched on every key press, closes #2101" ([96546e5](https://github.com/hirosystems/stacks-wallet-web/commit/96546e50ab7e7f5d6022d86b31168be04ebe5713)), closes [#2101](https://github.com/hirosystems/stacks-wallet-web/issues/2101)
* Revert "fix: remove disabled regtest option from networks list" ([5fd24dd](https://github.com/hirosystems/stacks-wallet-web/commit/5fd24ddf5057130e7d435b9fe9063e1ffb7caeb4))

# [2.24.0](https://github.com/hirosystems/stacks-wallet-web/compare/v2.23.2...v2.24.0) (2022-01-11)


### Bug Fixes

* breaking change from stacks.js ([85666ae](https://github.com/hirosystems/stacks-wallet-web/commit/85666ae3d1f33fbbe61c24877702a7caa03facc1))
* change wallet config default branch to main ([69ce2f0](https://github.com/hirosystems/stacks-wallet-web/commit/69ce2f00ea92b294b6393712778adf5b08b0c1a7))
* gaia config being fetched on every key press, closes [#2101](https://github.com/hirosystems/stacks-wallet-web/issues/2101) ([2484d78](https://github.com/hirosystems/stacks-wallet-web/commit/2484d78a9545b36518a444230f37a4185387e215))
* improve list render performance ([df65dbb](https://github.com/hirosystems/stacks-wallet-web/commit/df65dbbeeb5cc0b8256b6efc1eee3994ffe11bd1))
* increase fee showing zero ([492ed1c](https://github.com/hirosystems/stacks-wallet-web/commit/492ed1c0073f254004f848ab0f2794edcdefa722))
* long white screens ([feba515](https://github.com/hirosystems/stacks-wallet-web/commit/feba5157e071800a514f44d7d5d2168bc6f61482))
* null rendering when accounts are undefined, closes [#2000](https://github.com/hirosystems/stacks-wallet-web/issues/2000) ([5d95af0](https://github.com/hirosystems/stacks-wallet-web/commit/5d95af09622a7ebe7470a29a1a1384aea4511b31))
* onboarding route flashing ([f2419d5](https://github.com/hirosystems/stacks-wallet-web/commit/f2419d524a86f2064e6e9f4abd5902d09050cd82))
* remove disabled regtest option from networks list ([6a68a2f](https://github.com/hirosystems/stacks-wallet-web/commit/6a68a2f728a5574344602a56fa904ff8f073f51b))
* remove gaia call when unlocking wallet ([2bc01d4](https://github.com/hirosystems/stacks-wallet-web/commit/2bc01d44668f7e9190570617ae8e65d6315d6787)), closes [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877)
* remove gaia call when unlocking wallet ([e6c3947](https://github.com/hirosystems/stacks-wallet-web/commit/e6c39470b1b39af0e18104c65b33de5929370e41)), closes [#1877](https://github.com/hirosystems/stacks-wallet-web/issues/1877)
* render whole account list when fewer than 10 accounts ([8464b74](https://github.com/hirosystems/stacks-wallet-web/commit/8464b7497f48552128584aaf4791478ab17257a7))
* show fiat onramp buy button only on mainnet ([c02f138](https://github.com/hirosystems/stacks-wallet-web/commit/c02f1382186af0e7ae2da9b5d40216c73d9d14fa)), closes [#2049](https://github.com/hirosystems/stacks-wallet-web/issues/2049)
* switch account failing test ([982e3e9](https://github.com/hirosystems/stacks-wallet-web/commit/982e3e96649e44d62b21dc2623cb6f06bf67cdf8))
* use saved hasSetPassword from storage ([5e8869d](https://github.com/hirosystems/stacks-wallet-web/commit/5e8869dff511ea2083b35b12b169c840efd5a7fc))


### Features

* add metrics for fee estimation ([00690f2](https://github.com/hirosystems/stacks-wallet-web/commit/00690f2c981446a5989a5acae34581c57ac8d252)), closes [#2041](https://github.com/hirosystems/stacks-wallet-web/issues/2041)
* add unlock waiting message ([03ffdf7](https://github.com/hirosystems/stacks-wallet-web/commit/03ffdf7cb3ed33b2789e72254b9cf01be5f803b7)), closes [#2062](https://github.com/hirosystems/stacks-wallet-web/issues/2062)

## [2.23.2](https://github.com/hirosystems/stacks-wallet-web/compare/v2.23.1...v2.23.2) (2021-12-08)


### Bug Fixes

* change transak copy for US citizens ([3353fa3](https://github.com/hirosystems/stacks-wallet-web/commit/3353fa331afd0babd2c37999175fa8f2db34a9c8)), closes [#2051](https://github.com/hirosystems/stacks-wallet-web/issues/2051)

## [2.23.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.23.0...v2.23.1) (2021-12-07)


### Bug Fixes

* remove a fullstop from the password placeholder ([e6f865a](https://github.com/hirosystems/stacks-wallet-web/commit/e6f865a6e377208aab7f930a7eb09129b6c70368))

# [2.23.0](https://github.com/hirosystems/stacks-wallet-web/compare/v2.22.0...v2.23.0) (2021-12-07)


### Bug Fixes

* don't warn of no writekey in dev by default ([d6f4d2b](https://github.com/hirosystems/stacks-wallet-web/commit/d6f4d2b5dc171c06b0555afa8475539cdb7582eb))
* lint issue on transak-helper ([46a95e5](https://github.com/hirosystems/stacks-wallet-web/commit/46a95e5f6c0a9edbd8336e3e326f00b17d2c6af5))
* send form white screen ([a8c7e74](https://github.com/hirosystems/stacks-wallet-web/commit/a8c7e74d672f90c71378eb63a1c1a454661df568))
* use transak production env for preview build ([3e9e432](https://github.com/hirosystems/stacks-wallet-web/commit/3e9e43223dce6c7bb4d0fd915abb80617f8c6ecc))


### Features

* add fiat onramp UI + providers ([14f6cba](https://github.com/hirosystems/stacks-wallet-web/commit/14f6cbab8eaed16f5eb93871ec0dbb84a2c08daa))

# [2.22.0](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.5...v2.22.0) (2021-11-29)


### Features

* inconsequential comment change to trigger release, part 3 ([f766b5d](https://github.com/hirosystems/stacks-wallet-web/commit/f766b5d5a6c360a21b6a34c10de95571937e8b01))

## [2.21.5](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.4...v2.21.5) (2021-11-29)


### Bug Fixes

* inconsequential comment change to trigger release, part 2 ([fc4d922](https://github.com/hirosystems/stacks-wallet-web/commit/fc4d9229e86dd08772973197f65c170a70879192))

## [2.21.4](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.3...v2.21.4) (2021-11-29)


### Bug Fixes

* empty commit, trigger new release ([99578bd](https://github.com/hirosystems/stacks-wallet-web/commit/99578bdd1eabbba16c667cf477c6c5de0ce28e1b))
* inconsequential comment change to trigger release ([a3c6b2b](https://github.com/hirosystems/stacks-wallet-web/commit/a3c6b2ba12ed562354d31342580a10f83bc970be))

## [2.21.3](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.2...v2.21.3) (2021-11-29)


### Bug Fixes

* send form white screen ([a8c7e74](https://github.com/hirosystems/stacks-wallet-web/commit/a8c7e74d672f90c71378eb63a1c1a454661df568))
* add max values for fee estimations ([06bda04](https://github.com/hirosystems/stacks-wallet-web/commit/06bda04414cddae596b5d17612ba433e21f1d461))
* update max fee estimation ([98f2186](https://github.com/hirosystems/stacks-wallet-web/commit/98f21861aac0ca98982912638e48fa286a62f968))

## [2.21.2](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.1...v2.21.2) (2021-11-26)


### Bug Fixes

* fallback to default estimations ([c3044ff](https://github.com/hirosystems/stacks-wallet-web/commit/c3044ffcbd3628a1d90f79d26e4b985b1d4a31ad))
* fees query network ([ccb3182](https://github.com/hirosystems/stacks-wallet-web/commit/ccb3182774fdd7a30763629502406d407d629547))
* logger import ([2ccae06](https://github.com/hirosystems/stacks-wallet-web/commit/2ccae06bf718ab8a814b6d03deedb4e0f1059455))
* remove fee form suspense ([e2f2e2c](https://github.com/hirosystems/stacks-wallet-web/commit/e2f2e2c76916d4dfed35b921bd2b2e375773b63d))

## [2.21.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.0...v2.21.1) (2021-11-24)

### Bug Fixes

- logger import ([828aa50](https://github.com/hirosystems/stacks-wallet-web/commit/828aa50f65a09e3980ea0e6db64a01c6b0c335a3))

# [2.21.0](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.3...v2.21.0) (2021-11-24)

### Bug Fixes

- close estimations on click outside ([45bec9a](https://github.com/hirosystems/stacks-wallet-web/commit/45bec9a90329e70b98c64b4490b6e52869bdd5fd))
- custom fee state after fallback ([6d2a02e](https://github.com/hirosystems/stacks-wallet-web/commit/6d2a02e32e45015f98b5cc9c1c0de6f8692c65ee))
- fee estimations fail default ([72b25cb](https://github.com/hirosystems/stacks-wallet-web/commit/72b25cbaafa863b76e486d7050d3f4c7224c9625))
- mempool txs query atom ([73f5b01](https://github.com/hirosystems/stacks-wallet-web/commit/73f5b016fb996015c67adb55f774754d52675a33))
- replace by fee cache bug, closes [#1975](https://github.com/hirosystems/stacks-wallet-web/issues/1975) ([a99a14e](https://github.com/hirosystems/stacks-wallet-web/commit/a99a14e7c49dc5f8171bf62588298807a62327c8))
- send max calc ([9e05290](https://github.com/hirosystems/stacks-wallet-web/commit/9e052909a098f60e4bbbd7b564fb90903e0dab6a))
- send max toast ([a66c62d](https://github.com/hirosystems/stacks-wallet-web/commit/a66c62dc8689a67c784b0b25ae710d8ab9e8422e))
- **types:** loose tx type results in stable release bugs ([3b17de0](https://github.com/hirosystems/stacks-wallet-web/commit/3b17de0a243f95f0acf82af733ee779d6f40efda))
- use react-query for mempool calls ([f45edff](https://github.com/hirosystems/stacks-wallet-web/commit/f45edff2ec777faf7d555ed8b0500441fbb1757e))

### Features

- add segment integration ([0999431](https://github.com/hirosystems/stacks-wallet-web/commit/0999431bf05bf03328b5a4c5e8d75c341a7f8539)), closes [#1748](https://github.com/hirosystems/stacks-wallet-web/issues/1748)
- use fee estimation endpoint ([78fd652](https://github.com/hirosystems/stacks-wallet-web/commit/78fd65269eb9d2a38670676cf82a09492f1f01a0))

# [2.21.0-dev.9](https://github.com/hirosystems/stacks-wallet-web/compare/v2.21.0-dev.8...v2.21.0-dev.9) (2021-11-24)

### Bug Fixes

- mempool txs query atom ([605e1e7](https://github.com/hirosystems/stacks-wallet-web/commit/605e1e74b2aaa11d5832737bdb09ff7f59404353))

## [2.20.3](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.2...v2.20.3) (2021-11-12)

### Bug Fixes

- mempool txs query atom ([605e1e7](https://github.com/hirosystems/stacks-wallet-web/commit/605e1e74b2aaa11d5832737bdb09ff7f59404353))

## [2.20.3-dev.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.2...v2.20.3-dev.1) (2021-11-11)

### Bug Fixes

- mempool txs query atom ([73f5b01](https://github.com/hirosystems/stacks-wallet-web/commit/73f5b016fb996015c67adb55f774754d52675a33))

## [2.20.2-dev.2](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.2-dev.1...v2.20.2-dev.2) (2021-11-11)

### Bug Fixes

- mempool txs query atom ([b707d87](https://github.com/hirosystems/stacks-wallet-web/commit/b707d87c490fb08c63cb14fa96b28c49ded0b8ff))

## [2.20.2](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1...v2.20.2) (2021-11-11)

### Bug Fixes

- sip010 token transfer not going through ([e9258ae](https://github.com/hirosystems/stacks-wallet-web/commit/e9258ae27769ed2328dc68fce4e5dd953b34c7d5)), closes [#1915](https://github.com/hirosystems/stacks-wallet-web/issues/1915)

## [2.20.2-dev.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1...v2.20.2-dev.1) (2021-11-11)

### Bug Fixes

- sip010 token transfer not going through ([7da7d51](https://github.com/hirosystems/stacks-wallet-web/commit/7da7d5149574c855f490d0ec162f0ca11704700e)), closes [#1915](https://github.com/hirosystems/stacks-wallet-web/issues/1915)

## [2.20.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.0...v2.20.1) (2021-11-10)

### Bug Fixes

- add preview release images, delete unused assets ([89a49fd](https://github.com/hirosystems/stacks-wallet-web/commit/89a49fd09e8d882383c41b29ca6859348dba86fc))
- clean hex value for deserializeCV ([377031d](https://github.com/hirosystems/stacks-wallet-web/commit/377031d003632116bf3fd639fcdc278bb06392b5))
- **csp:** chrome 96 regression breaks argon2 ([4492ed2](https://github.com/hirosystems/stacks-wallet-web/commit/4492ed229eb65ad39e0903ee131011cbc82bedfa))
- **csp:** external images broken ([91331d9](https://github.com/hirosystems/stacks-wallet-web/commit/91331d9133a31e36a66368ef61ca2b09e8532e5d))
- generate release with preview name ([0baaced](https://github.com/hirosystems/stacks-wallet-web/commit/0baaced4189e59419bfdc27f6ea7c054752aa195))
- local dev not injecting provider, closes [#1795](https://github.com/hirosystems/stacks-wallet-web/issues/1795) ([d95b413](https://github.com/hirosystems/stacks-wallet-web/commit/d95b413f38fc3a706a169aa70bbf8573a17284cd))
- manifest app version doesn't include -dev ([8660262](https://github.com/hirosystems/stacks-wallet-web/commit/8660262fe56e267df517efc31e4f249adc1feda5))
- qa build url ([eae4633](https://github.com/hirosystems/stacks-wallet-web/commit/eae4633d5f4a5124c46d5f97920e1f3853e56fb8))
- show stx transfers from contract call ([514cc61](https://github.com/hirosystems/stacks-wallet-web/commit/514cc617a9fcf1f5dae19ba31ebb231496587dec)), closes [#1713](https://github.com/hirosystems/stacks-wallet-web/issues/1713)
- tidy CI jobs, update readme ([1496af9](https://github.com/hirosystems/stacks-wallet-web/commit/1496af9c12f64113eb351ea2af57aa4765abd1c2))
- upload release as zip ([d244bfa](https://github.com/hirosystems/stacks-wallet-web/commit/d244bfaa65b00cafa0c8ad8b899cad5427b7e359))
- upload release assets ([efd278a](https://github.com/hirosystems/stacks-wallet-web/commit/efd278a972af847a83c3bbbfb552db1fba11a676))
- use semantic release ([7eba15a](https://github.com/hirosystems/stacks-wallet-web/commit/7eba15a7ae45273dea13fec6f01f9c745d166dfb))
- wallet dependence on gaia, closes [#1732](https://github.com/hirosystems/stacks-wallet-web/issues/1732) ([c5b86dd](https://github.com/hirosystems/stacks-wallet-web/commit/c5b86dd5bcd1b7c93fd6dd7a66a2d30803a2f0b7))

## [2.20.1-dev.12](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.11...v2.20.1-dev.12) (2021-11-10)

### Bug Fixes

- **csp:** chrome 96 regression breaks argon2 ([f5b064c](https://github.com/hirosystems/stacks-wallet-web/commit/f5b064cb2d2293d79292768b3e3a3391e543134e))

## [2.20.1-dev.11](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.10...v2.20.1-dev.11) (2021-11-09)

### Bug Fixes

- clean hex value for deserializeCV ([4d98347](https://github.com/hirosystems/stacks-wallet-web/commit/4d98347ba61b1a48dbf5950782d2e70b1650a17d))

## [2.20.1-dev.10](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.9...v2.20.1-dev.10) (2021-11-09)

### Bug Fixes

- show stx transfers from contract call ([9bd7d10](https://github.com/hirosystems/stacks-wallet-web/commit/9bd7d10f8b58f3735153f0b924a91742aeae1654)), closes [#1713](https://github.com/hirosystems/stacks-wallet-web/issues/1713)

## [2.20.1-dev.9](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.8...v2.20.1-dev.9) (2021-11-02)

### Bug Fixes

- qa build url ([cfa5abe](https://github.com/hirosystems/stacks-wallet-web/commit/cfa5abe1d6290dd0774be4a99bcbe68ad620cb10))

## [2.20.1-dev.8](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.7...v2.20.1-dev.8) (2021-10-30)

### Bug Fixes

- **csp:** external images broken ([29ca0f3](https://github.com/hirosystems/stacks-wallet-web/commit/29ca0f30eab3ccd78a4613fb59a57da2373c515f))

## [2.20.1-dev.7](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.6...v2.20.1-dev.7) (2021-10-29)

### Bug Fixes

- add preview release images, delete unused assets ([01c3121](https://github.com/hirosystems/stacks-wallet-web/commit/01c31218f3771e2434fc95a5b95ee20c68746632))

## [2.20.1-dev.6](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.5...v2.20.1-dev.6) (2021-10-29)

### Bug Fixes

- generate release with preview name ([bdaa8bf](https://github.com/hirosystems/stacks-wallet-web/commit/bdaa8bfde95d04bb7aa355be217a20b28389b139))

## [2.20.1-dev.5](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.4...v2.20.1-dev.5) (2021-10-29)

### Bug Fixes

- manifest app version doesn't include -dev ([83fd238](https://github.com/hirosystems/stacks-wallet-web/commit/83fd2389a4b387c19d047bf501abc015a46dd680))

## [2.20.1-dev.4](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.3...v2.20.1-dev.4) (2021-10-29)

### Bug Fixes

- tidy CI jobs, update readme ([3c55a11](https://github.com/hirosystems/stacks-wallet-web/commit/3c55a11b497e68ba210444c1b3faab55ea73f5e8))

## [2.20.1-dev.3](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.2...v2.20.1-dev.3) (2021-10-29)

### Bug Fixes

- upload release as zip ([0b9d471](https://github.com/hirosystems/stacks-wallet-web/commit/0b9d47157ab457870c7d848f4c2a3794d5749caf))

## [2.20.1-dev.2](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.1-dev.1...v2.20.1-dev.2) (2021-10-29)

### Bug Fixes

- upload release assets ([0fc66ea](https://github.com/hirosystems/stacks-wallet-web/commit/0fc66ea4dd7751a8d50fea0a2336af6dc029aac5))

## [2.20.1-dev.1](https://github.com/hirosystems/stacks-wallet-web/compare/v2.20.0...v2.20.1-dev.1) (2021-10-29)

### Bug Fixes

- local dev not injecting provider, closes [#1795](https://github.com/hirosystems/stacks-wallet-web/issues/1795) ([d95b413](https://github.com/hirosystems/stacks-wallet-web/commit/d95b413f38fc3a706a169aa70bbf8573a17284cd))
- use semantic release ([24b752c](https://github.com/hirosystems/stacks-wallet-web/commit/24b752c952bc2b1628cbedfbe163482964fd5f0c))
- wallet dependence on gaia, closes [#1732](https://github.com/hirosystems/stacks-wallet-web/issues/1732) ([c5b86dd](https://github.com/hirosystems/stacks-wallet-web/commit/c5b86dd5bcd1b7c93fd6dd7a66a2d30803a2f0b7))

# Changelog

## 2.20.0

### Minor Changes

- [#1720](https://github.com/blockstack/stacks-wallet-web/pull/1720) [`dad028e8d`](https://github.com/blockstack/stacks-wallet-web/commit/dad028e8d8a417dadfb75ad8b02e08712aa07595) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Add a new state that asks users for permission to record application diagnostics

## 2.19.4

### Patch Changes

- [#1804](https://github.com/blockstack/stacks-wallet-web/pull/1804) [`8cb4909d6`](https://github.com/blockstack/stacks-wallet-web/commit/8cb4909d635081bbe2270fec137754138cee9e59) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes passing in a custom fee not working for apps using the wallet.

* [#1785](https://github.com/blockstack/stacks-wallet-web/pull/1785) [`55684b197`](https://github.com/blockstack/stacks-wallet-web/commit/55684b197c3b196d8a1377a1c435d16010addea7) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes signing out from the locked transaction popup.

- [#1798](https://github.com/blockstack/stacks-wallet-web/pull/1798) [`0e4b9c7c5`](https://github.com/blockstack/stacks-wallet-web/commit/0e4b9c7c5ade4a86905f78557ff10559fce150a1) Thanks [@kyranjamie](https://github.com/kyranjamie)! - This fixes breaking changes caused by updating webpack-dev-server to pass security audit checks.

## 2.19.3

### Patch Changes

- [#1753](https://github.com/blockstack/stacks-wallet-web/pull/1753) [`6eab6659b`](https://github.com/blockstack/stacks-wallet-web/commit/6eab6659b5572d166610be656020268046d84f92) Thanks [@aulneau](https://github.com/aulneau)! - This update makes it so any drawer component (network select, account select, etc) will be a modal when used in larger screens, but a drawer when used in the extension view (smaller widths).

* [#1779](https://github.com/blockstack/stacks-wallet-web/pull/1779) [`b33e34834`](https://github.com/blockstack/stacks-wallet-web/commit/b33e348341bcc322b5e11cc0f3c95174c80596f9) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This adds rendering the stx post condition in the list of post conditions.

- [#1767](https://github.com/blockstack/stacks-wallet-web/pull/1767) [`15d2ba6cd`](https://github.com/blockstack/stacks-wallet-web/commit/15d2ba6cd02bf2a7f1121297dea9cf58ccca6860) Thanks [@beguene](https://github.com/beguene)! - Display Regtest instead of Testnet when the network is Regtest.

* [#1754](https://github.com/blockstack/stacks-wallet-web/pull/1754) [`d6493cdbc`](https://github.com/blockstack/stacks-wallet-web/commit/d6493cdbc0ecb45c36464c36d33f62d30b6014d2) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes how asset metadata displays in post conditions. It should display correctly now even if a user doesn't have that token in their account.

- [#1752](https://github.com/blockstack/stacks-wallet-web/pull/1752) [`91cf29e88`](https://github.com/blockstack/stacks-wallet-web/commit/91cf29e8811c46cc6ce382b42b9ed7acdc7a874b) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes the loading state for when the status of a network is not yet available.

* [#1780](https://github.com/blockstack/stacks-wallet-web/pull/1780) [`c90ed29f0`](https://github.com/blockstack/stacks-wallet-web/commit/c90ed29f0bf24e2d14d4eee4dee4f2cb59618bd5) Thanks [@beguene](https://github.com/beguene)! - This fixes the test-app post conditions that were causing contract call failures.

- [#1777](https://github.com/blockstack/stacks-wallet-web/pull/1777) [`589a96fdc`](https://github.com/blockstack/stacks-wallet-web/commit/589a96fdcab5e937b3678be2556af82bf6457e8a) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes filtering local transactions using the safely formatted hex txid.

## 2.19.2

### Patch Changes

- [#1762](https://github.com/blockstack/stacks-wallet-web/pull/1762) [`4f4b9637b`](https://github.com/blockstack/stacks-wallet-web/commit/4f4b9637ba4d477ce0545bba3b924fe45509eaed) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes deploying contracts with local transactions.

## 2.19.1

### Patch Changes

- [#1758](https://github.com/blockstack/stacks-wallet-web/pull/1758) [`3890723ae`](https://github.com/blockstack/stacks-wallet-web/commit/3890723ae2429cddb0c546017ccbbd3a15cdb7d9) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes bug where it auto-scrolls up

## 2.19.0

### Minor Changes

- [#1738](https://github.com/blockstack/stacks-wallet-web/pull/1738) [`b470c7a57`](https://github.com/blockstack/stacks-wallet-web/commit/b470c7a574b67e3dfc9547b03c13300222026ac5) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds messages sourced from the main branch of the repository

* [#1726](https://github.com/blockstack/stacks-wallet-web/pull/1726) [`9fe5b22df`](https://github.com/blockstack/stacks-wallet-web/commit/9fe5b22df156ca9d859d4147e86a87395536345c) Thanks [@aulneau](https://github.com/aulneau)! - This update improves the way in which the wallet persists user activity. When a user sends a transaction, the wallet will store a version of it locally. This improves the performance and feedback of the application.

### Patch Changes

- [#1737](https://github.com/blockstack/stacks-wallet-web/pull/1737) [`92aee034b`](https://github.com/blockstack/stacks-wallet-web/commit/92aee034b31c9a1a79fa2ff7ef1f9391e8acfae1) Thanks [@josecanhelp](https://github.com/josecanhelp)! - This change allows a wallet with zero STX balance to sign a sponsored transaction.

## 2.18.0

### Minor Changes

- [#1704](https://github.com/blockstack/stacks-wallet-web/pull/1704) [`81e039c97`](https://github.com/blockstack/stacks-wallet-web/commit/81e039c97479637c93652f1a615da69339fbae39) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Makes use of a WebWorker to prevent main thread from lagging during unlock operation

### Patch Changes

- [#1741](https://github.com/blockstack/stacks-wallet-web/pull/1741) [`2655b649c`](https://github.com/blockstack/stacks-wallet-web/commit/2655b649ceebb74bcdd57532757290dca2068579) Thanks [@kyranjamie](https://github.com/kyranjamie)! - This adds the sign out drawer to the lock screen so users can sign out.

* [#1708](https://github.com/blockstack/stacks-wallet-web/pull/1708) [`5aa6498a3`](https://github.com/blockstack/stacks-wallet-web/commit/5aa6498a3dd4d6c6675e82d368bb7082b282dbee) Thanks [@aulneau](https://github.com/aulneau)! - This update adds the global variable VERSION to all cache keys for any data that is persisted in local storage. This makes it so when the wallet updates, there isn't any leaking between versions and avoids using possibily outdated/stale data.

## 2.17.0

### Minor Changes

- [#1691](https://github.com/blockstack/stacks-wallet-web/pull/1691) [`4b685917b`](https://github.com/blockstack/stacks-wallet-web/commit/4b685917bf8e3a887e2d60593f87b4da4af60614) Thanks [@aulneau](https://github.com/aulneau)! - This update removes a lot of the code we implemented to determine if a fungible token asset can be transferred/conforms to [SIP-010](https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md), and in place we now rely on the new [token metadata endpoints](https://blockstack.github.io/stacks-blockchain-api/#tag/tokens) in the stacks-blockchain-api.

  **NOTICE: This update removes the ability to transfer certain fungible tokens that conformed to an older version of SIP-010 (with no memo).**

* [#1686](https://github.com/blockstack/stacks-wallet-web/pull/1686) [`88682a9b3`](https://github.com/blockstack/stacks-wallet-web/commit/88682a9b39c3690d71509b2a7c3357edce6f0315) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds a confirmation page before user is able to delete their wallet

### Patch Changes

- [#1530](https://github.com/blockstack/stacks-wallet-web/pull/1530) [`990bec70a`](https://github.com/blockstack/stacks-wallet-web/commit/990bec70aa797857d14f23f72accdb19f415fbd4) Thanks [@beguene](https://github.com/beguene)! - Use the api to get possible nonce and fallback to default nonce calculation if the api is not available.

* [#1617](https://github.com/blockstack/stacks-wallet-web/pull/1617) [`e38fafbe6`](https://github.com/blockstack/stacks-wallet-web/commit/e38fafbe6aeb2053889e9f43f117d6dca1236d4e) Thanks [@aulneau](https://github.com/aulneau)! - This update enables some additional persistence of query data, such as transactions and balances. This makes it so the wallet can be more performant when opening it.

- [#1669](https://github.com/blockstack/stacks-wallet-web/pull/1669) [`fa4b49721`](https://github.com/blockstack/stacks-wallet-web/commit/fa4b49721782eb61fd74c93d9bcce1364a311d15) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This relocates the 'Learn more' text link in the advanced settings drawer.

## 2.16.0

### Minor Changes

- [#1639](https://github.com/blockstack/stacks-wallet-web/pull/1639) [`c051ef56c`](https://github.com/blockstack/stacks-wallet-web/commit/c051ef56c53b72903837fd05691013ebc12b7b86) Thanks [@aulneau](https://github.com/aulneau)! - This update adds the ability for users to update the fee for a given transaction. Additionally, users can now update the fee for a pending transaction (replace by fee), to increase the miner incentives for that transaction.

## 2.15.2

### Patch Changes

- [#1625](https://github.com/blockstack/stacks-wallet-web/pull/1625) [`98fcd2548`](https://github.com/blockstack/stacks-wallet-web/commit/98fcd254851ee4846bcbc81fb1958d7e4411c26c) Thanks [@aulneau](https://github.com/aulneau)! - This update adds a warning for any contract call that is set to ALLOW mode -- if a user is signing a transaction with ALLOW mode set, any post conditions displayed will have no effect.

## 2.15.1

### Patch Changes

- [#1619](https://github.com/blockstack/stacks-wallet-web/pull/1619) [`df283d3cc`](https://github.com/blockstack/stacks-wallet-web/commit/df283d3ccb3e164c1eb3168181c12ab8e5b36203) Thanks [@aulneau](https://github.com/aulneau)! - Fixes bug where balance contained a comma, thus preventing it from being converted to a BigNumber

* [#1614](https://github.com/blockstack/stacks-wallet-web/pull/1614) [`7a0cd03a2`](https://github.com/blockstack/stacks-wallet-web/commit/7a0cd03a253ab1cd4f750ec663da8829306c0fd2) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a rare bug where if an address has received more transactions than we fetch for, it would assume it was a fresh account and return the incorrect nonce.

## 2.15.0

### Minor Changes

- [#1572](https://github.com/blockstack/stacks-wallet-web/pull/1572) [`46a90aab`](https://github.com/blockstack/stacks-wallet-web/commit/46a90aabd16dc2b7b403d692c5dfd73665de9401) Thanks [@aulneau](https://github.com/aulneau)! - This update improves data fetching in the wallet in a few ways: removes duplicate fetches, migrates legacy fetching methods to use the api client from `@stacks/blockchain-api-client`, and fixes a few network related bugs. Additionally, work has started on improving how quickly the UI is available, working towards progressive upgrading of components as new data is available. Lastly, the foundation has been laid to enable use of persistence of certain data, enabling faster boot times.

### Patch Changes

- [#1598](https://github.com/blockstack/stacks-wallet-web/pull/1598) [`7d8bbbf0`](https://github.com/blockstack/stacks-wallet-web/commit/7d8bbbf067c49fb3349775a519db043b51472fe0) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes an error in the wallet by initializing the merged asset balance as a BigNumber.

* [#1599](https://github.com/blockstack/stacks-wallet-web/pull/1599) [`ee45a99d`](https://github.com/blockstack/stacks-wallet-web/commit/ee45a99dcfe64128448ad71121b140da6e2333a4) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes bug where users are unable to set the extension to the localhost url, owing to stacks.js changes

## 2.14.0

### Minor Changes

- [#1430](https://github.com/blockstack/stacks-wallet-web/pull/1430) [`371c9545`](https://github.com/blockstack/stacks-wallet-web/commit/371c95450519c9d51d7875140e40a6bd5f1d5907) Thanks [@beguene](https://github.com/beguene)! - Add microblocks support. Show both balances, anchored and unanchored, with the anchored one as primary balance. Add an indicator to signal microblock in the asset icon.

### Patch Changes

- [#1578](https://github.com/blockstack/stacks-wallet-web/pull/1578) [`aeb48279`](https://github.com/blockstack/stacks-wallet-web/commit/aeb4827919923bc5205d35bb9723f45db5b8fadf) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates the STX token icon in all places to match current designs.

* [#1573](https://github.com/blockstack/stacks-wallet-web/pull/1573) [`40f49ace`](https://github.com/blockstack/stacks-wallet-web/commit/40f49ace0d8fe77f6c1ee5722269be1cbfed3ce6) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes the placement of the tooltip when copying the user address in the wallet header.

- [#1564](https://github.com/blockstack/stacks-wallet-web/pull/1564) [`eca0ae6f`](https://github.com/blockstack/stacks-wallet-web/commit/eca0ae6f5bbcc935ba3e40c28680b358dd096ded) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates the network badge by removing 'mode' from the label. It now reads 'Testnet'.

## 2.13.0

### Minor Changes

- [#1540](https://github.com/blockstack/stacks-wallet-web/pull/1540) [`92f2cd26`](https://github.com/blockstack/stacks-wallet-web/commit/92f2cd26d946e0dcd066645c85140ff7aa022255) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds a context menu that opens the wallet in full page mode

### Patch Changes

- [#1561](https://github.com/blockstack/stacks-wallet-web/pull/1561) [`5947b000`](https://github.com/blockstack/stacks-wallet-web/commit/5947b000e22040220148262256cd65d97b263aef) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a bug where the overflow for the choose account screen was incorrectly set, thus preventing users from scrolling down to accounts that were off screen.

## 2.12.5

### Patch Changes

- [#1521](https://github.com/blockstack/stacks-wallet-web/pull/1521) [`77a33488`](https://github.com/blockstack/stacks-wallet-web/commit/77a334883bcb4c191ca3757aa40930f994ac0d89) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes inconsistent balances shown in the send form when a user has locked STX. It also fixes an inaccurate validation error shown when sending max STX.

* [#1512](https://github.com/blockstack/stacks-wallet-web/pull/1512) [`b7952eae`](https://github.com/blockstack/stacks-wallet-web/commit/b7952eaeab8b51dc8cb1934485622588742e2265) Thanks [@beguene](https://github.com/beguene)! - Fix font-weight issue in activity list.

- [#1455](https://github.com/blockstack/stacks-wallet-web/pull/1455) [`b882838e`](https://github.com/blockstack/stacks-wallet-web/commit/b882838e2bd8995fe4fc2fbbe06e424640019dea) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates the wallet name in all places to Hiro Wallet.

* [#1522](https://github.com/blockstack/stacks-wallet-web/pull/1522) [`cc6741bb`](https://github.com/blockstack/stacks-wallet-web/commit/cc6741bbdbef3a6291fcd027adcac60a10513e9b) Thanks [@aulneau](https://github.com/aulneau)! - This update refactors the way we implement the helper library `@stacks/blockchain-api-client`.

## 2.12.4

### Patch Changes

- [#1491](https://github.com/blockstack/stacks-wallet-web/pull/1491) [`52ee7587`](https://github.com/blockstack/stacks-wallet-web/commit/52ee758737925bef3458953cd0f6e37410218945) Thanks [@beguene](https://github.com/beguene)! - Change wording of the select asset dropdown.

* [#1494](https://github.com/blockstack/stacks-wallet-web/pull/1494) [`12821cd0`](https://github.com/blockstack/stacks-wallet-web/commit/12821cd06f0eb591b71aaa1836c3c5c0fd453cc4) Thanks [@aulneau](https://github.com/aulneau)! - This fixes an issue where a promise was caught when it should not have been.

## 2.12.3

### Patch Changes

- [#1487](https://github.com/blockstack/stacks-wallet-web/pull/1487) [`f00fa93f`](https://github.com/blockstack/stacks-wallet-web/commit/f00fa93f6ce7bc04b7436af45bfc4cc2e7042d52) Thanks [@beguene](https://github.com/beguene)! - Fix button border-radius to be consistent. Set it to 10px.

* [#1481](https://github.com/blockstack/stacks-wallet-web/pull/1481) [`211990f5`](https://github.com/blockstack/stacks-wallet-web/commit/211990f56b89a047e6485fee95bc4deb170b9eed) Thanks [@beguene](https://github.com/beguene)! - Some addresses were displayed with 6 or 4 char on both side of the ellipsis. This makes it consistent with 4 char.

- [#1456](https://github.com/blockstack/stacks-wallet-web/pull/1456) [`fa37093c`](https://github.com/blockstack/stacks-wallet-web/commit/fa37093c987af77e78dca2a49042f8a9e2e1aa30) Thanks [@beguene](https://github.com/beguene)! - Some text are displayed with font-feature ss01 on, some off. This removes all those font-features to keep the font display consistent across pages.

* [#1468](https://github.com/blockstack/stacks-wallet-web/pull/1468) [`a8abb466`](https://github.com/blockstack/stacks-wallet-web/commit/a8abb466d73bb12488d55d8eb89e0135a8b2c4bd) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a bug where the principal contained in a postcondition would be incorrectly changed when it was a contract principal.

- [#1467](https://github.com/blockstack/stacks-wallet-web/pull/1467) [`0532be11`](https://github.com/blockstack/stacks-wallet-web/commit/0532be1109aa8e0a99162bb6d109dae30fb69495) Thanks [@aulneau](https://github.com/aulneau)! - This adds validation and error messaging for when a contract call has been initiated with an invalid stacks address passed for the contract address

* [#1489](https://github.com/blockstack/stacks-wallet-web/pull/1489) [`7110398a`](https://github.com/blockstack/stacks-wallet-web/commit/7110398a270116c0872ca74f939b6b57bff7a8be) Thanks [@aulneau](https://github.com/aulneau)! - When selecting an account to authenticate an application, you can now see the balances for each account.

- [#1485](https://github.com/blockstack/stacks-wallet-web/pull/1485) [`662bb4c8`](https://github.com/blockstack/stacks-wallet-web/commit/662bb4c88a532408b99ac7d58d101ba828b6ba42) Thanks [@beguene](https://github.com/beguene)! - Make all our Open Sauce titles consistent with their font-weight. Set it to medium

* [#1448](https://github.com/blockstack/stacks-wallet-web/pull/1448) [`45e7d207`](https://github.com/blockstack/stacks-wallet-web/commit/45e7d20752d75f459c21a898032da73f9daeff98) Thanks [@aulneau](https://github.com/aulneau)! - This update attempts to fix when sometimes network requests fail due to a CORS related issues. Additionally, this fixes a runtime react key warning.

## 2.12.2

### Patch Changes

- [#1445](https://github.com/blockstack/stacks-wallet-web/pull/1445) [`e3b6062f`](https://github.com/blockstack/stacks-wallet-web/commit/e3b6062f7dbaec369486cd83a49751e6aa63ca4f) Thanks [@aulneau](https://github.com/aulneau)! - This change removes our dependency on @tabler/icons and uses `react-icons/fi` for all our icon needs, which matches our figma designs. Additionally, this reduces our minified package from over 4mb to under 3.5mb

## 2.12.1

### Patch Changes

- [#1442](https://github.com/blockstack/stacks-wallet-web/pull/1442) [`1ec4c001`](https://github.com/blockstack/stacks-wallet-web/commit/1ec4c0014b3e0eb70dbde8499240626ef418c445) Thanks [@aulneau](https://github.com/aulneau)! - This fixes an issue with our publishing scripts

## 2.12.0

### Minor Changes

- [#1420](https://github.com/blockstack/stacks-wallet-web/pull/1420) [`0097c7bb`](https://github.com/blockstack/stacks-wallet-web/commit/0097c7bbd31272c0ca9a7d3460dfec363c602a99) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes a visual bug that caused the network drawer to persist longer than expected, and adds in a global app error boundary to capture run time errors and provide a way for users to report issues.

* [#1326](https://github.com/blockstack/stacks-wallet-web/pull/1326) [`f1382d1b`](https://github.com/blockstack/stacks-wallet-web/commit/f1382d1b5f849a19ebe8d2b24ecfce6433de187d) Thanks [@aulneau](https://github.com/aulneau)! - This update replaces our use of recoil for state management to jotai. This gives us tighter integrations with tools such as react-query and rxjs.

### Patch Changes

- [#1301](https://github.com/blockstack/stacks-wallet-web/pull/1301) [`9c24f96e`](https://github.com/blockstack/stacks-wallet-web/commit/9c24f96ef7c3fb6b1dc175ceac7fc9f1f387b9b7) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds [dependency-cruiser](https://github.com/sverweij/dependency-cruiser), a tool which can both visualize and validate import dependencies in the Stacks Wallet. This PR adds a single rule stating that the `src/components` folder cannot import from `src/pages`

* [#1408](https://github.com/blockstack/stacks-wallet-web/pull/1408) [`dcca229f`](https://github.com/blockstack/stacks-wallet-web/commit/dcca229f9efe52136a3b6fde878d901d502cf4e9) Thanks [@aulneau](https://github.com/aulneau)! - This fixes the logic used to allow or disallow the usage of decimals in the send field. Previously SIP 10 compliant tokens that defined a value of "0" would pass the condition, thus allowing users to incorrectly try to send a decimal value of a token which uses no decimal places.

- [#1437](https://github.com/blockstack/stacks-wallet-web/pull/1437) [`df71881e`](https://github.com/blockstack/stacks-wallet-web/commit/df71881e8b0d28e2b5f31e00f2967cb3fa6950b4) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a bug where if a user switched accounts while on a page like the receive or view secret key, and navigated home, their balances would show stale data related to the previous account they were on.

* [#1386](https://github.com/blockstack/stacks-wallet-web/pull/1386) [`cf687aa7`](https://github.com/blockstack/stacks-wallet-web/commit/cf687aa74dca474c560d088cdde1751da78f5672) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This sets up the ability to perform integration tests in full page rather than in the extension popup for transactions.

- [#1294](https://github.com/blockstack/stacks-wallet-web/pull/1294) [`d40af091`](https://github.com/blockstack/stacks-wallet-web/commit/d40af091dc872ed7f21626d0c0738bea86984065) Thanks [@aulneau](https://github.com/aulneau)! - This update adds the current version number next to the logo for better debugging and information display.

* [#1333](https://github.com/blockstack/stacks-wallet-web/pull/1333) [`b6c9a5b8`](https://github.com/blockstack/stacks-wallet-web/commit/b6c9a5b808f4306c2bf6c9cd835070db93e012ca) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This updates connect version packages to capture changes to the intro modal in the test-app.

- [#1222](https://github.com/blockstack/stacks-wallet-web/pull/1222) [`08fe3e99`](https://github.com/blockstack/stacks-wallet-web/commit/08fe3e996428f23e7ede969d9ab03004ed0be6d0) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Removes unused old code once used in the authenticator

* [#1365](https://github.com/blockstack/stacks-wallet-web/pull/1365) [`8bc31589`](https://github.com/blockstack/stacks-wallet-web/commit/8bc31589e5b696b5b2ec6020313f4b8318729ecb) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This adds integration tests for the wallet settings menu.

- [#1431](https://github.com/blockstack/stacks-wallet-web/pull/1431) [`07b79809`](https://github.com/blockstack/stacks-wallet-web/commit/07b79809ec1115d5c5655e726aaecad416e99951) Thanks [@aulneau](https://github.com/aulneau)! - This update does a minor refactor to how we were fetching BNS names for a given address, and improves the performance of the application by removing the use of the jotai util `waitForAll` from the names atom.

* [#1434](https://github.com/blockstack/stacks-wallet-web/pull/1434) [`ff55f99c`](https://github.com/blockstack/stacks-wallet-web/commit/ff55f99c74e4904d7cf8795e466fe8e602dc3d5d) Thanks [@aulneau](https://github.com/aulneau)! - This update adds better error handling for when a transaction is failed to broadcast. Sometimes the endpoint returns a string as an error message, and previously that was accepted because there was no validation happening on the string. The string is now validated to be a correct txid, and if it fails, the UI will display the correct error message.

- [#1285](https://github.com/blockstack/stacks-wallet-web/pull/1285) [`859d9a64`](https://github.com/blockstack/stacks-wallet-web/commit/859d9a64260be58a096a95b2e685b3658a9a9caf) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes issue where the fee wasn't subtracted from the maximum amount you can send, as well as using the principal's available balance, rather than total.

* [#1404](https://github.com/blockstack/stacks-wallet-web/pull/1404) [`af763d56`](https://github.com/blockstack/stacks-wallet-web/commit/af763d5655948a414ccf7078b835de75061565d9) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds validation to prevent a user from being able to send more than their SIP-10 balance. Fixes #1400

- [#1433](https://github.com/blockstack/stacks-wallet-web/pull/1433) [`a895107f`](https://github.com/blockstack/stacks-wallet-web/commit/a895107f3da2a9a3eed543c29f63575b74be5f7c) Thanks [@aulneau](https://github.com/aulneau)! - This update enables quicker and more responsive refreshing of an accounts remote data

## 2.11.1

### Patch Changes

- [#1308](https://github.com/blockstack/stacks-wallet-web/pull/1308) [`4eeec781`](https://github.com/blockstack/stacks-wallet-web/commit/4eeec7813cbce1ec64919157552484a7c4cb59ed) Thanks [@aulneau](https://github.com/aulneau)! - This updates fixes a display bug that rounded STX values incorrectly. This bug had no effect on values used in transactions, only with the display of the amounts.

## 2.11.0

### Minor Changes

- [#1221](https://github.com/blockstack/stacks-wallet-web/pull/1221) [`b438b324`](https://github.com/blockstack/stacks-wallet-web/commit/b438b324d10dd34d1b22474983f7f62b9d9a3df3) Thanks [@aulneau](https://github.com/aulneau)! - This update refactors much of the architecture of the internal state of the extension and attempts to reduce much of the tech debt we have accumulated.

* [#1293](https://github.com/blockstack/stacks-wallet-web/pull/1293) [`ce60d212`](https://github.com/blockstack/stacks-wallet-web/commit/ce60d212b3f9c0f8e24bac3aa8b73f21a15d8d97) Thanks [@aulneau](https://github.com/aulneau)! - This update improves the error handling we have around unauthorized transactions and expired requests.

- [#1268](https://github.com/blockstack/stacks-wallet-web/pull/1268) [`b2ecacf9`](https://github.com/blockstack/stacks-wallet-web/commit/b2ecacf975875fadeddaa2c195667456c2a2b5e3) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Changes transaction activity screen to order transactions by date, rather than in a single list

### Patch Changes

- [#1292](https://github.com/blockstack/stacks-wallet-web/pull/1292) [`d93a6eac`](https://github.com/blockstack/stacks-wallet-web/commit/d93a6eac2ca0610c5a6fc013895090c313695c48) Thanks [@SergeyVolynkin](https://github.com/SergeyVolynkin)! - This update fixes a regression where the set-password page became mis-aligned.

* [#1299](https://github.com/blockstack/stacks-wallet-web/pull/1299) [`99434b6c`](https://github.com/blockstack/stacks-wallet-web/commit/99434b6c91e49023b3b48386a028f0be6a80ff61) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Refactor of our component organization, making efforts to structure by feature, and giving clearer responsibilities to each top level directory

- [#1269](https://github.com/blockstack/stacks-wallet-web/pull/1269) [`6777a57a`](https://github.com/blockstack/stacks-wallet-web/commit/6777a57a6a474ce204410d349d6bccfc1b5e1ec8) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes issue where pending transactions aren't always shown

* [#1267](https://github.com/blockstack/stacks-wallet-web/pull/1267) [`117abb0c`](https://github.com/blockstack/stacks-wallet-web/commit/117abb0c2a584ee2460603e517961a9bfe77f92e) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes border radius

- [#1291](https://github.com/blockstack/stacks-wallet-web/pull/1291) [`342a1144`](https://github.com/blockstack/stacks-wallet-web/commit/342a11445e409d3d8e8316d19e5da8c3d45bb896) Thanks [@kyranjamie](https://github.com/kyranjamie)! - A handful of UI-related errors were being thrown, this PR fixes them, as well as addressing unknown prop issues with the tooltip component

## 2.10.0

### Minor Changes

- [#1208](https://github.com/blockstack/stacks-wallet-web/pull/1208) [`b76efa57`](https://github.com/blockstack/stacks-wallet-web/commit/b76efa5793ab64a0c7a679c8441ac2e3a6bea0a9) Thanks [@aulneau](https://github.com/aulneau)! - ### SIP 010 support

  The main goal behind this PR was to support tokens that conform to the [SIP 010 Fungible token standard](https://github.com/stacksgov/sips/pull/5). Changes to the
  extension to enable this touched many areas, but mostly had to do with how we construct the state for each token and
  how we are displaying it. I've designed things in a way that we can still display older tokens or other FTs that do not conform
  by using the code we had from before as a fallback when there aren't decimals/symbol/name methods available.

  _High level overview of changes:_

  - dynamically fetch and cache meta data for a given token
  - display and format balances with correct decimal offset
  - display ticker/name as defined in contract
  - allow only tokens that have a correct transfer method to be sent via the extension
  - correct decimal placeholder in amount input field
  - better fallback/loading UI for FTs
  - progressive fallback for tokens that don't conform
  - improved form validation based on meta data
  - automatically switch to "activity" tab on successful transfer
  - other misc improvements

### Patch Changes

- [#1233](https://github.com/blockstack/stacks-wallet-web/pull/1233) [`09dddb5a`](https://github.com/blockstack/stacks-wallet-web/commit/09dddb5a4d034e7d42a854e010fe600b638c4e9e) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Adds code coverage and deploys to Github Pages https://blockstack.github.io/stacks-wallet-web/

## 2.9.0

### Minor Changes

- [#1175](https://github.com/blockstack/stacks-wallet-web/pull/1175) [`09c9b857`](https://github.com/blockstack/stacks-wallet-web/commit/09c9b857bffab754381703df1314b19fc7fb9ca6) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This adds firing an event when a user cancels an auth or transaction popup which triggers calling an onCancel callback function.

### Patch Changes

- [#1214](https://github.com/blockstack/stacks-wallet-web/pull/1214) [`71524bfc`](https://github.com/blockstack/stacks-wallet-web/commit/71524bfcb1e22792f9429d3fbe11238254ee7da0) Thanks [@kyranjamie](https://github.com/kyranjamie)! - Fixes #1204, where a rerender issues causes users in the onboarding flow to enter a prohibative glitch. Credit to community member @whoabuddy for reporting

## 2.8.0

### Minor Changes

- [#1193](https://github.com/blockstack/stacks-wallet-web/pull/1193) [`0e3619ea`](https://github.com/blockstack/stacks-wallet-web/commit/0e3619eadfbed22c5a7668c0518cf0c5928ca085) Thanks [@aulneau](https://github.com/aulneau)! - This update refactors and improve much of the UI and functionality of the transaction signing popup. Fixes these issues: #1172 #1165 #1146 #1115 #1147.

### Patch Changes

- [#1194](https://github.com/blockstack/stacks-wallet-web/pull/1194) [`c331563a`](https://github.com/blockstack/stacks-wallet-web/commit/c331563aefe2a37d7161a7998e5ed19190483db1) Thanks [@aulneau](https://github.com/aulneau)! - This update adds initial support for fetching and dispaying names associated with a given account stx address.

* [#1200](https://github.com/blockstack/stacks-wallet-web/pull/1200) [`5d863cb8`](https://github.com/blockstack/stacks-wallet-web/commit/5d863cb8a21bf85ddef0a267a31ddbe184d65c42) Thanks [@aulneau](https://github.com/aulneau)! - This update removes the `BlockstackProvider` that the extension would inejct into apps. This is to allow apps that are still using legacy auth (`app.blockstack.org`) to work without needing to update to the extension. Other apps should be on the latest versions of connect that no longer use `BlockstackProvider`, but instead use `StacksProvider`.

- [#1178](https://github.com/blockstack/stacks-wallet-web/pull/1178) [`3c26a6b8`](https://github.com/blockstack/stacks-wallet-web/commit/3c26a6b88b3095b20444cccd8efbebf93f2098d4) Thanks [@aulneau](https://github.com/aulneau)! - This fixes a bug with the positioning of the popup to fallback to the default window object if the chrome extension api window is not available.

## 2.7.1

### Patch Changes

- [#1173](https://github.com/blockstack/stacks-wallet-web/pull/1173) [`c6d18b45`](https://github.com/blockstack/stacks-wallet-web/commit/c6d18b4507eab3420ce29946c6bad15a11769e41) Thanks [@aulneau](https://github.com/aulneau)! - This removes any git commands and instead relies on default env vars provided by github actions. If they don't exist, they aren't used.

## 2.7.0

### Minor Changes

- [#1168](https://github.com/blockstack/stacks-wallet-web/pull/1168) [`7ac4c8fe`](https://github.com/blockstack/stacks-wallet-web/commit/7ac4c8fe66d47fbad58983f240299713f808c900) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes the positioning of the popup in relation to the primary window that fired the action

### Patch Changes

- [#1166](https://github.com/blockstack/stacks-wallet-web/pull/1166) [`5e124022`](https://github.com/blockstack/stacks-wallet-web/commit/5e124022a673e39a2c3191e8a2a23713337867e7) Thanks [@hstove](https://github.com/hstove)! - Removes the `COMMIT_SHA` global variable for production builds, to help with reproducible builds in any environment.

* [#1171](https://github.com/blockstack/stacks-wallet-web/pull/1171) [`0814c1c6`](https://github.com/blockstack/stacks-wallet-web/commit/0814c1c6bbca6c12ac8b95f8d8b9a45a4857a157) Thanks [@aulneau](https://github.com/aulneau)! - This update cleans up the webpack config and updates many of our dependencies, and fixes some build related CI tasks

## 2.6.0

### Minor Changes

- [#1149](https://github.com/blockstack/stacks-wallet-web/pull/1149) [`8984f137`](https://github.com/blockstack/stacks-wallet-web/commit/8984f137f4fb7932ce569376685dbce6db50eeeb) Thanks [@aulneau](https://github.com/aulneau)! - This update removed all use of redux in our application in favor of Recoil.

## 2.5.0

### Minor Changes

- [#1110](https://github.com/blockstack/stacks-wallet-web/pull/1110) [`9cb73658`](https://github.com/blockstack/stacks-wallet-web/commit/9cb736581044a6b64eab3158e1eb604be622dfb2) Thanks [@agraebe](https://github.com/agraebe)! - Adds support for sponsored transactions. When a developer includes the option `sponsored: true` in a transaction request, the transaction will not be broadcasted. Instead, the developer will need to get the raw transaction and sign it as a sponsor, and then broadcast it.

### Patch Changes

- [#1161](https://github.com/blockstack/stacks-wallet-web/pull/1161) [`e28302b1`](https://github.com/blockstack/stacks-wallet-web/commit/e28302b1fb61cedc9279e4fdb25e14868dcce913) Thanks [@aulneau](https://github.com/aulneau)! - Updates our dependencies on @stacks/connect and @stacks/connect-react to the latest version of each.

* [`3599f0d0`](https://github.com/blockstack/stacks-wallet-web/commit/3599f0d08db173467d30dcf87a3e50f136b59d52) Thanks [@aulneau](https://github.com/aulneau)! - Updates the dockerfile and github actions to improve out publishing workflow.

## 2.4.7

### Patch Changes

- [#1155](https://github.com/blockstack/stacks-wallet-web/pull/1155) [`fc2cc397`](https://github.com/blockstack/stacks-wallet-web/commit/fc2cc397eab04ff7428baea1f9d525d522cc00e7) Thanks [@aulneau](https://github.com/aulneau)! - Updates the github actions to break out the different jobs for each browser extension.

## 2.4.6

### Patch Changes

- [#1139](https://github.com/blockstack/stacks-wallet-web/pull/1139) [`f00d1c14`](https://github.com/blockstack/stacks-wallet-web/commit/f00d1c144073dfc6bf806a5e27fd3427d9682ce8) Thanks [@fbwoolf](https://github.com/fbwoolf)! - This fixes onboarding elements from being pushed to the bottom of the screen and popup by removing the automatic margin-top spacing.

* [`86039691`](https://github.com/blockstack/stacks-wallet-web/commit/86039691ad4930bc22cf7fb30f1883d7e8fb1808) Thanks [@aulneau](https://github.com/aulneau)! - Made some fixes to the webpack config to better support building the extension from the DockerFile.

## 2.4.5

### Patch Changes

- [#1134](https://github.com/blockstack/stacks-wallet-web/pull/1134) [`a2d00798`](https://github.com/blockstack/stacks-wallet-web/commit/a2d0079838c566344d4066cef3eb3f5ef6c2c262) Thanks [@aulneau](https://github.com/aulneau)! - **This fixes two issues:**

  There was a race condition such that sometimes when a transaction would be generated from the requestToken, the
  postCondition hook would run before the token was decoded, and as such always returned an empty postConditions array.

  There was a bug where if the account had a pending function call transaction, the nonce store would never be correct
  while the tx was still pending.

## 2.4.4

### Patch Changes

- [#1129](https://github.com/blockstack/stacks-wallet-web/pull/1129) [`1f5e24ab`](https://github.com/blockstack/stacks-wallet-web/commit/1f5e24ab18bad8d4c5d04845c38c39dff7d9eec3) Thanks [@markmhx](https://github.com/markmhx)! - This is a patch version bump to get aligned with a manual version bump that was submitted to extension builds.

* [#1137](https://github.com/blockstack/stacks-wallet-web/pull/1137) [`2f0202a1`](https://github.com/blockstack/stacks-wallet-web/commit/2f0202a1ff26c49cc181a713eddf31e103b30eeb) Thanks [@aulneau](https://github.com/aulneau)! - Adds the ability to submit an attachment alongside a transaction. It displays the attachment in a separate row if present. It prints it as ascii if the attachment is composed of only readable characters, otherwise it displays it as a hex string.

  <img width="554" alt="Screenshot 2021-05-05 at 9 40 16 PM" src="https://user-images.githubusercontent.com/5727806/117242873-f936c200-adea-11eb-83f3-8054b8029c58.png">

## 2.4.2

### Patch Changes

- [#1127](https://github.com/blockstack/stacks-wallet-web/pull/1127) [`4a629e04`](https://github.com/blockstack/stacks-wallet-web/commit/4a629e04317a2b1a568c11a9512af74049dc3bb2) Thanks [@hstove](https://github.com/hstove)! - Fixes the version of the Github Action used to upload the chrome extension

## 2.4.1

### Patch Changes

- [#1117](https://github.com/blockstack/stacks-wallet-web/pull/1117) [`3f3f8762`](https://github.com/blockstack/stacks-wallet-web/commit/3f3f8762e54feac79680730e99bec61518499f48) Thanks [@CharlieC3](https://github.com/CharlieC3)! - Updates our Github Actions to automatically publish production versions of the extension to the Chrome and Firefox stoes.

## 2.4.0

### Minor Changes

- [#1123](https://github.com/blockstack/stacks-wallet-web/pull/1123) [`9985a3cb`](https://github.com/blockstack/stacks-wallet-web/commit/9985a3cbfcb8ac8332cde20592e0991b661eec93) Thanks [@hstove](https://github.com/hstove)! - This removes the dependence on `redirect_uri` when generating an `appPrivateKey`. Instead, the wallet will use the URL of the tab that originated this request.

  It also includes two chores:

  - Remove the `terser-webpack-plugin` package, which is unused and was flagged in `yarn audit`
  - Bumps the version of node.js used in Github Actions from 12.16 to 12.22

## 2.3.1

### Patch Changes

- [#1107](https://github.com/blockstack/stacks-wallet-web/pull/1107) [`054cef76`](https://github.com/blockstack/stacks-wallet-web/commit/054cef763bc72cddfb3edcb8098afb86428d725a) Thanks [@aulneau](https://github.com/aulneau)! - This update removes all analytics calls we were using while the extension was in alpha.

* [#1092](https://github.com/blockstack/stacks-wallet-web/pull/1092) [`81ed8f4e`](https://github.com/blockstack/stacks-wallet-web/commit/81ed8f4e1d539842227bcb0b39b8664267b07ebc) Thanks [@hstove](https://github.com/hstove)! - Added extra verification to a transaction signing request. If an app tries to have you sign a transaction, but you haven't logged into that app with any of the accounts currently in your wallet, the transaction will be blocked. Fixes [#1076](https://github.com/blockstack/stacks-wallet-web/issues/1076) and [#1078](https://github.com/blockstack/stacks-wallet-web/issues/1078).

- [#1099](https://github.com/blockstack/stacks-wallet-web/pull/1099) [`3a387b8e`](https://github.com/blockstack/stacks-wallet-web/commit/3a387b8e0343276e88ba21da9aa79b71d7e3b7e3) Thanks [@hstove](https://github.com/hstove)! - Adds Argon2 password hashing. This greatly improves the security of user's encrypted secret keys, because Argon2 vastly increases the time it takes to test a password.

## 2.3.0

### Minor Changes

- [#1084](https://github.com/blockstack/stacks-wallet-web/pull/1084) [`ae5c723e`](https://github.com/blockstack/stacks-wallet-web/commit/ae5c723ee2eb7fe50b1fac16ee9e353753ce4ed7) Thanks [@aulneau](https://github.com/aulneau)! - This update fixes https://github.com/blockstack/stacks-wallet-web/issues/1067. It seems that there were some issues with the way that we were keeping `StacksTransactions` in recoil store. Recoil serializes everything that is in an atom/selector, and that serialization was breaking the transaction class.

  **Changes & Improvements**

  - validation has been improved on the send screen
  - send screen design has been improved slightly moving towards the figma designs
  - tickers are now displayed in the same way as the explorer
  - error handling now displays a toast if the transaction fails for some reason
  - assets now use the same kind of gradient as on the explorer
  - amount placeholder updates based on asset selected

  ![stx-transfer](https://user-images.githubusercontent.com/11803153/111552123-b1cb7800-874f-11eb-9000-3d4cd499fd7c.gif)

  ![stella-transfer](https://user-images.githubusercontent.com/11803153/111552120-b09a4b00-874f-11eb-8599-b4e2c828e795.gif)

* [#1095](https://github.com/blockstack/stacks-wallet-web/pull/1095) [`f2092eb8`](https://github.com/blockstack/stacks-wallet-web/commit/f2092eb8a8f644d8bb353c5da58bde0848e385cb) Thanks [@aulneau](https://github.com/aulneau)! - This update resolves these issues:

  - fixes [#969](https://github.com/blockstack/stacks-wallet-web/issues/969)
  - fixes [#1093](https://github.com/blockstack/stacks-wallet-web/issues/1093)

  **Changes**

  refactors the hook `use-setup-tx` ([before](https://github.com/blockstack/stacks-wallet-web/blob/35bb9d7a786ffe236322a7c96eb091cc3b94fa49/src/common/hooks/use-setup-tx.ts#L28), [after](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/use-setup-tx.ts)) into smaller, more manageable parts. From the original hook, there are a few new ones that each take care of their own responsibility:

  - [useAccountSwitchCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-account-switch-callback.ts)
  - [useDecodeRequestCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-decode-request-callback.ts)
  - [useNetworkSwitchCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-network-switch-callback.ts)
  - [usePostConditionsCallback](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/hooks/callbacks/use-post-conditions-callback.ts) (the one we care about for this PR)
    - [post-conditions-utils.ts](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/post-condition-utils.ts#L16)
    - [postConditionFromString](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/common/utils.ts#L168)

  **Other misc fixes**

  - There was a bug where if a `token_transfer` had post conditions defined (which it should not), it would not display them. [This fixes that bug.](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/components/transactions/post-conditions/list.tsx#L33)
  - Very briefly refactored the base component that displays the post conditions, [see component](https://github.com/blockstack/stacks-wallet-web/blob/cafd37b6737960df4542490eeb74dcbcc7f1881e/src/components/transactions/post-conditions/single.tsx#L88).

### Patch Changes

- [#1096](https://github.com/blockstack/stacks-wallet-web/pull/1096) [`55635960`](https://github.com/blockstack/stacks-wallet-web/commit/55635960c108a7e184dbd77a38dc8f58c3451f20) Thanks [@aulneau](https://github.com/aulneau)! - This update adds headers to all outbound requests to the `stacks-node-api` server with the product name and version.

* [#1082](https://github.com/blockstack/stacks-wallet-web/pull/1082) [`84553743`](https://github.com/blockstack/stacks-wallet-web/commit/8455374374ee5d88eaa1c28bf0032249cb3d832c) Thanks [@hstove](https://github.com/hstove)! - Updates our dependencies so that all versions are pinned. Also adds some checks to CI to make sure dependencies are pinned, and that `yarn audit` does not flag anything.

## 2.2.0

### Minor Changes

- [#1065](https://github.com/blockstack/stacks-wallet-web/pull/1065) [`ed019a48`](https://github.com/blockstack/stacks-wallet-web/commit/ed019a48cd15db336b95951f935403a8a119e494) Thanks [@aulneau](https://github.com/aulneau)! - Seed input fixes:

  - A user can now paste in any combination of string and numbers and hopefully get a correct phrase out.
  - The input for the seed phrase is now the perfect height to not scroll when someone enters in a 12 or 24 word phrase
  - Hitting return/enter will submit the form
  - Pasting in a magic recovery code will get validated. Previously we were just checking to see if it was 1 word.

  Password entry fixes:

  - Now debounced and does not blur the input when validation occurs, fixes #942
  - improved the error message to be less dynamic with a sane, static, suggestion, resolves #1031

* [#1068](https://github.com/blockstack/stacks-wallet-web/pull/1068) [`618d6fd7`](https://github.com/blockstack/stacks-wallet-web/commit/618d6fd7f6c40f3cd71d1ffb9ece5cf33cf22bcd) Thanks [@aulneau](https://github.com/aulneau)! - This PR updates elements that link to the explorer throughout the application, and starts the work on displaying transaction items in a more robust way (working towards our designs in figma).

  **Improvements**

  - Added a copy action to the receive button
  - The latest transaction item component has been updated to reflect the designs/states in figma
  - items now link to explorer, fixes #1018
  - fixes the drawers component such that the contents will scroll, and the header stays fixed
  - created an `AccountAvatar` component to display a generated gradient (based on the account, will persist between
    sessions)
  - general code health improvements
  - added [capsize](https://github.com/seek-oss/capsize) for better typography sizing

- [#1068](https://github.com/blockstack/stacks-wallet-web/pull/1068) [`126e2342`](https://github.com/blockstack/stacks-wallet-web/commit/126e2342d1468e92101974d8397c079efe2ff3a5) Thanks [@aulneau](https://github.com/aulneau)! - This bumps the version for our @stacks/ui-\* libs to their latest versions.

### Patch Changes

- [#1054](https://github.com/blockstack/stacks-wallet-web/pull/1054) [`099b75c4`](https://github.com/blockstack/stacks-wallet-web/commit/099b75c4d6dfb1db1bf207ee11aac912006feecb) Thanks [@hstove](https://github.com/hstove)! - Added an integration test for creating an account, locking the wallet, and unlocking

## 2.1.0

### Minor Changes

- [#1053](https://github.com/blockstack/stacks-wallet-web/pull/1053) [`155ea173`](https://github.com/blockstack/stacks-wallet-web/commit/155ea17359a4b4729b737f9c76e4d0a21bd166c9) Thanks [@hstove](https://github.com/hstove)! - Fixed a bug where clicking 'create an account' did not properly update the wallet state.

### Patch Changes

- [#1062](https://github.com/blockstack/stacks-wallet-web/pull/1062) [`94d9c12f`](https://github.com/blockstack/stacks-wallet-web/commit/94d9c12fb2bbed0f3d4a7005ed1cb2d6877d5506) Thanks [@aulneau](https://github.com/aulneau)! - This change updates the tooling we use for versioning the exension, moving away from `standard-version` to changesets!

* [#1064](https://github.com/blockstack/stacks-wallet-web/pull/1064) [`5cd3f565`](https://github.com/blockstack/stacks-wallet-web/commit/5cd3f5657a97f057703afc28f5c79eb824dfdecf) Thanks [@hstove](https://github.com/hstove)! - Fixes webpack's versioning logic to only use "canonical" version on exactly the 'main' branch. Previously it only checked if the branch included "main", so this logic would execute for a branch named like `XX-main`.

  This also updates the `@changesets/action` version to point to a specific commit, for security reasons.

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### 2.0.7 (2021-03-11)

### Bug Fixes

- remove demo app stick header ([3e7d19a](https://github.com/blockstack/ux/commit/3e7d19a6070f8a79555f668cf70c3be64bd0e43b))

### 2.0.6 (2021-03-11)

### Bug Fixes

- location of zip file after build-ext.sh ([0c003ba](https://github.com/blockstack/ux/commit/0c003baaf539dd9d0c53871c2e45c16a0c93de14))

### 2.0.5 (2021-03-11)

### Bug Fixes

- push new version and tags in version job ([98b9d46](https://github.com/blockstack/ux/commit/98b9d46b7413f48e82de3e465557b97c8b3f24bd))

## 2.0.3 (2021-03-08)

### Bug Fixes

- object-src replace ([5f54666](https://github.com/blockstack/ux/commit/5f54666f36a9b24362a09c5f03ebeeed28c12b33))

## 2.0.2 (2021-03-08)

### Bug Fixes

- deps ([86de1c1](https://github.com/blockstack/ux/commit/86de1c1a931ceaa141d4baf0c88612c180216f35))

## 2.0.1 (2021-03-08)

### Bug Fixes

- checkout main when publishing npm on main ([40446a0](https://github.com/blockstack/ux/commit/40446a0264ccdbcc4ddc556118517680e39b246f))

# [2.0.0](https://github.com/blockstack/ux/compare/@stacks/app@1.20.16...@stacks/app@2.0.0) (2021-03-05)

### Bug Fixes

- add ability to view secret key ([d7dca7d](https://github.com/blockstack/ux/commit/d7dca7d580f4dc294dab7b3b70ee40ae29a85b12))
- add in warning ([2906270](https://github.com/blockstack/ux/commit/2906270f5fb9ed952b5c9c58f5306d06c618a7ef))
- authentication error ([6abf504](https://github.com/blockstack/ux/commit/6abf504de6995e357c9c8fac7a291fe42e5edb1a))
- bad state after resetting recoil state ([1e89762](https://github.com/blockstack/ux/commit/1e8976275e9e961d8ffb327c114bbd267b44a5bb))
- broken extension locked state, fixes [#760](https://github.com/blockstack/ux/issues/760) ([c2bca4e](https://github.com/blockstack/ux/commit/c2bca4e0da406baaf9447a33bc82f89315de8be5))
- broken state after restoring extension ([7baf146](https://github.com/blockstack/ux/commit/7baf14648332dead4b4096881c4325ecff22b20c))
- bug when creating new account ([7bdeec6](https://github.com/blockstack/ux/commit/7bdeec6984f860fcf71ff18aa8a60c770f01ccbe))
- capitalize secret key, fixes [#768](https://github.com/blockstack/ux/issues/768) ([0706230](https://github.com/blockstack/ux/commit/0706230589202c4e4d7b452271f9340548004e7c))
- choose account page tweaks, fixes [#735](https://github.com/blockstack/ux/issues/735) ([6ae6889](https://github.com/blockstack/ux/commit/6ae688929363c6d0d8de4e75cd5d0db7cc0dbc06))
- close icon in drawers ([c4f1def](https://github.com/blockstack/ux/commit/c4f1defebe21ce32f8f6ff1d4b2de5c538db7959))
- conditional bug ([5f2ad4a](https://github.com/blockstack/ux/commit/5f2ad4aca1fb0f20ef9ae7a3c69d899654f5e1e6))
- correct network/chainID matching in tx signing, nonce error ([6190d5f](https://github.com/blockstack/ux/commit/6190d5fcfb62067d494718532215a1e043db8594))
- cursor on settings popover, fixes [#739](https://github.com/blockstack/ux/issues/739) ([8d58259](https://github.com/blockstack/ux/commit/8d58259d920267051ddac5809fdddfd05f215754))
- default font-size in extension ([320fea6](https://github.com/blockstack/ux/commit/320fea633eb67fb9c63afa501953c528496fbf64))
- font sizes on tx popup ([00bf475](https://github.com/blockstack/ux/commit/00bf475d13c8175755347b6ecf48dfc0cae8b586))
- header alignment ([7121f8a](https://github.com/blockstack/ux/commit/7121f8a3039017f1def47455bfed937c66f0f285))
- hide actions during onboarding, fixes [#738](https://github.com/blockstack/ux/issues/738) ([d1cede0](https://github.com/blockstack/ux/commit/d1cede0f2cc38a5d371455ea28d824d41adb682c))
- improve general sizing and layout, refactor some layout elements ([91f580c](https://github.com/blockstack/ux/commit/91f580c5b02fc88edd66d8b5f9e4f810fd86e39a))
- improvements from code review feedback ([2a1d243](https://github.com/blockstack/ux/commit/2a1d2433afffac19ae9728297995919fc991430c))
- improvements to reduce network load ([101b278](https://github.com/blockstack/ux/commit/101b278bbaa3419198edd91e225ab6017ca83b3a))
- index.html -> popup.html ([5e0b42f](https://github.com/blockstack/ux/commit/5e0b42fd01187855744dc63463f406b6aa6f4e84))
- input formatting on send page. fixes [#729](https://github.com/blockstack/ux/issues/729) ([c6ad05e](https://github.com/blockstack/ux/commit/c6ad05ec4b4591f641f908e473ec6a4418d42675))
- installation integration test ([8a2982b](https://github.com/blockstack/ux/commit/8a2982b41f769ea1faaa7b4266067f3ca4497ecf))
- integration tests ([c903de7](https://github.com/blockstack/ux/commit/c903de7d05b806d66fd23b5816d05be7f8ef9f3d))
- lint ([2197ea5](https://github.com/blockstack/ux/commit/2197ea58a7116b4ac4e67d26628c5780ae60182b))
- lint error ([75e60a4](https://github.com/blockstack/ux/commit/75e60a4f0f6ee4b6a87af0d905497ca227d95fe7))
- linting error ([35ca002](https://github.com/blockstack/ux/commit/35ca002b0b235962ee9823812862675eea2736f3))
- missing test selector for integration tests ([6691350](https://github.com/blockstack/ux/commit/6691350efc6dbba3fc8f49ab5fde1ff37e8c04ae))
- mock fee fetching in transaction-utils test ([135c3f4](https://github.com/blockstack/ux/commit/135c3f4f7047919223a13dcb3138eb67a4b47a8e))
- nasty bugs around password, redux state in ext, fixes [#770](https://github.com/blockstack/ux/issues/770) ([6fc81dd](https://github.com/blockstack/ux/commit/6fc81ddb978673c02288dd88e21324ce5c70c6c9))
- nonce issue ([225e1f3](https://github.com/blockstack/ux/commit/225e1f371aa8afa79faef2052d191608ab37f8c4))
- nonce issues causing pending tx's ([1e916f9](https://github.com/blockstack/ux/commit/1e916f9aa175e144ecce82ac4c031d32afd71447))
- nonce not set when zero ([b7a0724](https://github.com/blockstack/ux/commit/b7a0724f7326292d343c06c4088dc7003962faad))
- prevent overflow on save key in popup, fixes [#926](https://github.com/blockstack/ux/issues/926) ([e6be09b](https://github.com/blockstack/ux/commit/e6be09b489db4616510d170e951d4fb8ac9c3e9c))
- properly set post conditions from payload ([a53216e](https://github.com/blockstack/ux/commit/a53216ee2baf5f7a940af05e4ff0b9d057f934ce))
- quick fix to reduce node load ([63f00a1](https://github.com/blockstack/ux/commit/63f00a173de79b273601abadc4c00e97bf438809))
- remove incorrect typing for event ([eda8e64](https://github.com/blockstack/ux/commit/eda8e6404372a8ffdd15787fafa35ba7e0a454a8))
- revert to localStorage for ext, fix CI oddities ([e43b74d](https://github.com/blockstack/ux/commit/e43b74d9c22af8860f82f959b6d3d1334b49aa6f))
- secret key cut off, 24 words default, fixes [#771](https://github.com/blockstack/ux/issues/771) ([0f27637](https://github.com/blockstack/ux/commit/0f2763784508ef6f751d3289cc26f37601c99690))
- send max top ([0c8418e](https://github.com/blockstack/ux/commit/0c8418e5391fd2b9301c6b01f618141dd7c0ba10))
- serialize post conditions in connect payload ([faebbec](https://github.com/blockstack/ux/commit/faebbecb4994de6a439b78ad693017c279c3bc82))
- set PostCondition principal for string serialized PCs ([36b1aeb](https://github.com/blockstack/ux/commit/36b1aeb6f1412dd60fc043346410f9704117c9bf))
- show latest transaction on home page immediately, fixes [#766](https://github.com/blockstack/ux/issues/766) ([0ce2c74](https://github.com/blockstack/ux/commit/0ce2c747519f29f7bfb468bed4daa3e8188c5ee2))
- sizes in different contexts, clean up account select page ([b131429](https://github.com/blockstack/ux/commit/b13142943bfea3139fe001c823919444cd35c39f))
- small csp fix ([1306198](https://github.com/blockstack/ux/commit/13061987ce7f7c3b37aa54d7c4f1c349e1d9bfce))
- spacing, flow of sign up ([d514fd4](https://github.com/blockstack/ux/commit/d514fd4f104746f275789166f2d101b71db25206))
- stacks blockchain api language, fixes [#740](https://github.com/blockstack/ux/issues/740) ([2a3a6f9](https://github.com/blockstack/ux/commit/2a3a6f9ad887e9ad0dfb29d09b5b376b994f76ff))
- tests with new auth rules ([6934049](https://github.com/blockstack/ux/commit/693404953738b8a56ed0b56c07b5a9cd6aa15282))
- tons of tx-related improvements. fixes [#728](https://github.com/blockstack/ux/issues/728) and [#729](https://github.com/blockstack/ux/issues/729) ([d8b9e50](https://github.com/blockstack/ux/commit/d8b9e5096ea13b09fdbd1d2f5ba4245bdf15e9e4))
- track rehydrated from vault to reduce jitter on load ([8d76df9](https://github.com/blockstack/ux/commit/8d76df98a84518bdf9a95aae910336c1d4e9da01))
- ts error unused import ([c1180a3](https://github.com/blockstack/ux/commit/c1180a3a2f667d0e04bf8241ef750e392b9f855f))
- update blockchain API URLs, fixes [#802](https://github.com/blockstack/ux/issues/802) ([2aa204f](https://github.com/blockstack/ux/commit/2aa204fa90f4483f4d2e04efda50912ed72b37c8))
- validate STX address on send page, fixes [#945](https://github.com/blockstack/ux/issues/945) ([c14ab85](https://github.com/blockstack/ux/commit/c14ab85d44beca11ad35b4a4ea1331f05a7d4f59))
- webpack 5, fast refresh :~) ([63d7d38](https://github.com/blockstack/ux/commit/63d7d383855ab46545bccea4302858960e806a5c))
- wonky url causing issues in auth ([fba1619](https://github.com/blockstack/ux/commit/fba16199102272b52aea17031befeed9dbab15da))

### Features

- disable username registrations ([1f21428](https://github.com/blockstack/ux/commit/1f214285e111a1bdacbcdbe3f13188beb8004fcc))
- improved UX around wallet onboarding ([8ab3dd3](https://github.com/blockstack/ux/commit/8ab3dd397b16a6c46f225286826966b5ef5db250))
- mainnet network ([c9802a9](https://github.com/blockstack/ux/commit/c9802a93392b98b84f35c46d20bda91acf48cff5))
- move key management to 'vault' in background script ([b83cc7e](https://github.com/blockstack/ux/commit/b83cc7e181e4d45474e7c0d393d045052f4fdd94))
- password validation, fixes [#733](https://github.com/blockstack/ux/issues/733), fixes [#720](https://github.com/blockstack/ux/issues/720) ([d8f6832](https://github.com/blockstack/ux/commit/d8f6832e85199d05ad906236bd8c12614427e227))
- persist networks ChainID, use it everywhere ([66a21c6](https://github.com/blockstack/ux/commit/66a21c674bb76c57e93d4d35652407da9833504d))
- qol improvements for tx signing ([f86d568](https://github.com/blockstack/ux/commit/f86d568825aa7bcb5512885546862d892324c546))
- refactor wallet logic, remove keychain ([0f3ac1f](https://github.com/blockstack/ux/commit/0f3ac1fa86b81d7eef1da1db89f8ab3c30540d6c))
- restore from wallet config ([008b1a2](https://github.com/blockstack/ux/commit/008b1a2c13f9cafcd1dc73f659bb53a328baeec9))
- stacks wallet branding, icon, asset cleanup, fixes [#732](https://github.com/blockstack/ux/issues/732) ([b9cb445](https://github.com/blockstack/ux/commit/b9cb445c92554ffc8ed9b05622cf087739454498))
- stacks wallet for web ([6957c04](https://github.com/blockstack/ux/commit/6957c04bdcfb816fcf757815b9b2720e7a9209eb))
- switch to signed-in account with connect tx calls ([d6a896f](https://github.com/blockstack/ux/commit/d6a896f39ab150fb8a9d3d3d6aba219334547c9b))
- use extension-native apis for app messaging ([663281a](https://github.com/blockstack/ux/commit/663281ad6e7a29e572ae6a6f24cf2bc6925a6a3b))

## 1.20.16 (2021-01-09)

**Note:** Version bump only for package @stacks/app

## 1.20.15 (2021-01-08)

### Bug Fixes

- broken tx signing with extension ([0235140](https://github.com/blockstack/ux/commit/023514021c64e06a80bc31125831d5c35ece3118))

## 1.20.14 (2021-01-06)

### Bug Fixes

- ignore exit code from FF addon publish ([ae05d36](https://github.com/blockstack/ux/commit/ae05d3608ac48cf3944d6d62ead2be65bc11bfde))

## 1.20.13 (2021-01-06)

### Bug Fixes

- use job conditionals instead of workflow conditional ([772b374](https://github.com/blockstack/ux/commit/772b3740def1b31fccf004630ef2d29d167210a4))

## 1.20.12 (2021-01-06)

### Bug Fixes

- ignore tags refs for version workflow ([d2a18fc](https://github.com/blockstack/ux/commit/d2a18fc45a4198a112e881552fbb6c502e557d90))

## 1.20.11 (2021-01-06)

### Bug Fixes

- better syntax for excluding tagged commits' ([4729d01](https://github.com/blockstack/ux/commit/4729d01a5afea316c55dade9143f83748b25071b))

## 1.20.10 (2021-01-06)

### Bug Fixes

- dont run publish on master commits without tag ([0b7cb3a](https://github.com/blockstack/ux/commit/0b7cb3ac50af92bd9ad993b70d48cd930fd31c29))

## 1.20.9 (2021-01-06)

**Note:** Version bump only for package @stacks/app

## 1.20.8 (2020-12-29)

### Bug Fixes

- build rpc pkg before deploying contracts ([c56d3f7](https://github.com/blockstack/ux/commit/c56d3f776494cd471aba77d35b7c5eba20ec245f))

## 1.20.7 (2020-12-29)

### Bug Fixes

- support ts paths in deploy-contracts script ([4bc3ce3](https://github.com/blockstack/ux/commit/4bc3ce3030e392f850cdeaea0e55c6bbaba7c15e))

## 1.20.6 (2020-12-29)

### Bug Fixes

- build packages before deploy-contracts script ([66f0857](https://github.com/blockstack/ux/commit/66f0857cde41d197c29682eedefd46bc16910096))

## 1.20.5 (2020-12-29)

### Bug Fixes

- auto-deploy testnet contracts with github actions ([b1b5c97](https://github.com/blockstack/ux/commit/b1b5c977bc90a9c47e08264d7e0aef665099696e))

## 1.20.4 (2020-12-14)

### Bug Fixes

- prod deploy apps job action ([b8ccc59](https://github.com/blockstack/ux/commit/b8ccc59d1c024705b80991ecb604030f8590e89d))

## 1.20.3 (2020-12-14)

### Bug Fixes

- change lerna publish to skip existing versions ([ac16572](https://github.com/blockstack/ux/commit/ac16572dba7e8d3e770bb4ba61d77094bcad02f9))

## 1.20.1 (2020-12-04)

### Bug Fixes

- export auth from connect ([d201aab](https://github.com/blockstack/ux/commit/d201aab14f2ced0b5f666be571035b7cbf76c602))

# 1.20.0 (2020-11-25)

### Features

- update extension build instructions ([4d55afa](https://github.com/blockstack/ux/commit/4d55afa51dbc3b4cedb81de679b16b91b2df007c))

## 1.19.4 (2020-11-18)

### Bug Fixes

- duplicate 'powered by' on sign in, fixes [#629](https://github.com/blockstack/ux/issues/629) ([6648517](https://github.com/blockstack/ux/commit/6648517e01cdd34a91225dfe08483055b418439c))

## 1.19.3 (2020-11-17)

### Bug Fixes

- update actions to fix set-path err ([0b4fd95](https://github.com/blockstack/ux/commit/0b4fd955f920d5c549690945a18673ea5f0462ae))

## 1.19.2 (2020-11-13)

**Note:** Version bump only for package @stacks/app

## 1.19.1 (2020-11-09)

### Bug Fixes

- build connect ui in build-ext.sh ([c0bd586](https://github.com/blockstack/ux/commit/c0bd586da2baace269144d8797555177882de76a))

# 1.19.0 (2020-11-07)

### Features

- more tests for url validation ([cad6e6a](https://github.com/blockstack/ux/commit/cad6e6a489bfd4de67ff8c20e480b3db99e97e4e))

## 1.18.4 (2020-11-06)

### Bug Fixes

- blockstack, react dep versions ([7f23d36](https://github.com/blockstack/ux/commit/7f23d36b0b6e4531027cd4b2c3cf5d76c7a274d2))

## 1.18.3 (2020-11-05)

### Bug Fixes

- valid-url package for url validation ([2d0664b](https://github.com/blockstack/ux/commit/2d0664b302dbf7464a9c9c5730e85675375b5a0e))

## 1.18.2 (2020-11-05)

### Bug Fixes

- add dep to app ([eade246](https://github.com/blockstack/ux/commit/eade246edadfb2963c543f3647ba348f77c170ec))

## 1.18.1 (2020-11-05)

### Bug Fixes

- add additional url validation ([1b67fbd](https://github.com/blockstack/ux/commit/1b67fbd91d0eb3cbfabfed297b9e18dfd7ab497b))

# 1.18.0 (2020-11-04)

### Features

- further simplify app instructions ([598827d](https://github.com/blockstack/ux/commit/598827d919fb62f9cc5308ebee5eac6acec4e982))

## 1.17.1 (2020-11-03)

### Bug Fixes

- proper glob for lerna packages ([5367055](https://github.com/blockstack/ux/commit/5367055e9c6622dd0a93f97275ab652a9af56bf9))

# 1.17.0 (2020-11-02)

### Bug Fixes

- better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/ux/commit/31518632bf91c6217734c21c1163ae076f22368a))
- stencil publishing tweaks ([db45290](https://github.com/blockstack/ux/commit/db45290e6effbae8e91c9f0d2ab3c9d205cca0f0))
- **app:** prefix hex with 0x in tx result ([2277bc0](https://github.com/blockstack/ux/commit/2277bc0d2b6d52ef32c7dcdcf6d8db277a4a10de))
- add Content Security Policy ([27200a3](https://github.com/blockstack/ux/commit/27200a37aad19061aa1acb273dbada2549a152f2))
- add frame CSP to extension manifest ([4df09ce](https://github.com/blockstack/ux/commit/4df09ce88dc860c202a112edd560388a45b0ba0b))
- back to only frame CSP ([e613210](https://github.com/blockstack/ux/commit/e613210488111adc481915192cebf1912885a087))
- better lookup for profile location, fixes [#377](https://github.com/blockstack/ux/issues/377) ([f292cc1](https://github.com/blockstack/ux/commit/f292cc13aee3b9b531a64bcb4fa8ed76013c406b))
- better readme for firefox install ([cbecc86](https://github.com/blockstack/ux/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
- connect version was behind published ([2d7633e](https://github.com/blockstack/ux/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
- create secret key link not working, [#436](https://github.com/blockstack/ux/issues/436) ([c5870f5](https://github.com/blockstack/ux/commit/c5870f5422c49c754943eba70d7cc5285fc0ea01))
- cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))
- default allow csp ([48e4532](https://github.com/blockstack/ux/commit/48e45321dd60490a6865177a14954e66075d4a0d))
- dont have selected address when canceling reuse, fixes [#454](https://github.com/blockstack/ux/issues/454) ([27f8f61](https://github.com/blockstack/ux/commit/27f8f616549ef9acc1e121f1fda9a40f8a142898))
- dont show extension button on mobile, fixes [#575](https://github.com/blockstack/ux/issues/575) ([1580805](https://github.com/blockstack/ux/commit/15808053177e5701079fef8f371beedffc8828f1))
- fix all eslint and prettier tasks ([217ca35](https://github.com/blockstack/ux/commit/217ca350500dafd45797f15251bee78c787c361a))
- home page alignment, [#440](https://github.com/blockstack/ux/issues/440) ([06dde15](https://github.com/blockstack/ux/commit/06dde15a651f901222650c015c75f8c1343068b6))
- inject version into manifest.json, ignore .zip in git ([6c046aa](https://github.com/blockstack/ux/commit/6c046aaa5e4ea08fff8026f2bb401c8a08dda793))
- keychain package was behind published version ([acbd4b0](https://github.com/blockstack/ux/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
- keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
- lighter CSP ([fcaed93](https://github.com/blockstack/ux/commit/fcaed93e833b84869f530c0dd5a464b9a97e4f34))
- lint ([fd708ff](https://github.com/blockstack/ux/commit/fd708ff79fc5bb620edf66a76938d9231bb84dea))
- manually fix new eslint bugs ([7650b7a](https://github.com/blockstack/ux/commit/7650b7a753465a1767a70df45ec1a9fbdd9db1d1))
- non-JSX SVG attrs throwing errors ([1b3f37f](https://github.com/blockstack/ux/commit/1b3f37f1097d3e7fd4ce73c3bf1124079e2caafc))
- prettier/eslint resolutions and versions ([0fe69bb](https://github.com/blockstack/ux/commit/0fe69bb53a102905e57b49125f7c7901e5c09d15))
- prevent auto-zoom of sign in field, fixes [#510](https://github.com/blockstack/ux/issues/510) ([eea3219](https://github.com/blockstack/ux/commit/eea3219c2de0925b7dd34a5f9fe2e5f6adb0ddc4))
- reduce scope of CSP ([d4d52ff](https://github.com/blockstack/ux/commit/d4d52ffbb3b9913f8e9324e70ec2010a6b40adea))
- use non-eval source maps, script-src self ([995a8f4](https://github.com/blockstack/ux/commit/995a8f42034ae9cea455438c01153bf4a469b81d))
- **app:** create StacksNetwork from payload ([2229bcd](https://github.com/blockstack/ux/commit/2229bcdca0be7036c8b7805c620a06929a9a965a))
- **app:** use strict comparison ([0f74422](https://github.com/blockstack/ux/commit/0f74422ce20fd12e8cdb420e3ccda492878a5e78))
- remove import of d.ts in keychain ([5d5f2eb](https://github.com/blockstack/ux/commit/5d5f2ebf0ccacfb4ee059e69781d935eb9869d34))
- remove repeating console log, closes [#628](https://github.com/blockstack/ux/issues/628) ([5aee7e1](https://github.com/blockstack/ux/commit/5aee7e153bdf0f854d779f0c4d76e52bc03b1cde))
- remove unused perms from manifest ([52abc1f](https://github.com/blockstack/ux/commit/52abc1fc91396dd04d322894a18ed257f2a13864))
- removes need for `unsafe-eval` CSR ([3f62dc5](https://github.com/blockstack/ux/commit/3f62dc5edb7b185715300a47648420cd1b6be293))
- rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
- run new lint:fix ([c84c893](https://github.com/blockstack/ux/commit/c84c8933ce6d9f748ae531f40d37c364fde157da))
- sanitize input ([7f289a6](https://github.com/blockstack/ux/commit/7f289a68cf84a0e69db3988cd580db4984103b12))
- show correct secret key on home screen, fixes [#517](https://github.com/blockstack/ux/issues/517) ([e14afcf](https://github.com/blockstack/ux/commit/e14afcf036ef25d45a541005aa9bb88cd218f4ab))
- show loading when reusing account, fixes [#464](https://github.com/blockstack/ux/issues/464) ([19fbf4e](https://github.com/blockstack/ux/commit/19fbf4efdc5755d26587ca01f225557082d61701))
- spacing between reused account icons, fixes [#509](https://github.com/blockstack/ux/issues/509) ([f47c8f2](https://github.com/blockstack/ux/commit/f47c8f2ef5a5025255dd67b57e8c2c839aa84807))
- tweaks to get extension working ([e068dce](https://github.com/blockstack/ux/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))
- ui version behind published ([8198ca0](https://github.com/blockstack/ux/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))
- update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))
- use async dispatch, fixes [#441](https://github.com/blockstack/ux/issues/441) ([b097348](https://github.com/blockstack/ux/commit/b0973483dac295747cd511af87e42d3b5e156185))
- use const instead of let ([b93c712](https://github.com/blockstack/ux/commit/b93c712f0fa0fa21f105697dc4b022c284048445))
- use spread operator ([f432d74](https://github.com/blockstack/ux/commit/f432d74fb4b0c2143e2e7f1eae7cb56676a508c6))
- **app:** routing bug when trying to create new key, fixes [#381](https://github.com/blockstack/ux/issues/381) ([66f78aa](https://github.com/blockstack/ux/commit/66f78aaf64c3dd38555173ba68ca49ef9445bb53))
- **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))
- **app:** use network from payload ([a21ea67](https://github.com/blockstack/ux/commit/a21ea67a1d9cfd49ffe5a5a34b5e7691b5eadf77))
- 16px below app icon ([4097510](https://github.com/blockstack/ux/commit/4097510df66c28343782af3cb558348689bb9b36))
- add account loading/transition, fixes [#163](https://github.com/blockstack/ux/issues/163) ([fbd063c](https://github.com/blockstack/ux/commit/fbd063c740698d0269d3f6cd862a112a9fb082b7))
- Add hover action to '<Account/>' list ([c405989](https://github.com/blockstack/ux/commit/c405989b071adc070463a2047e9e7ae6751e974b))
- add spacing below title, fixes [#139](https://github.com/blockstack/ux/issues/139) and [#234](https://github.com/blockstack/ux/issues/234) ([336a235](https://github.com/blockstack/ux/commit/336a23562f4f5d769d6c0e846afac79c9e8b29ae))
- adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/ux/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
- Alignment of the onboarding create screen, Closes [#136](https://github.com/blockstack/ux/issues/136) ([7e16aa5](https://github.com/blockstack/ux/commit/7e16aa52f207146ef01bd5698bedfdb3eaf978db))
- All uses of seed phrase ([c9e32a2](https://github.com/blockstack/ux/commit/c9e32a2d7ba302c4669dcbfe416fa4be86dcd8e3))
- app name undefined on create screen ([d8930dd](https://github.com/blockstack/ux/commit/d8930ddaf5a7b157bf17fed134da0c861adc8125))
- change button sizes to lg ([9465556](https://github.com/blockstack/ux/commit/9465556a49dc73ba1e947c06ce196b486d8f34e5))
- choose account after sign in with key, fixes [#156](https://github.com/blockstack/ux/issues/156) ([432ab82](https://github.com/blockstack/ux/commit/432ab8236e9b135c836986e92292faf6dcd01469))
- choose account hover styles ([e924b04](https://github.com/blockstack/ux/commit/e924b04e9ad38b46353667b50d3eca87b30965eb))
- clear onboarding path on sign out [#341](https://github.com/blockstack/ux/issues/341) ([f0820c9](https://github.com/blockstack/ux/commit/f0820c999143f8a00d89bcc04ecef0fa1699b5f1))
- document.title bug [#335](https://github.com/blockstack/ux/issues/335), caused by invalid redux hydration ([882fdd6](https://github.com/blockstack/ux/commit/882fdd6bfcb34e1ff1caed114065dc7b7b228e4d))
- document.title undefined, fixes [#335](https://github.com/blockstack/ux/issues/335) ([378b903](https://github.com/blockstack/ux/commit/378b903af1d0c66eed499d4ddba951b3a62bb658))
- dont require built ui to build connect ([c354be7](https://github.com/blockstack/ux/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))
- dont show secret key when logged out, [#340](https://github.com/blockstack/ux/issues/340) ([355d518](https://github.com/blockstack/ux/commit/355d518c545527337db8efad3038bf65544e5a33))
- dont show warning if app already used, closes [#188](https://github.com/blockstack/ux/issues/188) ([93e110a](https://github.com/blockstack/ux/commit/93e110a0f357b756e66546d13061176370583d54))
- Ensure key input trims whitespace, Closes blockstack/connect[#66](https://github.com/blockstack/ux/issues/66) ([5dc347f](https://github.com/blockstack/ux/commit/5dc347f79024b452ef1440e58701e05b77beb3e3))
- Ensure page events are tracked ([e64396f](https://github.com/blockstack/ux/commit/e64396fc2688d0cb62f14a8aa515b826907f9da8))
- Error message, Closes [#169](https://github.com/blockstack/ux/issues/169) ([02e7c46](https://github.com/blockstack/ux/commit/02e7c46b5d5522c165c0b045e375b75df2ca8ca2))
- ErrorLabels not formatted properly, Closes [#159](https://github.com/blockstack/ux/issues/159) ([981dab6](https://github.com/blockstack/ux/commit/981dab62c445e537cc5ee0df7ec1522b5eeb2a11))
- hard-coded "Messenger" in secret key page ([bfc0848](https://github.com/blockstack/ux/commit/bfc084809ff0e03ac588592d9c041e37fdfee21a))
- hide icon in ScreenHeader if missing ([75d0682](https://github.com/blockstack/ux/commit/75d06824fa47aa660772b185723d5882934e3633))
- Input/Textarea fields autocapitalizing on iOS, Closes [#180](https://github.com/blockstack/ux/issues/180) ([45ec252](https://github.com/blockstack/ux/commit/45ec25224633ea8cfaa43cd57377e23138b4fd64))
- long usernames text-align: left, fixes [#174](https://github.com/blockstack/ux/issues/174) ([0939f99](https://github.com/blockstack/ux/commit/0939f99efedb4ed9555df7d2ec742fbdadd8a3b9))
- magic recovery code flow getting stuck ([500fdeb](https://github.com/blockstack/ux/commit/500fdebfad77cb7690f6ba17dd2822c96c439aa7))
- missing app icon on username error, [#338](https://github.com/blockstack/ux/issues/338) ([7296f63](https://github.com/blockstack/ux/commit/7296f63c91d53bbc06fdc995d672c0c978c76adf))
- Prevent zoom on focus by increasing fontsize, Closes [#183](https://github.com/blockstack/ux/issues/183) ([4044c1b](https://github.com/blockstack/ux/commit/4044c1ba9a72ef03d402fa9fb27ae14c346c62bc))
- profile info not set in authResponse ([9e48475](https://github.com/blockstack/ux/commit/9e4847544e89dc1c8abcebeda6d34dc2bf8a4c7f))
- proper title tracking, [#201](https://github.com/blockstack/ux/issues/201) ([b715c8b](https://github.com/blockstack/ux/commit/b715c8b3eac8fdef953252e74912fdfdc36a68e3))
- Remove resize and spellchecking from all inputs/textareas, Closes [#153](https://github.com/blockstack/ux/issues/153) ([a0eff88](https://github.com/blockstack/ux/commit/a0eff8825ebe12dd0a66e713aeed823137eb9f04))
- remove undefined ([a50bcb4](https://github.com/blockstack/ux/commit/a50bcb492db9d5561e04b992d04c4cd931714b23))
- Remove username placeholder ([c6d6258](https://github.com/blockstack/ux/commit/c6d62587e01848d6a3fe66813157fd1038c42ec5))
- screens with inputs will now submit on return, fixes: [#147](https://github.com/blockstack/ux/issues/147), [#160](https://github.com/blockstack/ux/issues/160) ([31cbbe4](https://github.com/blockstack/ux/commit/31cbbe4df8e5a50744e2eaad0f9e18ee4f16fde0))
- send to sign-in if sendToSignIn, even if path = sign-up ([b397ff3](https://github.com/blockstack/ux/commit/b397ff39d6a78cb7ae4a7364b5ba4fcf1ee51163))
- sign in flows dont change screen properly ([3c162cd](https://github.com/blockstack/ux/commit/3c162cd8d9de84ece62b663d53003806e154fd1f))
- spacing on collapse component ([0541cba](https://github.com/blockstack/ux/commit/0541cba80df697541f4590cd7768dd7617c5c4c2))
- textarea height and title ([60df34a](https://github.com/blockstack/ux/commit/60df34a44fdcbe694f3db3809a8f89567e59e038))
- Tracking ([#111](https://github.com/blockstack/ux/issues/111)) ([4babe6b](https://github.com/blockstack/ux/commit/4babe6bd4235367ec09b43270b960d07dda41b23))
- ts error with react-router import ([8ecef0f](https://github.com/blockstack/ux/commit/8ecef0fbd537666c66f1f41bf85371b8ca80d166))
- typo ([5c40890](https://github.com/blockstack/ux/commit/5c40890f41678150fe3dee92aa67101326e552a3))
- update type for button mode prop ([3f8ad2f](https://github.com/blockstack/ux/commit/3f8ad2f15a6f2784b3440acf3265f991726fe8eb))
- username capitalization, fixes [#419](https://github.com/blockstack/ux/issues/419) ([97cb976](https://github.com/blockstack/ux/commit/97cb9764ddacccba820ff42cdf1734b230dbeb27))
- validate that seed is not empty on sign in, fixes [#170](https://github.com/blockstack/ux/issues/170) ([e0ea149](https://github.com/blockstack/ux/commit/e0ea14909bad5b7f428a835953eb01230fa709f1))
- Visual glitches with account warning dialog ([ca2224b](https://github.com/blockstack/ux/commit/ca2224b9a034f01181dc905baca77a623bc74d22))

### Features

- add ability to view secret key ([440c3e5](https://github.com/blockstack/ux/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))
- add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))
- add CI, proper connections between packages ([5934829](https://github.com/blockstack/ux/commit/5934829a40338ac269b80783912c8dad17af1962))
- add debug mode for transaction signing ([3c66887](https://github.com/blockstack/ux/commit/3c6688714b070a38c2eefe0d93a6218163917c53))
- Add identity validation and availability to the auth flow ([3f51783](https://github.com/blockstack/ux/commit/3f51783d33373cb815121a55772d751fe2c09504))
- add keychain logic to restore identities ([e2a18d6](https://github.com/blockstack/ux/commit/e2a18d6036327efe403892eeec721ad9951c8983))
- add link back to Secret Key page, Closes [#168](https://github.com/blockstack/ux/issues/168) ([5ed74c7](https://github.com/blockstack/ux/commit/5ed74c7cd417994667b325cf4ca96a3fd23c7ed4))
- Add loading spinner when selecting account, Closes [#96](https://github.com/blockstack/ux/issues/96) ([386235d](https://github.com/blockstack/ux/commit/386235d6ec7dd7dc62286e0bd16fe3a44448c7cf))
- add proper page tracking to first page ([89b9f5d](https://github.com/blockstack/ux/commit/89b9f5d5bd52550e1d8b53a06302ed708060df2a))
- Add validation to seed entry field ([#63](https://github.com/blockstack/ux/issues/63)) ([6a34531](https://github.com/blockstack/ux/commit/6a345311037f61d19992284065696631c42f3f84))
- add variants to username error state ([19b603b](https://github.com/blockstack/ux/commit/19b603ba4ba40b42f2d0a9d99cf274af1c3eaf20))
- add vercel headers ([ae3c72a](https://github.com/blockstack/ux/commit/ae3c72afff49c09145d896412356cd129668f29d))
- Add write key segment ([8ff9be7](https://github.com/blockstack/ux/commit/8ff9be77b1494f44a69e890c5d4b2c724ad7e00b))
- adds appURL to onboarding store ([5085bb0](https://github.com/blockstack/ux/commit/5085bb0072c8640110b12ebf8e8d98bdd1928dcb))
- adds onCancel method for when popup closed ([c5800ae](https://github.com/blockstack/ux/commit/c5800aeb341c65e108b93b5e7a17a6d937292fc1))
- adds screen changed event ([b1600b6](https://github.com/blockstack/ux/commit/b1600b6e41a70d39f92a9818eb203d6941e81b6b))
- change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
- codebox and highlighter ([b9056f8](https://github.com/blockstack/ux/commit/b9056f8102eff8d32898201717a3cd3699234561))
- dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))
- expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))
- implement basic homepage ([10ac702](https://github.com/blockstack/ux/commit/10ac70200e769ae91544073e75347e9d1de33e81))
- implementation of router ([bd03411](https://github.com/blockstack/ux/commit/bd034112a098868d07e04dc6aba97d15145707d1))
- improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/ux/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))
- improve extension instructions ([e4f9f89](https://github.com/blockstack/ux/commit/e4f9f899a3e42796e34e70943efc52f68a77eba0))
- Layout closer to designs, created <ExplainerCard /> ([#68](https://github.com/blockstack/ux/issues/68)) ([52f4fe7](https://github.com/blockstack/ux/commit/52f4fe75f93676e35d6986246262acf1eb6a6c2f))
- more detailed events to username ([5cc323b](https://github.com/blockstack/ux/commit/5cc323b4ba7b122e7f5a60dfee422b3ca7f21942))
- more events, mostly around choosing an account ([a1f7401](https://github.com/blockstack/ux/commit/a1f7401b226fe2ae196d8dadc8c4d3711fada998))
- move changing screen into analytics hook ([0be47b5](https://github.com/blockstack/ux/commit/0be47b54619f9bb0bd859b14ce6e253017cd1e03)), closes [#130](https://github.com/blockstack/ux/issues/130)
- move doTrack into hook, [#130](https://github.com/blockstack/ux/issues/130) ([6b1d390](https://github.com/blockstack/ux/commit/6b1d390e5f4ac36fd1aeb5d28f53daa9b8ae0bce))
- move username screen to the end, closes [#110](https://github.com/blockstack/ux/issues/110) ([942379b](https://github.com/blockstack/ux/commit/942379b3c7de757d20bc43b85e5ed426cc086691))
- Page title changes between screens, Closes [#149](https://github.com/blockstack/ux/issues/149) ([e1373d8](https://github.com/blockstack/ux/commit/e1373d8c657e861d71d19311d6426f1c37c2a7d1))
- prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/ux/issues/224) ([12a6772](https://github.com/blockstack/ux/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
- refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
- remove auto username generation ([b160f2b](https://github.com/blockstack/ux/commit/b160f2b05613118cc920d2344defa06b45ce214e))
- remove connect screen at end of onboarding ([42c8958](https://github.com/blockstack/ux/commit/42c895838786c6843113409148c0e6b263e96e0e))
- remove secret key branding, [#334](https://github.com/blockstack/ux/issues/334) ([e57c8bc](https://github.com/blockstack/ux/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))
- rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))
- send user back into unfinished onboarding flow ([5ccda3c](https://github.com/blockstack/ux/commit/5ccda3c278e0caac7b4669a193b8e62209fda543))
- show error page when username registration fails ([fd457c6](https://github.com/blockstack/ux/commit/fd457c60f7081ee44c7fa7ae2cb3ab06070293c2))
- slight speedup on final auth transition ([6fb56a8](https://github.com/blockstack/ux/commit/6fb56a89181cdb99d4b20d27066647dd93f46fcb))
- support relative app icons in appDetails, closes [#348](https://github.com/blockstack/ux/issues/348) ([40f27dc](https://github.com/blockstack/ux/commit/40f27dcb64eecfa7d5f85ff8fba18999a21ea97f))
- use .id.blockstack subdomain, fixes [#123](https://github.com/blockstack/ux/issues/123) ([59d3087](https://github.com/blockstack/ux/commit/59d3087654bb52396d242467cab897621dce3f6c))
- use stats package for metrics ([710f1fc](https://github.com/blockstack/ux/commit/710f1fca0a3fc8ad4aaed75ec828ddb815b1483b))
- use window.location for ios redirect ([9d83fc9](https://github.com/blockstack/ux/commit/9d83fc916e029d437f6a2e8af9b19b734f4aa3ac))
- **app:** hide default domain placeholder during onboarding ([8a12763](https://github.com/blockstack/ux/commit/8a12763d65112626766630ff915e3ae802fe82ef)), closes [#221](https://github.com/blockstack/ux/issues/221) [#220](https://github.com/blockstack/ux/issues/220)
- **onboarding:** update branding, copy ([7b4f6ac](https://github.com/blockstack/ux/commit/7b4f6ac43f5764626bd59608ec0d1eed8d664d69))

## [1.16.1](https://github.com/blockstack/ux/compare/@stacks/app@1.16.0...@stacks/app@1.16.1) (2020-11-02)

**Note:** Version bump only for package @stacks/app

# 1.16.0 (2020-11-02)

### Bug Fixes

- **app:** prefix hex with 0x in tx result ([2277bc0](https://github.com/blockstack/ux/commit/2277bc0d2b6d52ef32c7dcdcf6d8db277a4a10de))
- add Content Security Policy ([27200a3](https://github.com/blockstack/ux/commit/27200a37aad19061aa1acb273dbada2549a152f2))
- add frame CSP to extension manifest ([4df09ce](https://github.com/blockstack/ux/commit/4df09ce88dc860c202a112edd560388a45b0ba0b))
- back to only frame CSP ([e613210](https://github.com/blockstack/ux/commit/e613210488111adc481915192cebf1912885a087))
- better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/ux/commit/31518632bf91c6217734c21c1163ae076f22368a))
- better lookup for profile location, fixes [#377](https://github.com/blockstack/ux/issues/377) ([f292cc1](https://github.com/blockstack/ux/commit/f292cc13aee3b9b531a64bcb4fa8ed76013c406b))
- better readme for firefox install ([cbecc86](https://github.com/blockstack/ux/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
- connect version was behind published ([2d7633e](https://github.com/blockstack/ux/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
- create secret key link not working, [#436](https://github.com/blockstack/ux/issues/436) ([c5870f5](https://github.com/blockstack/ux/commit/c5870f5422c49c754943eba70d7cc5285fc0ea01))
- cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))
- default allow csp ([48e4532](https://github.com/blockstack/ux/commit/48e45321dd60490a6865177a14954e66075d4a0d))
- dont have selected address when canceling reuse, fixes [#454](https://github.com/blockstack/ux/issues/454) ([27f8f61](https://github.com/blockstack/ux/commit/27f8f616549ef9acc1e121f1fda9a40f8a142898))
- dont show extension button on mobile, fixes [#575](https://github.com/blockstack/ux/issues/575) ([1580805](https://github.com/blockstack/ux/commit/15808053177e5701079fef8f371beedffc8828f1))
- fix all eslint and prettier tasks ([217ca35](https://github.com/blockstack/ux/commit/217ca350500dafd45797f15251bee78c787c361a))
- home page alignment, [#440](https://github.com/blockstack/ux/issues/440) ([06dde15](https://github.com/blockstack/ux/commit/06dde15a651f901222650c015c75f8c1343068b6))
- inject version into manifest.json, ignore .zip in git ([6c046aa](https://github.com/blockstack/ux/commit/6c046aaa5e4ea08fff8026f2bb401c8a08dda793))
- keychain package was behind published version ([acbd4b0](https://github.com/blockstack/ux/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
- keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
- lighter CSP ([fcaed93](https://github.com/blockstack/ux/commit/fcaed93e833b84869f530c0dd5a464b9a97e4f34))
- lint ([fd708ff](https://github.com/blockstack/ux/commit/fd708ff79fc5bb620edf66a76938d9231bb84dea))
- manually fix new eslint bugs ([7650b7a](https://github.com/blockstack/ux/commit/7650b7a753465a1767a70df45ec1a9fbdd9db1d1))
- non-JSX SVG attrs throwing errors ([1b3f37f](https://github.com/blockstack/ux/commit/1b3f37f1097d3e7fd4ce73c3bf1124079e2caafc))
- prettier/eslint resolutions and versions ([0fe69bb](https://github.com/blockstack/ux/commit/0fe69bb53a102905e57b49125f7c7901e5c09d15))
- prevent auto-zoom of sign in field, fixes [#510](https://github.com/blockstack/ux/issues/510) ([eea3219](https://github.com/blockstack/ux/commit/eea3219c2de0925b7dd34a5f9fe2e5f6adb0ddc4))
- reduce scope of CSP ([d4d52ff](https://github.com/blockstack/ux/commit/d4d52ffbb3b9913f8e9324e70ec2010a6b40adea))
- remove import of d.ts in keychain ([5d5f2eb](https://github.com/blockstack/ux/commit/5d5f2ebf0ccacfb4ee059e69781d935eb9869d34))
- use non-eval source maps, script-src self ([995a8f4](https://github.com/blockstack/ux/commit/995a8f42034ae9cea455438c01153bf4a469b81d))
- **app:** create StacksNetwork from payload ([2229bcd](https://github.com/blockstack/ux/commit/2229bcdca0be7036c8b7805c620a06929a9a965a))
- **app:** use network from payload ([a21ea67](https://github.com/blockstack/ux/commit/a21ea67a1d9cfd49ffe5a5a34b5e7691b5eadf77))
- **app:** use strict comparison ([0f74422](https://github.com/blockstack/ux/commit/0f74422ce20fd12e8cdb420e3ccda492878a5e78))
- remove repeating console log, closes [#628](https://github.com/blockstack/ux/issues/628) ([5aee7e1](https://github.com/blockstack/ux/commit/5aee7e153bdf0f854d779f0c4d76e52bc03b1cde))
- remove unused perms from manifest ([52abc1f](https://github.com/blockstack/ux/commit/52abc1fc91396dd04d322894a18ed257f2a13864))
- removes need for `unsafe-eval` CSR ([3f62dc5](https://github.com/blockstack/ux/commit/3f62dc5edb7b185715300a47648420cd1b6be293))
- rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
- run new lint:fix ([c84c893](https://github.com/blockstack/ux/commit/c84c8933ce6d9f748ae531f40d37c364fde157da))
- sanitize input ([7f289a6](https://github.com/blockstack/ux/commit/7f289a68cf84a0e69db3988cd580db4984103b12))
- show correct secret key on home screen, fixes [#517](https://github.com/blockstack/ux/issues/517) ([e14afcf](https://github.com/blockstack/ux/commit/e14afcf036ef25d45a541005aa9bb88cd218f4ab))
- show loading when reusing account, fixes [#464](https://github.com/blockstack/ux/issues/464) ([19fbf4e](https://github.com/blockstack/ux/commit/19fbf4efdc5755d26587ca01f225557082d61701))
- spacing between reused account icons, fixes [#509](https://github.com/blockstack/ux/issues/509) ([f47c8f2](https://github.com/blockstack/ux/commit/f47c8f2ef5a5025255dd67b57e8c2c839aa84807))
- tweaks to get extension working ([e068dce](https://github.com/blockstack/ux/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))
- ui version behind published ([8198ca0](https://github.com/blockstack/ux/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))
- update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))
- use const instead of let ([b93c712](https://github.com/blockstack/ux/commit/b93c712f0fa0fa21f105697dc4b022c284048445))
- use spread operator ([f432d74](https://github.com/blockstack/ux/commit/f432d74fb4b0c2143e2e7f1eae7cb56676a508c6))
- **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))
- use async dispatch, fixes [#441](https://github.com/blockstack/ux/issues/441) ([b097348](https://github.com/blockstack/ux/commit/b0973483dac295747cd511af87e42d3b5e156185))
- username capitalization, fixes [#419](https://github.com/blockstack/ux/issues/419) ([97cb976](https://github.com/blockstack/ux/commit/97cb9764ddacccba820ff42cdf1734b230dbeb27))
- **app:** routing bug when trying to create new key, fixes [#381](https://github.com/blockstack/ux/issues/381) ([66f78aa](https://github.com/blockstack/ux/commit/66f78aaf64c3dd38555173ba68ca49ef9445bb53))
- 16px below app icon ([4097510](https://github.com/blockstack/ux/commit/4097510df66c28343782af3cb558348689bb9b36))
- add account loading/transition, fixes [#163](https://github.com/blockstack/ux/issues/163) ([fbd063c](https://github.com/blockstack/ux/commit/fbd063c740698d0269d3f6cd862a112a9fb082b7))
- Add hover action to '<Account/>' list ([c405989](https://github.com/blockstack/ux/commit/c405989b071adc070463a2047e9e7ae6751e974b))
- add spacing below title, fixes [#139](https://github.com/blockstack/ux/issues/139) and [#234](https://github.com/blockstack/ux/issues/234) ([336a235](https://github.com/blockstack/ux/commit/336a23562f4f5d769d6c0e846afac79c9e8b29ae))
- adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/ux/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
- Alignment of the onboarding create screen, Closes [#136](https://github.com/blockstack/ux/issues/136) ([7e16aa5](https://github.com/blockstack/ux/commit/7e16aa52f207146ef01bd5698bedfdb3eaf978db))
- All uses of seed phrase ([c9e32a2](https://github.com/blockstack/ux/commit/c9e32a2d7ba302c4669dcbfe416fa4be86dcd8e3))
- app name undefined on create screen ([d8930dd](https://github.com/blockstack/ux/commit/d8930ddaf5a7b157bf17fed134da0c861adc8125))
- change button sizes to lg ([9465556](https://github.com/blockstack/ux/commit/9465556a49dc73ba1e947c06ce196b486d8f34e5))
- choose account after sign in with key, fixes [#156](https://github.com/blockstack/ux/issues/156) ([432ab82](https://github.com/blockstack/ux/commit/432ab8236e9b135c836986e92292faf6dcd01469))
- choose account hover styles ([e924b04](https://github.com/blockstack/ux/commit/e924b04e9ad38b46353667b50d3eca87b30965eb))
- clear onboarding path on sign out [#341](https://github.com/blockstack/ux/issues/341) ([f0820c9](https://github.com/blockstack/ux/commit/f0820c999143f8a00d89bcc04ecef0fa1699b5f1))
- document.title bug [#335](https://github.com/blockstack/ux/issues/335), caused by invalid redux hydration ([882fdd6](https://github.com/blockstack/ux/commit/882fdd6bfcb34e1ff1caed114065dc7b7b228e4d))
- document.title undefined, fixes [#335](https://github.com/blockstack/ux/issues/335) ([378b903](https://github.com/blockstack/ux/commit/378b903af1d0c66eed499d4ddba951b3a62bb658))
- dont require built ui to build connect ([c354be7](https://github.com/blockstack/ux/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))
- dont show secret key when logged out, [#340](https://github.com/blockstack/ux/issues/340) ([355d518](https://github.com/blockstack/ux/commit/355d518c545527337db8efad3038bf65544e5a33))
- dont show warning if app already used, closes [#188](https://github.com/blockstack/ux/issues/188) ([93e110a](https://github.com/blockstack/ux/commit/93e110a0f357b756e66546d13061176370583d54))
- Ensure key input trims whitespace, Closes blockstack/connect[#66](https://github.com/blockstack/ux/issues/66) ([5dc347f](https://github.com/blockstack/ux/commit/5dc347f79024b452ef1440e58701e05b77beb3e3))
- Ensure page events are tracked ([e64396f](https://github.com/blockstack/ux/commit/e64396fc2688d0cb62f14a8aa515b826907f9da8))
- Error message, Closes [#169](https://github.com/blockstack/ux/issues/169) ([02e7c46](https://github.com/blockstack/ux/commit/02e7c46b5d5522c165c0b045e375b75df2ca8ca2))
- ErrorLabels not formatted properly, Closes [#159](https://github.com/blockstack/ux/issues/159) ([981dab6](https://github.com/blockstack/ux/commit/981dab62c445e537cc5ee0df7ec1522b5eeb2a11))
- hard-coded "Messenger" in secret key page ([bfc0848](https://github.com/blockstack/ux/commit/bfc084809ff0e03ac588592d9c041e37fdfee21a))
- hide icon in ScreenHeader if missing ([75d0682](https://github.com/blockstack/ux/commit/75d06824fa47aa660772b185723d5882934e3633))
- Input/Textarea fields autocapitalizing on iOS, Closes [#180](https://github.com/blockstack/ux/issues/180) ([45ec252](https://github.com/blockstack/ux/commit/45ec25224633ea8cfaa43cd57377e23138b4fd64))
- long usernames text-align: left, fixes [#174](https://github.com/blockstack/ux/issues/174) ([0939f99](https://github.com/blockstack/ux/commit/0939f99efedb4ed9555df7d2ec742fbdadd8a3b9))
- magic recovery code flow getting stuck ([500fdeb](https://github.com/blockstack/ux/commit/500fdebfad77cb7690f6ba17dd2822c96c439aa7))
- missing app icon on username error, [#338](https://github.com/blockstack/ux/issues/338) ([7296f63](https://github.com/blockstack/ux/commit/7296f63c91d53bbc06fdc995d672c0c978c76adf))
- Prevent zoom on focus by increasing fontsize, Closes [#183](https://github.com/blockstack/ux/issues/183) ([4044c1b](https://github.com/blockstack/ux/commit/4044c1ba9a72ef03d402fa9fb27ae14c346c62bc))
- profile info not set in authResponse ([9e48475](https://github.com/blockstack/ux/commit/9e4847544e89dc1c8abcebeda6d34dc2bf8a4c7f))
- proper title tracking, [#201](https://github.com/blockstack/ux/issues/201) ([b715c8b](https://github.com/blockstack/ux/commit/b715c8b3eac8fdef953252e74912fdfdc36a68e3))
- Remove resize and spellchecking from all inputs/textareas, Closes [#153](https://github.com/blockstack/ux/issues/153) ([a0eff88](https://github.com/blockstack/ux/commit/a0eff8825ebe12dd0a66e713aeed823137eb9f04))
- remove undefined ([a50bcb4](https://github.com/blockstack/ux/commit/a50bcb492db9d5561e04b992d04c4cd931714b23))
- Remove username placeholder ([c6d6258](https://github.com/blockstack/ux/commit/c6d62587e01848d6a3fe66813157fd1038c42ec5))
- screens with inputs will now submit on return, fixes: [#147](https://github.com/blockstack/ux/issues/147), [#160](https://github.com/blockstack/ux/issues/160) ([31cbbe4](https://github.com/blockstack/ux/commit/31cbbe4df8e5a50744e2eaad0f9e18ee4f16fde0))
- send to sign-in if sendToSignIn, even if path = sign-up ([b397ff3](https://github.com/blockstack/ux/commit/b397ff39d6a78cb7ae4a7364b5ba4fcf1ee51163))
- sign in flows dont change screen properly ([3c162cd](https://github.com/blockstack/ux/commit/3c162cd8d9de84ece62b663d53003806e154fd1f))
- spacing on collapse component ([0541cba](https://github.com/blockstack/ux/commit/0541cba80df697541f4590cd7768dd7617c5c4c2))
- textarea height and title ([60df34a](https://github.com/blockstack/ux/commit/60df34a44fdcbe694f3db3809a8f89567e59e038))
- Tracking ([#111](https://github.com/blockstack/ux/issues/111)) ([4babe6b](https://github.com/blockstack/ux/commit/4babe6bd4235367ec09b43270b960d07dda41b23))
- ts error with react-router import ([8ecef0f](https://github.com/blockstack/ux/commit/8ecef0fbd537666c66f1f41bf85371b8ca80d166))
- typo ([5c40890](https://github.com/blockstack/ux/commit/5c40890f41678150fe3dee92aa67101326e552a3))
- update type for button mode prop ([3f8ad2f](https://github.com/blockstack/ux/commit/3f8ad2f15a6f2784b3440acf3265f991726fe8eb))
- validate that seed is not empty on sign in, fixes [#170](https://github.com/blockstack/ux/issues/170) ([e0ea149](https://github.com/blockstack/ux/commit/e0ea14909bad5b7f428a835953eb01230fa709f1))
- Visual glitches with account warning dialog ([ca2224b](https://github.com/blockstack/ux/commit/ca2224b9a034f01181dc905baca77a623bc74d22))

### Features

- add ability to view secret key ([440c3e5](https://github.com/blockstack/ux/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))
- add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))
- add CI, proper connections between packages ([5934829](https://github.com/blockstack/ux/commit/5934829a40338ac269b80783912c8dad17af1962))
- add debug mode for transaction signing ([3c66887](https://github.com/blockstack/ux/commit/3c6688714b070a38c2eefe0d93a6218163917c53))
- Add identity validation and availability to the auth flow ([3f51783](https://github.com/blockstack/ux/commit/3f51783d33373cb815121a55772d751fe2c09504))
- add keychain logic to restore identities ([e2a18d6](https://github.com/blockstack/ux/commit/e2a18d6036327efe403892eeec721ad9951c8983))
- add link back to Secret Key page, Closes [#168](https://github.com/blockstack/ux/issues/168) ([5ed74c7](https://github.com/blockstack/ux/commit/5ed74c7cd417994667b325cf4ca96a3fd23c7ed4))
- Add loading spinner when selecting account, Closes [#96](https://github.com/blockstack/ux/issues/96) ([386235d](https://github.com/blockstack/ux/commit/386235d6ec7dd7dc62286e0bd16fe3a44448c7cf))
- add proper page tracking to first page ([89b9f5d](https://github.com/blockstack/ux/commit/89b9f5d5bd52550e1d8b53a06302ed708060df2a))
- Add validation to seed entry field ([#63](https://github.com/blockstack/ux/issues/63)) ([6a34531](https://github.com/blockstack/ux/commit/6a345311037f61d19992284065696631c42f3f84))
- add variants to username error state ([19b603b](https://github.com/blockstack/ux/commit/19b603ba4ba40b42f2d0a9d99cf274af1c3eaf20))
- add vercel headers ([ae3c72a](https://github.com/blockstack/ux/commit/ae3c72afff49c09145d896412356cd129668f29d))
- Add write key segment ([8ff9be7](https://github.com/blockstack/ux/commit/8ff9be77b1494f44a69e890c5d4b2c724ad7e00b))
- adds appURL to onboarding store ([5085bb0](https://github.com/blockstack/ux/commit/5085bb0072c8640110b12ebf8e8d98bdd1928dcb))
- adds onCancel method for when popup closed ([c5800ae](https://github.com/blockstack/ux/commit/c5800aeb341c65e108b93b5e7a17a6d937292fc1))
- adds screen changed event ([b1600b6](https://github.com/blockstack/ux/commit/b1600b6e41a70d39f92a9818eb203d6941e81b6b))
- change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
- codebox and highlighter ([b9056f8](https://github.com/blockstack/ux/commit/b9056f8102eff8d32898201717a3cd3699234561))
- dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))
- expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))
- implement basic homepage ([10ac702](https://github.com/blockstack/ux/commit/10ac70200e769ae91544073e75347e9d1de33e81))
- implementation of router ([bd03411](https://github.com/blockstack/ux/commit/bd034112a098868d07e04dc6aba97d15145707d1))
- improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/ux/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))
- improve extension instructions ([e4f9f89](https://github.com/blockstack/ux/commit/e4f9f899a3e42796e34e70943efc52f68a77eba0))
- Layout closer to designs, created <ExplainerCard /> ([#68](https://github.com/blockstack/ux/issues/68)) ([52f4fe7](https://github.com/blockstack/ux/commit/52f4fe75f93676e35d6986246262acf1eb6a6c2f))
- more detailed events to username ([5cc323b](https://github.com/blockstack/ux/commit/5cc323b4ba7b122e7f5a60dfee422b3ca7f21942))
- more events, mostly around choosing an account ([a1f7401](https://github.com/blockstack/ux/commit/a1f7401b226fe2ae196d8dadc8c4d3711fada998))
- move changing screen into analytics hook ([0be47b5](https://github.com/blockstack/ux/commit/0be47b54619f9bb0bd859b14ce6e253017cd1e03)), closes [#130](https://github.com/blockstack/ux/issues/130)
- move doTrack into hook, [#130](https://github.com/blockstack/ux/issues/130) ([6b1d390](https://github.com/blockstack/ux/commit/6b1d390e5f4ac36fd1aeb5d28f53daa9b8ae0bce))
- move username screen to the end, closes [#110](https://github.com/blockstack/ux/issues/110) ([942379b](https://github.com/blockstack/ux/commit/942379b3c7de757d20bc43b85e5ed426cc086691))
- Page title changes between screens, Closes [#149](https://github.com/blockstack/ux/issues/149) ([e1373d8](https://github.com/blockstack/ux/commit/e1373d8c657e861d71d19311d6426f1c37c2a7d1))
- prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/ux/issues/224) ([12a6772](https://github.com/blockstack/ux/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
- refactor connect ui into web components with stencil ([7f65900](https://github.com/blockstack/ux/commit/7f65900fd6f648dcad57502d985b8dc862e7b72f)), closes [#581](https://github.com/blockstack/ux/issues/581) [#604](https://github.com/blockstack/ux/issues/604) [#612](https://github.com/blockstack/ux/issues/612) [#606](https://github.com/blockstack/ux/issues/606) [#613](https://github.com/blockstack/ux/issues/613)
- remove auto username generation ([b160f2b](https://github.com/blockstack/ux/commit/b160f2b05613118cc920d2344defa06b45ce214e))
- remove connect screen at end of onboarding ([42c8958](https://github.com/blockstack/ux/commit/42c895838786c6843113409148c0e6b263e96e0e))
- remove secret key branding, [#334](https://github.com/blockstack/ux/issues/334) ([e57c8bc](https://github.com/blockstack/ux/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))
- rename all packages to [@stacks](https://github.com/stacks) ([b56e750](https://github.com/blockstack/ux/commit/b56e750db5b30d4c56e9669285a11db565e8a675))
- send user back into unfinished onboarding flow ([5ccda3c](https://github.com/blockstack/ux/commit/5ccda3c278e0caac7b4669a193b8e62209fda543))
- show error page when username registration fails ([fd457c6](https://github.com/blockstack/ux/commit/fd457c60f7081ee44c7fa7ae2cb3ab06070293c2))
- slight speedup on final auth transition ([6fb56a8](https://github.com/blockstack/ux/commit/6fb56a89181cdb99d4b20d27066647dd93f46fcb))
- support relative app icons in appDetails, closes [#348](https://github.com/blockstack/ux/issues/348) ([40f27dc](https://github.com/blockstack/ux/commit/40f27dcb64eecfa7d5f85ff8fba18999a21ea97f))
- use .id.blockstack subdomain, fixes [#123](https://github.com/blockstack/ux/issues/123) ([59d3087](https://github.com/blockstack/ux/commit/59d3087654bb52396d242467cab897621dce3f6c))
- use stats package for metrics ([710f1fc](https://github.com/blockstack/ux/commit/710f1fca0a3fc8ad4aaed75ec828ddb815b1483b))
- use window.location for ios redirect ([9d83fc9](https://github.com/blockstack/ux/commit/9d83fc916e029d437f6a2e8af9b19b734f4aa3ac))
- **app:** hide default domain placeholder during onboarding ([8a12763](https://github.com/blockstack/ux/commit/8a12763d65112626766630ff915e3ae802fe82ef)), closes [#221](https://github.com/blockstack/ux/issues/221) [#220](https://github.com/blockstack/ux/issues/220)
- **onboarding:** update branding, copy ([7b4f6ac](https://github.com/blockstack/ux/commit/7b4f6ac43f5764626bd59608ec0d1eed8d664d69))

## 1.15.7 (2020-10-05)

### Bug Fixes

- **connect:** use authOrigin from authOptions ([e6602a8](https://github.com/blockstack/ux/commit/e6602a8a559158d3ecf92268495176619d1f340e))

## 1.15.6 (2020-10-05)

### Bug Fixes

- remaining broken sidecar urls, fixes [#615](https://github.com/blockstack/ux/issues/615) ([4c26fce](https://github.com/blockstack/ux/commit/4c26fcea34c1603e4ea63d1be7b576b9ccb45a42))

## 1.15.5 (2020-09-29)

### Bug Fixes

- update node api url ([7c71cc7](https://github.com/blockstack/ux/commit/7c71cc7fd47cdb5626d618be70c953f3bfb9d7f7))

## 1.15.4 (2020-09-25)

### Bug Fixes

- add yarn.lock ([24d88d5](https://github.com/blockstack/ux/commit/24d88d5a29d2a4d3d8acee5ce70cd5ecb3c997c4))

## 1.15.3 (2020-09-16)

### Bug Fixes

- keychain lib still broken ([1a7fd0c](https://github.com/blockstack/ux/commit/1a7fd0ced01a6ec8bdd31bf84140728e4b1d7e30))

## 1.15.2 (2020-09-10)

### Bug Fixes

- **keychain:** use correct filepath when writing profiles ([fa8098a](https://github.com/blockstack/ux/commit/fa8098ae13973dd5e53303a4b04967a956d8842b))

## 1.15.1 (2020-08-21)

**Note:** Version bump only for package @blockstack/app

# [1.15.0](https://github.com/blockstack/ux/compare/@blockstack/app@1.14.0...@blockstack/app@1.15.0) (2020-08-21)

### Bug Fixes

- keychain version ([e1618f6](https://github.com/blockstack/ux/commit/e1618f61b18490e87760b810766beab38e7ef16f))
- rpc-client version ([83cf48b](https://github.com/blockstack/ux/commit/83cf48b679fa0938f6550c02472a97400dd009bf))
- **app:** use BigNum for fungible post condition amount ([633ac80](https://github.com/blockstack/ux/commit/633ac801b9a0f2f17eadd2dd302b8c4c235233de))

### Features

- change copy of intro modal CTA, fixes [#466](https://github.com/blockstack/ux/issues/466) ([6b64222](https://github.com/blockstack/ux/commit/6b64222fc31ab5af4b9807ae280101039388b223))
- dont use popups in mobile, adds method to handle redirect auth ([450f58b](https://github.com/blockstack/ux/commit/450f58bcb5c3431d6b1ac649d19f319da34d9f7f))

# [1.14.0](https://github.com/blockstack/ux/compare/@blockstack/app@1.13.5...@blockstack/app@1.14.0) (2020-08-11)

### Bug Fixes

- dont have selected address when canceling reuse, fixes [#454](https://github.com/blockstack/ux/issues/454) ([27f8f61](https://github.com/blockstack/ux/commit/27f8f616549ef9acc1e121f1fda9a40f8a142898))
- prevent auto-zoom of sign in field, fixes [#510](https://github.com/blockstack/ux/issues/510) ([eea3219](https://github.com/blockstack/ux/commit/eea3219c2de0925b7dd34a5f9fe2e5f6adb0ddc4))
- show correct secret key on home screen, fixes [#517](https://github.com/blockstack/ux/issues/517) ([e14afcf](https://github.com/blockstack/ux/commit/e14afcf036ef25d45a541005aa9bb88cd218f4ab))
- show loading when reusing account, fixes [#464](https://github.com/blockstack/ux/issues/464) ([19fbf4e](https://github.com/blockstack/ux/commit/19fbf4efdc5755d26587ca01f225557082d61701))

### Features

- add button to get extension ([f0ba354](https://github.com/blockstack/ux/commit/f0ba3545226886f928b01dbf2fb2e3e620ac5bf3))

## 1.13.5 (2020-07-30)

### Bug Fixes

- reset text-align within connect modal, fixes [#458](https://github.com/blockstack/ux/issues/458) ([aecc700](https://github.com/blockstack/ux/commit/aecc70016809c3750d5cde730db4aeaffd52bb98))

## 1.13.4 (2020-07-28)

**Note:** Version bump only for package @blockstack/app

## 1.13.3 (2020-07-28)

### Bug Fixes

- cursor pointer on dont show this again, fixes [#508](https://github.com/blockstack/ux/issues/508) ([fe4dcf4](https://github.com/blockstack/ux/commit/fe4dcf418526289685687ad9f4526cd45db85410))

## 1.13.2 (2020-07-27)

### Bug Fixes

- **connect:** pass all data to token ([3f46f60](https://github.com/blockstack/ux/commit/3f46f600cccfeadca381574b2b493709b4bba590))

## 1.13.1 (2020-07-24)

### Bug Fixes

- send to sign in when using showBlockstackConnect, fixes [#507](https://github.com/blockstack/ux/issues/507) ([d7698e8](https://github.com/blockstack/ux/commit/d7698e839e44177e56617701d9df0bca5a60924a))

# 1.13.0 (2020-07-24)

### Features

- better bundle size with esmodules ([2c7046f](https://github.com/blockstack/ux/commit/2c7046f70d2ea10ffd973a4ea816a760ffc26952))

## 1.12.1 (2020-07-24)

### Bug Fixes

- force app icon 100% size in connect modal, fixes [#455](https://github.com/blockstack/ux/issues/455) ([4f69f75](https://github.com/blockstack/ux/commit/4f69f75cf7a153c6511cd200e3d1604e5a049226))

# 1.12.0 (2020-07-23)

### Features

- expose connect, app version ([b90a618](https://github.com/blockstack/ux/commit/b90a618fbeaac0ed998ec5ecd10eda8facdc6e10))

## 1.11.6 (2020-07-22)

### Bug Fixes

- docs not building ([d6acb21](https://github.com/blockstack/ux/commit/d6acb21d6e9d6ca171dbbac13a2cc38e7f68b4b9))

## 1.11.5 (2020-07-22)

### Bug Fixes

- workflow syntax for test-app deployment ([976fe54](https://github.com/blockstack/ux/commit/976fe54ee4e0e28833bad515ceccc5fd7f98df3a))

## 1.11.4 (2020-07-22)

**Note:** Version bump only for package @blockstack/app

## 1.11.3 (2020-07-14)

### Bug Fixes

- textStyles not being typed ([2428f69](https://github.com/blockstack/blockstack-app/commit/2428f69ddc39f20c566f2686a65959b59f52e9aa))

## 1.11.2 (2020-07-09)

**Note:** Version bump only for package @blockstack/app

## 1.11.1 (2020-07-09)

**Note:** Version bump only for package @blockstack/app

# 1.11.0 (2020-07-07)

### Features

- add codesandbox ci ([9e903d7](https://github.com/blockstack/blockstack-app/commit/9e903d7141c21503339159255cd06fb6701b1e3b))

## 1.10.5 (2020-06-30)

**Note:** Version bump only for package @blockstack/app

## [1.10.4](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.3...@blockstack/app@1.10.4) (2020-06-30)

**Note:** Version bump only for package @blockstack/app

## [1.10.3](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.2...@blockstack/app@1.10.3) (2020-06-30)

**Note:** Version bump only for package @blockstack/app

## [1.10.2](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.1...@blockstack/app@1.10.2) (2020-06-29)

**Note:** Version bump only for package @blockstack/app

## [1.10.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.10.0...@blockstack/app@1.10.1) (2020-06-24)

### Bug Fixes

- ui version behind published ([8198ca0](https://github.com/blockstack/blockstack-app/commit/8198ca050baa5e7294f99f4521aba78cab7635d8))

# [1.10.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.3...@blockstack/app@1.10.0) (2020-06-24)

### Bug Fixes

- better readme for firefox install ([cbecc86](https://github.com/blockstack/blockstack-app/commit/cbecc86e975a9b758260dbb16e3c29a938717d60))
- connect version was behind published ([2d7633e](https://github.com/blockstack/blockstack-app/commit/2d7633e8b842cf231f10c2ea032de3bcd67258ff))
- create secret key link not working, [#436](https://github.com/blockstack/blockstack-app/issues/436) ([c5870f5](https://github.com/blockstack/blockstack-app/commit/c5870f5422c49c754943eba70d7cc5285fc0ea01))
- home page alignment, [#440](https://github.com/blockstack/blockstack-app/issues/440) ([06dde15](https://github.com/blockstack/blockstack-app/commit/06dde15a651f901222650c015c75f8c1343068b6))
- keychain package was behind published version ([acbd4b0](https://github.com/blockstack/blockstack-app/commit/acbd4b064db61a60f01ce60ab75f9f2f39456eb8))
- remove unused perms from manifest ([52abc1f](https://github.com/blockstack/blockstack-app/commit/52abc1fc91396dd04d322894a18ed257f2a13864))
- tweaks to get extension working ([e068dce](https://github.com/blockstack/blockstack-app/commit/e068dcec1eca8c30375564a748ff3df4f0e8c715))
- use async dispatch, fixes [#441](https://github.com/blockstack/blockstack-app/issues/441) ([b097348](https://github.com/blockstack/blockstack-app/commit/b0973483dac295747cd511af87e42d3b5e156185))

### Features

- add variants to username error state ([19b603b](https://github.com/blockstack/blockstack-app/commit/19b603ba4ba40b42f2d0a9d99cf274af1c3eaf20))

## [1.9.3](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.2...@blockstack/app@1.9.3) (2020-06-10)

**Note:** Version bump only for package @blockstack/app

## [1.9.2](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.1...@blockstack/app@1.9.2) (2020-06-07)

### Bug Fixes

- better handling for mobile and blocked popups ([3151863](https://github.com/blockstack/blockstack-app/commit/31518632bf91c6217734c21c1163ae076f22368a))

## [1.9.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.9.0...@blockstack/app@1.9.1) (2020-05-21)

**Note:** Version bump only for package @blockstack/app

# [1.9.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.8.0...@blockstack/app@1.9.0) (2020-05-15)

### Bug Fixes

- **app:** routing bug when trying to create new key, fixes [#381](https://github.com/blockstack/blockstack-app/issues/381) ([66f78aa](https://github.com/blockstack/blockstack-app/commit/66f78aaf64c3dd38555173ba68ca49ef9445bb53))

### Features

- use window.location for ios redirect ([9d83fc9](https://github.com/blockstack/blockstack-app/commit/9d83fc916e029d437f6a2e8af9b19b734f4aa3ac))

# [1.8.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.7.0...@blockstack/app@1.8.0) (2020-05-06)

### Features

- codebox and highlighter ([b9056f8](https://github.com/blockstack/blockstack-app/commit/b9056f8102eff8d32898201717a3cd3699234561))

# [1.7.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.6.1...@blockstack/app@1.7.0) (2020-04-30)

### Bug Fixes

- clear onboarding path on sign out [#341](https://github.com/blockstack/blockstack-app/issues/341) ([f0820c9](https://github.com/blockstack/blockstack-app/commit/f0820c999143f8a00d89bcc04ecef0fa1699b5f1))
- document.title bug [#335](https://github.com/blockstack/blockstack-app/issues/335), caused by invalid redux hydration ([882fdd6](https://github.com/blockstack/blockstack-app/commit/882fdd6bfcb34e1ff1caed114065dc7b7b228e4d))
- document.title undefined, fixes [#335](https://github.com/blockstack/blockstack-app/issues/335) ([378b903](https://github.com/blockstack/blockstack-app/commit/378b903af1d0c66eed499d4ddba951b3a62bb658))
- dont show secret key when logged out, [#340](https://github.com/blockstack/blockstack-app/issues/340) ([355d518](https://github.com/blockstack/blockstack-app/commit/355d518c545527337db8efad3038bf65544e5a33))
- missing app icon on username error, [#338](https://github.com/blockstack/blockstack-app/issues/338) ([7296f63](https://github.com/blockstack/blockstack-app/commit/7296f63c91d53bbc06fdc995d672c0c978c76adf))
- ts error with react-router import ([8ecef0f](https://github.com/blockstack/blockstack-app/commit/8ecef0fbd537666c66f1f41bf85371b8ca80d166))

### Features

- remove secret key branding, [#334](https://github.com/blockstack/blockstack-app/issues/334) ([e57c8bc](https://github.com/blockstack/blockstack-app/commit/e57c8bc84540b352078e56f19cada41ba0ef6904))

## [1.6.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.6.0...@blockstack/app@1.6.1) (2020-04-17)

### Bug Fixes

- profile info not set in authResponse ([9e48475](https://github.com/blockstack/blockstack-app/commit/9e4847544e89dc1c8abcebeda6d34dc2bf8a4c7f))

# [1.6.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.5.1...@blockstack/app@1.6.0) (2020-03-12)

### Features

- send user back into unfinished onboarding flow ([5ccda3c](https://github.com/blockstack/blockstack-app/commit/5ccda3c278e0caac7b4669a193b8e62209fda543))

## [1.5.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.5.0...@blockstack/app@1.5.1) (2020-03-12)

### Bug Fixes

- hide icon in ScreenHeader if missing ([75d0682](https://github.com/blockstack/blockstack-app/commit/75d06824fa47aa660772b185723d5882934e3633))

# [1.5.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.4.1...@blockstack/app@1.5.0) (2020-03-12)

### Features

- improve accessibility of connect modal, links ([74352c7](https://github.com/blockstack/blockstack-app/commit/74352c74b5894fa2a612a20f00c02d9f8791a5c2))

## [1.4.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.4.0...@blockstack/app@1.4.1) (2020-03-12)

### Bug Fixes

- send to sign-in if sendToSignIn, even if path = sign-up ([b397ff3](https://github.com/blockstack/blockstack-app/commit/b397ff39d6a78cb7ae4a7364b5ba4fcf1ee51163))

# [1.4.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.3.0...@blockstack/app@1.4.0) (2020-03-10)

### Features

- add ability to view secret key ([440c3e5](https://github.com/blockstack/blockstack-app/commit/440c3e5420321e1a3bcfe409cf65b44fe45e1330))

# [1.3.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.2.0...@blockstack/app@1.3.0) (2020-03-10)

### Features

- use stats package for metrics ([710f1fc](https://github.com/blockstack/blockstack-app/commit/710f1fca0a3fc8ad4aaed75ec828ddb815b1483b))

# [1.2.0](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.1.2...@blockstack/app@1.2.0) (2020-03-10)

### Bug Fixes

- dont require built ui to build connect ([c354be7](https://github.com/blockstack/blockstack-app/commit/c354be7bae0937dbcfdbfbb971f1f85a0a6057a9))

### Features

- implementation of router ([bd03411](https://github.com/blockstack/blockstack-app/commit/bd034112a098868d07e04dc6aba97d15145707d1))

## [1.1.2](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.1.1...@blockstack/app@1.1.2) (2020-03-10)

**Note:** Version bump only for package @blockstack/app

## [1.1.1](https://github.com/blockstack/blockstack-app/compare/@blockstack/app@1.1.0...@blockstack/app@1.1.1) (2020-03-10)

**Note:** Version bump only for package @blockstack/app

# 1.1.0 (2020-03-10)

### Bug Fixes

- 16px below app icon ([4097510](https://github.com/blockstack/blockstack-app/commit/4097510df66c28343782af3cb558348689bb9b36))
- add account loading/transition, fixes [#163](https://github.com/blockstack/blockstack-app/issues/163) ([fbd063c](https://github.com/blockstack/blockstack-app/commit/fbd063c740698d0269d3f6cd862a112a9fb082b7))
- Add hover action to '<Account/>' list ([c405989](https://github.com/blockstack/blockstack-app/commit/c405989b071adc070463a2047e9e7ae6751e974b))
- add spacing below title, fixes [#139](https://github.com/blockstack/blockstack-app/issues/139) and [#234](https://github.com/blockstack/blockstack-app/issues/234) ([336a235](https://github.com/blockstack/blockstack-app/commit/336a23562f4f5d769d6c0e846afac79c9e8b29ae))
- adjust task names, add bootstrap task ([099038f](https://github.com/blockstack/blockstack-app/commit/099038f26e6664a6de9a64c86dfb24eb03d94a31))
- Alignment of the onboarding create screen, Closes [#136](https://github.com/blockstack/blockstack-app/issues/136) ([7e16aa5](https://github.com/blockstack/blockstack-app/commit/7e16aa52f207146ef01bd5698bedfdb3eaf978db))
- All uses of seed phrase ([c9e32a2](https://github.com/blockstack/blockstack-app/commit/c9e32a2d7ba302c4669dcbfe416fa4be86dcd8e3))
- app name undefined on create screen ([d8930dd](https://github.com/blockstack/blockstack-app/commit/d8930ddaf5a7b157bf17fed134da0c861adc8125))
- change button sizes to lg ([9465556](https://github.com/blockstack/blockstack-app/commit/9465556a49dc73ba1e947c06ce196b486d8f34e5))
- choose account after sign in with key, fixes [#156](https://github.com/blockstack/blockstack-app/issues/156) ([432ab82](https://github.com/blockstack/blockstack-app/commit/432ab8236e9b135c836986e92292faf6dcd01469))
- choose account hover styles ([e924b04](https://github.com/blockstack/blockstack-app/commit/e924b04e9ad38b46353667b50d3eca87b30965eb))
- dont show warning if app already used, closes [#188](https://github.com/blockstack/blockstack-app/issues/188) ([93e110a](https://github.com/blockstack/blockstack-app/commit/93e110a0f357b756e66546d13061176370583d54))
- Ensure key input trims whitespace, Closes blockstack/connect[#66](https://github.com/blockstack/blockstack-app/issues/66) ([5dc347f](https://github.com/blockstack/blockstack-app/commit/5dc347f79024b452ef1440e58701e05b77beb3e3))
- Ensure page events are tracked ([e64396f](https://github.com/blockstack/blockstack-app/commit/e64396fc2688d0cb62f14a8aa515b826907f9da8))
- Error message, Closes [#169](https://github.com/blockstack/blockstack-app/issues/169) ([02e7c46](https://github.com/blockstack/blockstack-app/commit/02e7c46b5d5522c165c0b045e375b75df2ca8ca2))
- ErrorLabels not formatted properly, Closes [#159](https://github.com/blockstack/blockstack-app/issues/159) ([981dab6](https://github.com/blockstack/blockstack-app/commit/981dab62c445e537cc5ee0df7ec1522b5eeb2a11))
- hard-coded "Messenger" in secret key page ([bfc0848](https://github.com/blockstack/blockstack-app/commit/bfc084809ff0e03ac588592d9c041e37fdfee21a))
- Input/Textarea fields autocapitalizing on iOS, Closes [#180](https://github.com/blockstack/blockstack-app/issues/180) ([45ec252](https://github.com/blockstack/blockstack-app/commit/45ec25224633ea8cfaa43cd57377e23138b4fd64))
- long usernames text-align: left, fixes [#174](https://github.com/blockstack/blockstack-app/issues/174) ([0939f99](https://github.com/blockstack/blockstack-app/commit/0939f99efedb4ed9555df7d2ec742fbdadd8a3b9))
- magic recovery code flow getting stuck ([500fdeb](https://github.com/blockstack/blockstack-app/commit/500fdebfad77cb7690f6ba17dd2822c96c439aa7))
- Prevent zoom on focus by increasing fontsize, Closes [#183](https://github.com/blockstack/blockstack-app/issues/183) ([4044c1b](https://github.com/blockstack/blockstack-app/commit/4044c1ba9a72ef03d402fa9fb27ae14c346c62bc))
- proper title tracking, [#201](https://github.com/blockstack/blockstack-app/issues/201) ([b715c8b](https://github.com/blockstack/blockstack-app/commit/b715c8b3eac8fdef953252e74912fdfdc36a68e3))
- Remove resize and spellchecking from all inputs/textareas, Closes [#153](https://github.com/blockstack/blockstack-app/issues/153) ([a0eff88](https://github.com/blockstack/blockstack-app/commit/a0eff8825ebe12dd0a66e713aeed823137eb9f04))
- remove undefined ([a50bcb4](https://github.com/blockstack/blockstack-app/commit/a50bcb492db9d5561e04b992d04c4cd931714b23))
- Remove username placeholder ([c6d6258](https://github.com/blockstack/blockstack-app/commit/c6d62587e01848d6a3fe66813157fd1038c42ec5))
- screens with inputs will now submit on return, fixes: [#147](https://github.com/blockstack/blockstack-app/issues/147), [#160](https://github.com/blockstack/blockstack-app/issues/160) ([31cbbe4](https://github.com/blockstack/blockstack-app/commit/31cbbe4df8e5a50744e2eaad0f9e18ee4f16fde0))
- sign in flows dont change screen properly ([3c162cd](https://github.com/blockstack/blockstack-app/commit/3c162cd8d9de84ece62b663d53003806e154fd1f))
- spacing on collapse component ([0541cba](https://github.com/blockstack/blockstack-app/commit/0541cba80df697541f4590cd7768dd7617c5c4c2))
- textarea height and title ([60df34a](https://github.com/blockstack/blockstack-app/commit/60df34a44fdcbe694f3db3809a8f89567e59e038))
- Tracking ([#111](https://github.com/blockstack/blockstack-app/issues/111)) ([4babe6b](https://github.com/blockstack/blockstack-app/commit/4babe6bd4235367ec09b43270b960d07dda41b23))
- typo ([5c40890](https://github.com/blockstack/blockstack-app/commit/5c40890f41678150fe3dee92aa67101326e552a3))
- update type for button mode prop ([3f8ad2f](https://github.com/blockstack/blockstack-app/commit/3f8ad2f15a6f2784b3440acf3265f991726fe8eb))
- validate that seed is not empty on sign in, fixes [#170](https://github.com/blockstack/blockstack-app/issues/170) ([e0ea149](https://github.com/blockstack/blockstack-app/commit/e0ea14909bad5b7f428a835953eb01230fa709f1))
- Visual glitches with account warning dialog ([ca2224b](https://github.com/blockstack/blockstack-app/commit/ca2224b9a034f01181dc905baca77a623bc74d22))

### Features

- add CI, proper connections between packages ([5934829](https://github.com/blockstack/blockstack-app/commit/5934829a40338ac269b80783912c8dad17af1962))
- Add identity validation and availability to the auth flow ([3f51783](https://github.com/blockstack/blockstack-app/commit/3f51783d33373cb815121a55772d751fe2c09504))
- add keychain logic to restore identities ([e2a18d6](https://github.com/blockstack/blockstack-app/commit/e2a18d6036327efe403892eeec721ad9951c8983))
- add link back to Secret Key page, Closes [#168](https://github.com/blockstack/blockstack-app/issues/168) ([5ed74c7](https://github.com/blockstack/blockstack-app/commit/5ed74c7cd417994667b325cf4ca96a3fd23c7ed4))
- Add loading spinner when selecting account, Closes [#96](https://github.com/blockstack/blockstack-app/issues/96) ([386235d](https://github.com/blockstack/blockstack-app/commit/386235d6ec7dd7dc62286e0bd16fe3a44448c7cf))
- add proper page tracking to first page ([89b9f5d](https://github.com/blockstack/blockstack-app/commit/89b9f5d5bd52550e1d8b53a06302ed708060df2a))
- Add validation to seed entry field ([#63](https://github.com/blockstack/blockstack-app/issues/63)) ([6a34531](https://github.com/blockstack/blockstack-app/commit/6a345311037f61d19992284065696631c42f3f84))
- Add write key segment ([8ff9be7](https://github.com/blockstack/blockstack-app/commit/8ff9be77b1494f44a69e890c5d4b2c724ad7e00b))
- adds appURL to onboarding store ([5085bb0](https://github.com/blockstack/blockstack-app/commit/5085bb0072c8640110b12ebf8e8d98bdd1928dcb))
- adds screen changed event ([b1600b6](https://github.com/blockstack/blockstack-app/commit/b1600b6e41a70d39f92a9818eb203d6941e81b6b))
- implement basic homepage ([10ac702](https://github.com/blockstack/blockstack-app/commit/10ac70200e769ae91544073e75347e9d1de33e81))
- Layout closer to designs, created <ExplainerCard /> ([#68](https://github.com/blockstack/blockstack-app/issues/68)) ([52f4fe7](https://github.com/blockstack/blockstack-app/commit/52f4fe75f93676e35d6986246262acf1eb6a6c2f))
- more detailed events to username ([5cc323b](https://github.com/blockstack/blockstack-app/commit/5cc323b4ba7b122e7f5a60dfee422b3ca7f21942))
- more events, mostly around choosing an account ([a1f7401](https://github.com/blockstack/blockstack-app/commit/a1f7401b226fe2ae196d8dadc8c4d3711fada998))
- move changing screen into analytics hook ([0be47b5](https://github.com/blockstack/blockstack-app/commit/0be47b54619f9bb0bd859b14ce6e253017cd1e03)), closes [#130](https://github.com/blockstack/blockstack-app/issues/130)
- move doTrack into hook, [#130](https://github.com/blockstack/blockstack-app/issues/130) ([6b1d390](https://github.com/blockstack/blockstack-app/commit/6b1d390e5f4ac36fd1aeb5d28f53daa9b8ae0bce))
- prompt password managers earlier in flow, closes [#224](https://github.com/blockstack/blockstack-app/issues/224) ([12a6772](https://github.com/blockstack/blockstack-app/commit/12a6772fa86096687bcdc5801ea46f7ab42985ee))
- **app:** hide default domain placeholder during onboarding ([8a12763](https://github.com/blockstack/blockstack-app/commit/8a12763d65112626766630ff915e3ae802fe82ef)), closes [#221](https://github.com/blockstack/blockstack-app/issues/221) [#220](https://github.com/blockstack/blockstack-app/issues/220)
- move username screen to the end, closes [#110](https://github.com/blockstack/blockstack-app/issues/110) ([942379b](https://github.com/blockstack/blockstack-app/commit/942379b3c7de757d20bc43b85e5ed426cc086691))
- Page title changes between screens, Closes [#149](https://github.com/blockstack/blockstack-app/issues/149) ([e1373d8](https://github.com/blockstack/blockstack-app/commit/e1373d8c657e861d71d19311d6426f1c37c2a7d1))
- remove auto username generation ([b160f2b](https://github.com/blockstack/blockstack-app/commit/b160f2b05613118cc920d2344defa06b45ce214e))
- remove connect screen at end of onboarding ([42c8958](https://github.com/blockstack/blockstack-app/commit/42c895838786c6843113409148c0e6b263e96e0e))
- show error page when username registration fails ([fd457c6](https://github.com/blockstack/blockstack-app/commit/fd457c60f7081ee44c7fa7ae2cb3ab06070293c2))
- slight speedup on final auth transition ([6fb56a8](https://github.com/blockstack/blockstack-app/commit/6fb56a89181cdb99d4b20d27066647dd93f46fcb))
- use .id.blockstack subdomain, fixes [#123](https://github.com/blockstack/blockstack-app/issues/123) ([59d3087](https://github.com/blockstack/blockstack-app/commit/59d3087654bb52396d242467cab897621dce3f6c))
- **onboarding:** update branding, copy ([7b4f6ac](https://github.com/blockstack/blockstack-app/commit/7b4f6ac43f5764626bd59608ec0d1eed8d664d69))
