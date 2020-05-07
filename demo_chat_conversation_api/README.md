# [Chat Conversations API](https://developer.zendesk.com/rest_api/docs/chat/conversations-api) demo

This Node.js based script is a refactored version of the sample app referenced in [Getting started with the Chat Conversations API](https://develop.zendesk.com/hc/en-us/articles/360001331787) and located [here](https://codesandbox.io/s/51rorvmwx).

### Demo design

* Messages sent by the process are [JavaScript Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) based
* Each [Chat Conversations API GraphQL](https://zendesk.github.io/conversations-api/mutation.doc.html) query used is encapsulated into a JavaScript class. New classes can be added as needed.

The script requires `npm install` of the "[ws](https://github.com/websockets/ws)" and "[superagent](https://github.com/visionmedia/superagent)" packages. Read the comments at the top of the script for more information.

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
     * sendMessage
     * sendButtonTemplate
     * sendQuickReplies
     * transferToDepartment
     * updateAgentStatus
* Text "commands" visitor can enter that trigger and demonstrate different API actions. See code for implementation details.
    * "send ordered" - demos sending a series of ordered messages
    * "get agents" - retrieves list of chat agents
    * "what ice cream flavor" - demos 'quick replies' [structured message](https://support.zendesk.com/hc/en-us/articles/360022184394#topic_vgt_z1s_jgb)
    * "button me" - demos 'button template' structured message
    * "invite agent" - invites another agent to existing chat
    * "transfer" - transfers existing chat to a department

### Disclaimer

This code is only for demo purposes. This code is not guaranteed to work and is not supported by Zendesk. If the approach is of interest, additional error handling should be considered.
