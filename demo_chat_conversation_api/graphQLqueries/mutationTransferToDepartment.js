const ChatMessage = require('./chatMessage')

class MutationTransferToDepartment extends ChatMessage {

  constructor(webSocket, messageMap, channelID, departmentID) {

    super(webSocket, messageMap, 'transferToDepartment')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `mutation {
                    transferToDepartment(
                      channel_id: "${channelID}", 
                      department_id: "${departmentID}"
                    ) 
                    {
                      success
                    }
                  }`
        }
      }

  }
}

module.exports = MutationTransferToDepartment
