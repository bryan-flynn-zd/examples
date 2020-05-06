const ChatMessage = require('./chatMessage')

class MutationUpdateAgentStatus extends ChatMessage {

  constructor(webSocket, messageMap) {

    super(webSocket, messageMap, 'updateAgentStatus')
    this.graphQlMessage = {
      id: this.id,
      type: "request",
      payload: {
        query: `mutation {
                  updateAgentStatus(status: ONLINE) {
                    node {
                      id
                    }
                  }
                }`
      }
    }
  }
}

module.exports = MutationUpdateAgentStatus