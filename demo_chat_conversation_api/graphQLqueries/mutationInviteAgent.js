const ChatMessage = require('./chatMessage')

class MutationInviteAgent extends ChatMessage {

  constructor(webSocket, messageMap, channelID, agentID) {

    super(webSocket, messageMap, 'inviteAgent')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `mutation {
                    inviteAgent(
                      agent_id: "${agentID}",
                      channel_id: "${channelID}",
                      leave: true
                    ) {
                      success
                    }
                 }`
        }
      }

  }
}

module.exports = MutationInviteAgent
