const ChatMessage = require('./chatMessage')

class MutationSendButtonTemplate extends ChatMessage {

  constructor(webSocket, messageMap, channelID) {

    super(webSocket, messageMap, 'sendButtonTemplate')

    // NOTE: You can have at most three buttons.
    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `mutation {
                    sendButtonTemplate(
                      channel_id: "${channelID}",
                      msg: "We have the following options. Which one is your favorite?",
                      buttons: [
                        { 
                          action: {
                            type: QUICK_REPLY_ACTION, value: "B1"
                          },
                          text: "Button1"
                        },
                        {
                          action: {
                            type: QUICK_REPLY_ACTION, value: "B2"
                          },
                          text: "Button2"
                        },
                        { 
                          action: {
                            type: QUICK_REPLY_ACTION, value: "B3"
                          },
                          text: "Button3"
                        }
                      ],
                      fallback: {
                        msg: "We have the following options. Which one is your favorite?"
                        options: [
                            "Button1",
                            "Button2",
                            "Button3"
                        ]
                      }
                    ) {
                      success
                    }
                  }`
        }
      }

  }
}

module.exports = MutationSendButtonTemplate
