# Demo - top_bar app responding to sidebar app events

Demonstrates autoLoad:false feature, which is used when creating/responding to an app's events, but not displaying anything.  

autoLoad:false makes the app easier to maintain and keeps overhead down by not maintaining HTML/iframes that aren't necessary.  

This demo shows:  
* Setting up events on locations that use autoLoad:false
* Sending events from one location to another
* Preloading top_bar location in background location using invoke('preloadPane')

## References
* Inspiration from [Apps framework v2 Instances demo app](https://github.com/zendesk/demo_apps/tree/master/v2/support/instances_sample_app)
