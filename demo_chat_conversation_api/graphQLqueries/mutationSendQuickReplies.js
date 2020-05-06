const ChatMessage = require('./chatMessage')

class MutationSendQuickReplies extends ChatMessage {

  constructor(webSocket, messageMap, channelID) {

    super(webSocket, messageMap, 'sendQuickReplies')

    this.graphQlMessage = {
            id: this.id,
            type: "request",
            payload: {
              query: `mutation {
                        sendQuickReplies(
                          channel_id: "${channelID}",
                          msg: "We have the following options. Which one is your favorite?",
                          quick_replies: [
                            {
                              action: {
                                  value: "My favorite is chocolate"
                              },
                              text: "Chocolate"
                            },
                            {
                              action: {
                                  value: "My favorite is vanilla"
                              },
                              text: "Vanilla"
                            },
                            {
                              action: {
                                  value: "My favorite is cookies and cream"
                              },
                              text: "Cookies and cream"
                            },
                            {
                              action: {
                                  value: "My favorite is coconut"
                              },
                              text: "Coconut"
                            },
                            {
                              action: {
                                  value: "My favorite is salted caramel"
                              },
                              text: "Salted caramel"
                            }
                          ],
                          fallback: {
                            msg: "We have the following options. Which one is your favorite?"
                            options: [
                                "Chocolate",
                                "Vanilla",
                                "Cookies and cream",
                                "Coconut",
                                "Salted caramel"
                            ]
                          }
                        )
                        {
                          success
                        }
                      }`
            }
          }
  }
}

module.exports = MutationSendQuickReplies
