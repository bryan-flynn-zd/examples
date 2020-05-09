const ChatMessage = require('./chatMessage')

class MutationUpdateAgentStatus extends ChatMessage {

  constructor(webSocket, messageMap) {

    super(webSocket, messageMap, 'updateAgentStatus')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `mutation {
                    updateAgentStatus(status: ONLINE) {
                      node {
                        id
                        display_name
                      }
                    }
                  }`
        }
      }

  }

  // Override base class method. Return agent's ID.
  messageSucceeded(data) {
    console.log(`[${this.name}] Success. Message ID: ${this.id}. Message payload: ${JSON.stringify(data)}`)
    const agent = {
      id: data.payload.data.updateAgentStatus.node.id,
      name: data.payload.data.updateAgentStatus.node.display_name
    }
    this.promiseResolve(agent)
    this.messageMap.delete(this.id)
  }
}

module.exports = MutationUpdateAgentStatus
