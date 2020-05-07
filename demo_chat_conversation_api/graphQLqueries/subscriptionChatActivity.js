const ChatMessage = require('./chatMessage')

class SubscriptionChatActivity extends ChatMessage {

  constructor(webSocket, messageMap) {

    super(webSocket, messageMap, 'chatActivity')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `subscription {
                    chatActivity (filter:{chat_activity_types: [MEMBER_LEAVE, MEMBER_JOIN]})  
                    {
                      node {
                        __typename
                        ... on MemberJoinLog {
                          id
                          user_name
                          user {
                            id
                            display_name
                          }
                        }
                        ... on MemberLeaveLog {
                          id
                          user_name
                          user {
                            id
                            display_name
                          }
                        }
                      }
                    }
                  }`
        }
      }

  }

  // Override base class to return subscription ID.
  messageSucceeded(data) {
    this.chatActivitySubscriptionId = data.payload.data.subscription_id
    console.log(`[${this.name}] Successfully subscribed. Subscription ID: ${this.chatActivitySubscriptionId}`)

    this.promiseResolve(this.chatActivitySubscriptionId)
    this.messageMap.delete(this.id)
  }
}

module.exports = SubscriptionChatActivity
