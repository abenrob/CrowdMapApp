# CrowdMapApp
## Introduction
CrowdMapApp is a crowd-sourced mapping application that allows for the collection of points and attributes.

The goal is to create a generic template of a geographic crowd-source application, and allow folks to modify the application to suit their desired content.

## Features
* customizable appearance and point attributes
* no back-end setup or development
* point creation by public users
* ability for user to like existing points (helps avoid users creating clusters of identical points)

## Getting started
This project is designed to deploy via [Backlift](https://www.backlift.com/).
You will need a backlift account and a dropbox account.
When you clone the app, it will build a fresh version and the app will be housed on backlift's servers. Backlift can support it as a 14-day temporary url (that can be re-set every 2 weeks,) or with backlift premium (currently beta) you can create a permanent url.

#### Setting up the app with backlift
Clicking [this link](https://www.backlift.com/backlift/dropbox/create?template=github.com/abenrob/CrowdMapApp&appname=CrowdMapApp "Copy") will build this repo into a clean, functioning app within your backlift account domain - and the code will live in your dropbox.

#### Configuring/Customizing the app
From the backlift dashboard, you can go to the live app, or the app's admin panel.
The admin panel shouldn't need to be modified, as the configurations happen in the app itself.
To configure your site, go to the site itself, click on the gears button in the upper right, and select *configure site*.
From here you can set the site name, 'about modal' header and content, and all the map settings. If the gears don't show up, you need to log into you backlift account - &lt;your new site address&gt;/admin, or the gears from the [backlift dashboard](https://www.backlift.com/dashboard/apps) - the config gears dropdown should show up in your app now.

The map marker icons are pulled from bootstrap glyphicons, and you will need to enter the icon name as it is referenced in the [bootstrap docs](http://twitter.github.io/bootstrap/base-css.html#icons).

The attribute choices you set for your points are a comma-separated list - this is how you can customize the bahavior of the app. When a user creates a point, they will classify the point. This could be a type of point, or a characteristic of the point - depending on your needs.

Want to change the styling of the app? create a custom bootstrap css file (named bootstrap.min.css) and replace the existing one located at /Dropbox/Apps/Backlift/&lt;your new app&gt;/libraries/scripts/bootstrap-2.3.1/css. **-or-** grab a pre-fab stylesheet from [bootswatch](http://bootswatch.com/) (make sure to download the 'bootstrap.min.css' version,) and replace as previously mentioned.
## Roadmap
* Create 'data-dump' tool to allow admin to get csv table of points (with x,y) for import into other tools/applications.
* Use map view to set map center and zoom level for site configuration.
* Allow for users to add comments to a point, in addition to the current ability to like a point.

## Issues
Current known issues:

* Point draw non-functioning on mobile. Need to switch to different draw library.

## Credits
Huge thanks to [Cole](https://github.com/colevscode) at backlift - a really neat platform!
This app is primarily built with backbone.js for data and structure, and [Leaflet.js](http://leafletjs.com/) (+[Leaflet.draw](https://github.com/Leaflet/Leaflet.draw), +[Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster), +[Leaflet.awesome-markers](https://github.com/lvoogdt/Leaflet.awesome-markers)) for mapping.
Also uses [Twitter Bootstrap](http://twitter.github.io/bootstrap/index.html) and [bootstrap-wysihtml5](https://github.com/jhollingworth/bootstrap-wysihtml5/)
