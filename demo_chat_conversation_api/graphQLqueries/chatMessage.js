// The crypto package is included with Node.js.
const crypto = require("crypto")

class ChatMessage {

  constructor(webSocket, messageMap, name) {
    this.name = name
    // Alternate ID form with date embedded. Commas used to separate because period in date format.
    // this.id = this.name + ',' + ChatMessage.getUniqueID() + ',' + (new Date()).toISOString()
    this.id = this.name + '.' + ChatMessage.getUniqueID()
    this.webSocket = webSocket
    this.messageMap = messageMap
    this.messageMap.set(this.id, this)
  }

  static getUniqueID() {
    return crypto.randomBytes(8).toString("hex")
  }

  sendMessage() {
    this.webSocket.send(JSON.stringify(this.graphQlMessage))
    console.log(`[${this.name}] Request sent`)

    this.promiseResolve = null
    this.promiseRejected = null
    return new Promise((resolve, reject) => {
                 this.promiseResolve = resolve
                 this.promiseRejected = reject
               })
  }

  messageSucceeded(data) {
    // Resolve Promise
    console.log(`[${this.name}] Success. Message ID: ${this.id}. Message payload: ${JSON.stringify(data)}`)
    this.promiseResolve(this.id)
    
    // Remove from Map
    this.messageMap.delete(this.id)
  }

  messageFailed(data) {
    console.error(`[${this.name}] Fail. Message ID: ${this.id}. Errors: ${JSON.stringify(data)}`)
    this.promiseRejected(this.id)
    this.messageMap.delete(this.id)
  }
}

module.exports = ChatMessage
