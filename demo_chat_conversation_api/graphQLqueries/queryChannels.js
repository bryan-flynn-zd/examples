const ChatMessage = require('./chatMessage')

class QueryChannels extends ChatMessage {

  constructor(webSocket, messageMap) {

    super(webSocket, messageMap, 'queryChannels')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `query {
                    channels {
                      edges {
                        node {
                          id
                          agents {
                            edges {
                              node {
                                id
                                status
                                display_name
                              }
                            }
                          }
                        }
                      }
                    }
                  }`
        }
      }

  }

  // Override base class method, to return channel list.
  messageSucceeded(data) {
    console.log(`[${this.name}] Success. Message ID: ${this.id}. Message payload: ${JSON.stringify(data)}`)
    let channels = data.payload.data.channels.edges.map(element => {return element.node})
    this.promiseResolve(channels)
    this.messageMap.delete(this.id)
  }
}

module.exports = QueryChannels
