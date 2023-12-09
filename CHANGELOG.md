# [2.1.0](https://github.com/dyte-in/symbl-transcription/compare/v2.0.0...v2.1.0) (2023-12-09)


### Bug Fixes

* **incompatible-sample-rate:** wireless devices with 16000hz were not working ([e9ee3d1](https://github.com/dyte-in/symbl-transcription/commit/e9ee3d180df4b254b1639227d872793e9ec3b27b))
* export function typo ([6bc8aac](https://github.com/dyte-in/symbl-transcription/commit/6bc8aacb8115a6c61ffc1ddca740ed602abc0abe))
* semantic release ([5c9ff60](https://github.com/dyte-in/symbl-transcription/commit/5c9ff60353aeb363b5671c728da147b339197d19))


### Features

* **connectionid-speakeruserid-support:** added support for passing userId & connectionId ([293099d](https://github.com/dyte-in/symbl-transcription/commit/293099df03cb1be995f0d492d483947ad7bdebba))
* **message-id-support:** added message id support with a quick test setup ([22802a1](https://github.com/dyte-in/symbl-transcription/commit/22802a1fb0b5c4c53f89e80c0d2f2372b753b18f))
* **sample-demo:** added demo files to perform a quick demo without having to setup Dyte fully ([17b64c6](https://github.com/dyte-in/symbl-transcription/commit/17b64c6d4ee8e7eb79c6142afd313241cb55bd70))

## [2.0.1-staging.1](https://github.com/dyte-in/symbl-transcription/compare/v2.0.0...v2.0.1-staging.1) (2023-02-11)


### Bug Fixes

* export function typo ([6bc8aac](https://github.com/dyte-in/symbl-transcription/commit/6bc8aacb8115a6c61ffc1ddca740ed602abc0abe))

# [2.0.0](https://github.com/dyte-in/symbl-transcription/compare/v1.1.2...v2.0.0) (2022-09-01)


### Documentation

* **readme:** added readme as per new design ([821aab3](https://github.com/dyte-in/symbl-transcription/commit/821aab305db149ef3a0eddd71950fd6ec3e5f261))


### Features

* **languagecodesupport:** added symbl language support code, it doesn't work as expected however ([e37ba1d](https://github.com/dyte-in/symbl-transcription/commit/e37ba1d343e0e78d01cdc22e34c486c64d01f368))
* **transactionlistenonlysupport:** added support for users who would only listen ([dee36e3](https://github.com/dyte-in/symbl-transcription/commit/dee36e3671d238b991fdd88440409f02ebcf5f45))


### BREAKING CHANGES

* **readme:** New functionality forces the user to make 2 function calls instead of 1 to achieve
the same result

# [2.0.0-staging.1](https://github.com/dyte-in/symbl-transcription/compare/v1.1.2...v2.0.0-staging.1) (2022-08-05)


### Documentation

* **readme:** added readme as per new design ([821aab3](https://github.com/dyte-in/symbl-transcription/commit/821aab305db149ef3a0eddd71950fd6ec3e5f261))


### Features

* **languagecodesupport:** added symbl language support code, it doesn't work as expected however ([e37ba1d](https://github.com/dyte-in/symbl-transcription/commit/e37ba1d343e0e78d01cdc22e34c486c64d01f368))
* **transactionlistenonlysupport:** added support for users who would only listen ([dee36e3](https://github.com/dyte-in/symbl-transcription/commit/dee36e3671d238b991fdd88440409f02ebcf5f45))


### BREAKING CHANGES

* **readme:** New functionality forces the user to make 2 function calls instead of 1 to achieve
the same result

## [1.1.2](https://github.com/dyte-in/symbl-transcription/compare/v1.1.1...v1.1.2) (2022-06-23)


### Bug Fixes

* **transcriptionscallback:** changed return type to void instead of object ([6bf1f41](https://github.com/dyte-in/symbl-transcription/commit/6bf1f418a50a1122c497f666fd69d94c88951174))

## [1.1.1](https://github.com/dyte-in/symbl-transcription/compare/v1.1.0...v1.1.1) (2022-06-23)


### Bug Fixes

* **readme:** fixed readme file and added more context ([b4f7182](https://github.com/dyte-in/symbl-transcription/commit/b4f7182e7096400a1c6e5d686b4534f82602050c))
* **readme:** fixing readme file to have proper callback function ([ebd5f1a](https://github.com/dyte-in/symbl-transcription/commit/ebd5f1a3ba78c15ba5c0b29bb64a99378ef03e44))

# [1.1.0](https://github.com/dyte-in/symbl-transcription/compare/v1.0.2...v1.1.0) (2022-06-23)


### Features

* **callbacksupport:** added callback support for transcriptions ([57292a6](https://github.com/dyte-in/symbl-transcription/commit/57292a6f9a906c233ded4af59aa58f8929e03ef0))

## [1.0.2](https://github.com/dyte-in/symbl-transcription/compare/v1.0.1...v1.0.2) (2022-06-17)


### Bug Fixes

* **readme:** Fixed typos ([ac11966](https://github.com/dyte-in/symbl-transcription/commit/ac1196677fc45fa6b27c0b5253702a05a6bb8804))

## [1.0.1](https://github.com/dyte-in/symbl-transcription/compare/v1.0.0...v1.0.1) (2022-06-15)


### Bug Fixes

* **prepublish:** added prepublish file for release versioning ([00efe19](https://github.com/dyte-in/symbl-transcription/commit/00efe197901f138fb98e1054d397c744cd467eec))

# 1.0.0 (2022-06-15)


### Bug Fixes

* **ghrandreadme:** fixed GHR workflow and readme file ([190e6e9](https://github.com/dyte-in/symbl-transcription/commit/190e6e96d8449d35c495b483a9a0445c272ba506))
* **package:** added proper git url and packages ([2ecd7a4](https://github.com/dyte-in/symbl-transcription/commit/2ecd7a43bfec855a6cf90ab948f4d265ca9ff468))
* **package:** using dyte in instead of dyte sdk to fix import issues ([9430d2d](https://github.com/dyte-in/symbl-transcription/commit/9430d2d768813c9ef681448f93ca27e461ad02dc))
* **transcript:** Fixed some structure issues and userId checks ([ae02f02](https://github.com/dyte-in/symbl-transcription/commit/ae02f02ea5461bdc3d27d28aa47a03ccb8fd4cc4))
* **transcriptstructure:** removed unnecessary directory & changes typescript version ([4c714c1](https://github.com/dyte-in/symbl-transcription/commit/4c714c1292939617c0da5421cc6fefae30aa4113))


### Features

* **audiomiddleware:** Added symbl ai transcription middleware ([cf2d0b2](https://github.com/dyte-in/symbl-transcription/commit/cf2d0b20f1b48fcee57b1c3f0fa7ce5ee07d74ec))
* **huskycommitizen:** added husky commitizen and linting and build checks ([1767467](https://github.com/dyte-in/symbl-transcription/commit/176746758845bd4351ab2aec4dfb308beb60ee8d))
* **transcriptions:** Moved from DyteClient to DyteParticipant for broadcast events ([d4664fc](https://github.com/dyte-in/symbl-transcription/commit/d4664fcf4a8fc1c5b7c386ced2dc4fb7879afccf))
