# Demonstrate using a remote URL location for a modal.

Requires a running server to reference main app window and modal window.

For this demo to work, the app's server-side location and modal location must be remote URLs *AND* the signedURLs feature must be turned on for both locations.

SETUP:  
1. Setup locally running server (see README.md in ../server directory)  
2. Once server is running, package and upload the ticket_sidebar app to your Zendesk instance.  
3. In your browser, select 'Load unsafe scripts' (Chrome) or 'Disable protection' (Firefox) to allow for 'mixed content' from your server (see https://gist.github.com/bryan-flynn-zd/d22d96c4a43fe717b9cba236dfcbe225).

DEMO:  
Once your local server is running, your app has been uploaded, and you've enabled 'mixed content' in your browser, click the 'Display Modal' button in the ticket_sidebar app.

A modal should be displayed with something like:
>POST: MODAL Welcome John Smith from myzendesksubdomain.zendesk.com!  
>call count: 3

See also:
https://developer.zendesk.com/apps/docs/support-api/modal
