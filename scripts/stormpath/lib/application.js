'use strict';
var util = require('util');
var InstanceResource = require('./resource').InstanceResource;

function Application(){
	Application.super_.apply(this, arguments);
}

util.inherits(Application, InstanceResource);

Application.prototype.login = function login(username, password, callback){
	var _this = this;
	console.log(username, password);
	var base64uidpassword = new Buffer(username+":"+password).toString('base64');
	this.dataStore.createResource(_this.loginAttempts.href+"?expand=account", {
		type: 'basic',
		value: base64uidpassword
	}, callback);
}

module.exports = Application;