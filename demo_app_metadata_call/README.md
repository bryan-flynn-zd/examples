# Test getting and setting Zendesk Apps framework metadata

## Getting
Uses [client.metadata()](https://developer.zendesk.com/apps/docs/core-api/client_api#client.metadata)

## Setting
Uses [PUT /api/v2/apps/installations/{id}.json API](https://developer.zendesk.com/rest_api/docs/support/apps#update-app-installation)

## NOTE:
* Despite the app successfully updating metadata/setting values, because these values are cached by ZAF at app load time, you need to do an app refresh. This reloads the app and gets the updated values via subsequent client.metadata() calls.
* PUT /api/v2/apps/installations/{id}.json API requires administrator rights. Agent level users cannot call this API.