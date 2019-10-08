# Test getting and setting Zendesk Apps framework metadata

## Getting
Uses [client.metadata()](https://developer.zendesk.com/apps/docs/core-api/client_api#client.metadata)

## Setting
Uses [PUT /api/v2/apps/installations/{id}.json API](https://developer.zendesk.com/rest_api/docs/support/apps#update-app-installation)

## NOTE:
* Despite the app's setting being updated, because these values are cached, you need to do an app refresh to get the new values.