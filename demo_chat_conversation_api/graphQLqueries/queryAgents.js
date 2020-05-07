const ChatMessage = require('./chatMessage')

class QueryAgents extends ChatMessage {

  constructor(webSocket, messageMap) {

    super(webSocket, messageMap, 'queryAgents')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `query {
                    agents {
                      edges {
                        node {
                          id
                          name
                          status
                        }
                      }
                    }
                  }`
        }
      }

  }

  // Override base class method, to return agent list.
  messageSucceeded(data) {
    console.log(`[${this.name}] Success. Message ID: ${this.id}. Message payload: ${JSON.stringify(data)}`)
    let agents = data.payload.data.agents.edges.map(element => {return element.node})
    this.promiseResolve(agents)
    this.messageMap.delete(this.id)
  }
}

module.exports = QueryAgents
