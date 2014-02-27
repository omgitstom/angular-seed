var restify = require('restify'),
	util = require('util')
	stormpath = require('./stormpath/lib/stormpath');

var apiKey = {id: '34USPVUATE8KX180ICLUT03CO', 
			  secret: 'PHz3f+g33b4ZGsTwtKNCht78Az3iJ7pY20DJ97Dv/X8'},
	client = null, 
	server = null;


//Only create a server if we can get the current tenant
client = stormpath.createClient({apiKey: apiKey});

client.getCurrentTenant(function (err, tenant) {
 	if (err) throw err;
 	server = restify.createServer();

 	server.get('/hello/:name', handleRequest);
 	server.head('/hello/:name', handleRequest);

 	server.listen(8080, function() {
  		console.log('%s listening at %s', server.name, server.url);
	});
});


var handleRequest = function (req, res, next){
	res.send('hello ' + req.params.name);
};