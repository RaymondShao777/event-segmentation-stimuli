Client-server implementation of UCLA LCD lab event segmentation study.

## Usage

### Install some global packages

`npm install -g live-server pm2`

### Setup Server

Run the following command under server folder
- Install packages: `npm install`
- Start server in the background: `pm2 start app.js --name "event-segmentation-server"`

### Setup Client

Run the following command under client folder
- Install packages: `npm install` 
- Start the client in the background as well: `pm2 start live-server --name "event-segmentation-client"`

NOTE: a bit confused about the setup... the whole app should be the "server" side. 

### Check the status
Run `pm2 list` should display all running processes in the background. Make you are forwarding the port 8080 (used by the client) and set the visibility to public. 

To kill the process, use `pm2 kill`.