const ChatMessage = require('./chatMessage')

class MutationListenVisitorChannel extends ChatMessage {

  constructor(webSocket, messageMap, channelID) {

    super(webSocket, messageMap, 'listenVisitorChannel')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `mutation { 
                    listenVisitorChannel(
                      channel_id: "${channelID}"
                    ) 
                    {
                      success
                    }
                  }`
        }
      }

  }
}

module.exports = MutationListenVisitorChannel
