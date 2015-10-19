// add EventSource dependency
var EventSource = require('eventsource');
// add json patch dependency
var JsonPatch   = require('fast-json-patch');

function server() {
  // define variables
  var eventSource = null;

  // initialize data 
  var data = [];

  function connect() {

	// building the URL to get your API streamed as follow:

    // targetUrl is the JSON API you wish to stream
	// you can use this example API which simulates updating stocks prices from a financial market
    var targetUrl = 'http://demo-streamdataio.rhcloud.com/stockmarket/prices';

	// appToken is the way Streamdata.io authenticates you as a valid user.
	// you MUST provide a valid token for your request to go through.
    var appToken = '[YOUR_STREAMDATAIO_APP_TOKEN]';

	// finally the url you will request is composed as follow
	// the call to your target API is made through https://streamdata.motwin.net/ proxy
    var url = 'https://streamdata.motwin.net/' + targetUrl + '?X-Sd-Token=' + appToken;

	// simply use the eventsource API to get connected
    var eventSource = new EventSource(url);


	// add callbacks to react to EventSource events

	// the standard 'open' callback will be called when connection is established with the server
    eventSource.addEventListener('open', function() {
    	console.log("connected!");
    });

	// the standard 'error' callback will be called when an error occur with the evenSource
	// for example with an invalid token provided
    eventSource.addEventListener('error', function(e) {
      console.log('ERROR!', e);
      eventSource.close();
    });

	// the streamdata.io specific 'data' event will be called when a fresh Json data set 
    // is pushed by Streamdata.io coming from the API
    eventSource.addEventListener('data', function(e) {
      console.log("data: \n" + e.data);
      // memorize the fresh data set
      data = e.data;
    });

	// the streamdata.io specific 'patch' event will be called when a fresh Json patch 
    // is pushed by streamdata.io from the API. This patch has to be applied to the 
	// latest data set provided.
    eventSource.addEventListener('patch', function(e) {
      // display the patch
      console.log("patch: \n" + e.data);
      // apply the patch to data using json patch API
      JsonPatch.apply(data, JSON.parse(e.data));
      // do whatever you wish with the update data
      // console.log(data);
    });


  }

  connect();
}

console.log('starting');
server();

