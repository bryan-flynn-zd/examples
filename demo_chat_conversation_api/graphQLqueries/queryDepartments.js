const ChatMessage = require('./chatMessage')

class QueryDepartments extends ChatMessage {

  constructor(webSocket, messageMap) {

    super(webSocket, messageMap, 'queryDepartments')

    this.graphQlMessage = 
      {
        id: this.id,
        type: "request",
        payload: {
          query: `query {
                    departments {
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

  // Override base class method, to return department list.
  messageSucceeded(data) {
    console.log(`[${this.name}] Success. Message ID: ${this.id}. Message payload: ${JSON.stringify(data)}`)
    let departments = data.payload.data.departments.edges.map(element => {return element.node})
    this.promiseResolve(departments)
    this.messageMap.delete(this.id)
  }
}

module.exports = QueryDepartments
