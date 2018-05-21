# Hide Field

Hides a ticket form field based on user role.

## Reference
* [Modifying _properties_ of ticketFields object](https://developer.zendesk.com/apps/docs/core-api/client_api#client.invokeobj) (versus modifying _value_ of ticket field via [ticket get/set](https://developer.zendesk.com/apps/docs/support-api/ticket_sidebar#ticket.assignee)). i.e.  
  * client.invoke('ticketFields:priority.hide').
  * client.get('ticket.assignee') / client.set('ticket.assignee', { userId: value1, groupId: value2 })  
  

* [Hide ticket fields](https://developer.zendesk.com/apps/docs/support-api/ticket_sidebar#ticketfield.hide)
