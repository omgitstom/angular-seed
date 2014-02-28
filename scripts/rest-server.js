var restify = require('restify'),
	util = require('util')
	stormpath = require('./stormpath/lib/stormpath'),
	Application = require('./stormpath/lib/application');

var apiKey = {id: '34USPVUATE8KX180ICLUT03CO', 
			  secret: 'PHz3f+g33b4ZGsTwtKNCht78Az3iJ7pY20DJ97Dv/X8'};

appId = '5jaB29lf9fanIBTywhEIne';

//Only create a server if we can get the current tenant
client = stormpath.createClient({apiKey: apiKey});

client.getCurrentTenant(function (err, tenant) {
 	if (err) throw err;

 	server = restify.createServer();

 	var handleRequest = function (req, res, next){
 		href = tenant.href + "/applications/"+ appId;
		tenant.dataStore.getResource("https://api.stormpath.com/v1/applications/5jaB29lf9fanIBTywhEIne", null, Application, function(err, obj){
			if (err) throw err;
			obj.login("tom@abbott.com", "TomAbbott1", function (err, obj){
				console.log(err, obj);
			});
		});
	};

 	server.get('/login/', handleRequest);

 	server.get(/.*/, restify.serveStatic({
  		directory: './app/',
  		default: 'index.html'
	}));
	server.get(/.*/, restify.serveStatic({
  		directory: './bower_components/',
  		default: 'index.html'
	}));
 	server.listen(8080, function() { 
  		console.log('%s listening at %s', server.name, server.url);
	});

});



