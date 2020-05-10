# [Chat Conversations API](https://developer.zendesk.com/rest_api/docs/chat/conversations-api) demo

This Node.js based script is a refactored version of the sample app referenced in [Getting started with the Chat Conversations API](https://develop.zendesk.com/hc/en-us/articles/360001331787) and located [here](https://codesandbox.io/s/51rorvmwx).

The Chat Conversations API allows an external service to act as an automated chat agent (or "chat bot"). For all intents and purposes, the external service is a chat agent. The automated chat session has the same abilities and limitations as a  regular chat agent, including authenticating in and using an agent license.

The Chat Conversations API requires a Zendesk Enterprise subscription level. 

### Demo design

* Messages sent by the process are [JavaScript Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based
* Each [Chat Conversations API GraphQL](https://zendesk.github.io/conversations-api/mutation.doc.html) query used is encapsulated into a JavaScript class. New classes can be added as needed.

### Demo setup

1. Install [Node.js 10.x](https://nodejs.org/en/download/) or later. See [Installing Node.js](https://develop.zendesk.com/hc/en-us/articles/360001069167) for one approach on setting up Node.
2. The script requires `npm install` of the "[ws](https://github.com/websockets/ws)" and "[superagent](https://github.com/visionmedia/superagent)" packages. Read the comments at the top of the script for more information.
3. Create a Zendesk Chat OAuth access token with 'read', 'write', and 'chat' scope. See:
    * [Chat API OAuth Authentication](https://developer.zendesk.com/rest_api/docs/chat/auth)
    * [Chat API tutorial: Generating an OAuth token](https://support.zendesk.com/hc/en-us/articles/115010760808)
4. In terminal, run `export CHATAPITOKEN={your_chat_token}`
5. Run script in your terminal window using `node chat_conversation_api_demo_script.js`

Review the GraphQL queries of the different message types and modify to fit your needs. For example, the 'query' value in `subscriptionMessage.js` fetches 'log' information, which you may not need. There may be other fetch/query values, which can be added depending on your requirements.


### What's demonstrated

* Creating authenticated socket connection
* Keep [socket alive](https://develop.zendesk.com/hc/en-us/articles/360001331787#end-of-service-signal) using "PING" message
* [Graph QL Operations](https://graphql.org/learn/queries/#operation-name) demonstrated:
   * [Subscriptions](https://zendesk.github.io/conversations-api/subscription.doc.html)
        * message
        * chatActivity
   * [Queries](https://zendesk.github.io/conversations-api/query.doc.html)
        * agents
        * departments
   * [Mutations](https://zendesk.github.io/conversations-api/mutation.doc.html)
        * startAgentSession
        * inviteAgent
        * listenVisitorChannel
        * sendMessage
        * sendButtonTemplate
        * sendQuickReplies
        * transferToDepartment
        * updateAgentStatus
* Text "commands" visitor can enter that trigger and demonstrate different API actions. See code for implementation details.
    * "send ordered" - demos sending a series of ordered messages
    * "get agents" - retrieves list of chat agents
    * "what ice cream flavor" - demos '[quick replies](https://support.zendesk.com/hc/en-us/articles/360022184394#topic_dbp_z1s_jgb)' structured message
    * "button me" - demos '[button template](https://support.zendesk.com/hc/en-us/articles/360022184394#topic_vgt_z1s_jgb)' structured message
    * "invite agent" - invites/transfers another agent to existing chat
    * "invite but listen" - invites/transfers another agent to existing chat but remains listening
    * "transfer" - transfers existing chat to a department

### Disclaimer

This code is only for demo purposes. This code is not guaranteed to work and is not supported by Zendesk. If the approach is of interest, additional error handling should be considered.
