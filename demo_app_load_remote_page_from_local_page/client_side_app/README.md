# Redirect to Remote Pages From Local Pages

This app demonstrates how to redirect to a remote page that is stored as an app setting.

For testing, run a local HTTP server against the supplied static HTML files.

Using Node, here are steps to setup a lightweight server:

```
npm install -g light-server
nodenv rehash
cd <into your static html pages folder>
light-server -s . -b localhost -p 8080
```
You can then load your static pages:
`http://localhost:8080/yourfile.html`

