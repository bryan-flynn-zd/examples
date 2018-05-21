# App Notify Send/Receive Event Demo

Following the below, you'll get two new apps loaded into your Zendesk instance.

The first app sends a notification event, along with some data, to another app. 

The second app receives the event and its data and displays it.

**Setup:**

Create the 'Receive' app first:

1. `cd v2_sample_notifyreceive`
2. Run `zat create` and enter your admin and test instance information
3. Run `cat .zat` -- write down the app_id value

Create the 'Send' app:  

4. `cd v2_sample_notifysend`
5. Edit assets\iframe.html and change a couple of values...
6. Enter Receive's `app_id` value
7. Either enter a valid `agent_id` or remove `agent_id` (don't forget to remove the preceding comma from the JSON object if you remove `agent_id`)
8. `zat create`

Do a refresh of your Apps and click the Send app's 'send' button. You should see the current date and time show up in the Receive app's display.

# Reference
* https://developer.zendesk.com/rest_api/docs/core/apps#send-notification-to-app  
* https://developer.zendesk.com/apps/docs/apps-v2/api_reference#client.onname-handler-context
