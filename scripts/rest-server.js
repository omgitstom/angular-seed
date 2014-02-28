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
 	server.use(restify.bodyParser());

 	var handleRequest = function (req, res, next){
		tenant.dataStore.getResource("https://api.stormpath.com/v1/applications/" + appId, null, Application, function(err, obj){
			if (err || !req.params.email || !req.params.password) {
				res.send(400, err)
			}
			obj.login(req.params.email, req.params.password, function (err, obj){
				if(err){
					res.send(400, err);
				}else{
					res.send(200, obj.account);
				}
			});
		});
	};

	var handleSignup = function (req, res, next){
		client.createResource(
			"https://api.stormpath.com/v1/applications/"+appId+"/accounts",
			null,
			{
				email:req.params.email,
				givenName:req.params['first-name'],
				surname:req.params['last-name'],
				password:req.params.password,
				customData:{
					companyName:req.params.org,
					tos: req.params.tos
				}
			},
			function(err, account){
				res.send(200, account);
			}
		);
	};

	var handleSendPasswordReset = function (req, res, next){
		tenant.dataStore.getResource("https://api.stormpath.com/v1/applications/"+ appId, null, Application, function(err, obj){
			if (err) throw err;
			obj.resetPassword(req.params.email, function (err, obj){
				if (!err){
					res.send(200, obj);
				}else{
					res.send(404, err);
				}
				
			});
		});
	};

	var handleResetPassword = function (req, res, next){
		tenant.dataStore.getResource("https://api.stormpath.com/v1/applications/"+ appId, null, Application, function(err, obj){

			obj.passwordReset(req.params.sptoken, function(err, temp){
				if (!err){
					tenant.dataStore.getResource(temp.account.href, function(err, account){
						account.password = req.params.password;
						account.save(function (err, savedAccount){
							if(!err){
								res.send(200, savedAccount);
							}else{
								res.send(err.code, err);
							}
						});
					});
				}else{
					res.send(err.code, err);
				}
			});
		});
	};

	//Routes to handlers
 	server.post('/login/', handleRequest);
 	server.post('/signup/', handleSignup);
 	server.post('/resetPassword/', handleSendPasswordReset);
 	server.post('/passwordReset/', handleResetPassword);

 	//Static files
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



