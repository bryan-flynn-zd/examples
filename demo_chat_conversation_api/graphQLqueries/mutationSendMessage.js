const ChatMessage = require('./chatMessage')

class MutationSendMessage extends ChatMessage {

  constructor(webSocket, messageMap, channelID, message) {

    super(webSocket, messageMap, 'sendMessage')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `mutation { 
                    sendMessage(
                      channel_id: "${channelID}", 
                      msg: "${message}"
                    ) 
                    {
                      success
                    }
                  }`
        }
      }

  }
}

module.exports = MutationSendMessage
