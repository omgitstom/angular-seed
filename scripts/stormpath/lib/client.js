'use strict';

var util = require('util'),
  DataStore = require('./datastore'),
  Tenant = require('./tenant');

function Client(config) {
  this._dataStore = new DataStore(config);
  this._currentTenant = null; //we'll be able to cache this on first call
}
util.inherits(Client, Object);

Client.prototype.getCurrentTenant = function getCurrentTenant(callback) {

  var _this = this;

  //check to see if cached (tenant never changes for a given API Key):
  if (_this._currentTenant) {
    callback(null, this._currentTenant);
    return;
  }

  //not cached - need to look it up (and cache it):
  _this._dataStore.getResource('/tenants/current', Tenant, function onCurrentTenant(err, tenant) {
    if (err) {
      callback(err, null);
      return;
    }
    _this._currentTenant = tenant;
    callback(null, tenant);
  });
};

/**
 * Queries the server for a resource by `href`, providing the result to `callback`.
 *
 * @param {String} href the URI of the resource to acquire - must always be the first argument.
 * @param {Object} query (optional, defaults to `undefined`) name/value pairs to use as query parameters to `href`
 * @param {Function} instanceCtor (optional, defaults to `InstanceResource`) The Constructor function to invoke for any Instance Resource returned by the server.  If the resource returned by the server is a single resource, this function is used to construct the reasource.  If the resource returned by the server is a collection, the `instanceCtor` is used to construct each resource in the collection's `items` field.
 * @param {Function} callback the callback function to invoke with the constructed Resource. The callback's first argument is an `Error` object, the second is the constructed resource.  Must always be the last argument.
 * @return {void} result is provided to `callback`.
 * @method getResource
 * @class Client
 * @version 0.1
 */
Client.prototype.getResource = function getResource() {
  this._dataStore.getResource.apply(this._dataStore, arguments);
};

/**
 * Creates a new resource on the server as a child of the specified `parentHref` location.  `parentHref` must be a collection resource endpoint.
 *
 * @param {String} parentHref the URI of the parent collection under which the new resource will be created as a child - must always be the first argument.
 * @param {Object} query (optional, defaults to `undefined`) name/value pairs to use as query parameters to `parentHref`
 * @param {Object} data the resource (name/value pairs) to send to the server.
 * @param {Function} instanceCtor (optional, defaults to `InstanceResource`)  The Constructor function to invoke for any instance resource returned by the server.  If the request result is a single resource, this function is used to construct the resource.  If the request result is a collection, the `instanceCtor` is used to construct each resource in the collection's `items` field.
 * @param {Function} callback the callback function to invoke with the constructed Resource. The callback's first argument is an `Error` object, the second is the constructed resource. Must always be the last argument.
 * @return {void} result is provided to `callback`.
 * @method createResource
 * @class Client
 * @version 0.1
 */
Client.prototype.createResource = function createResource() {
  this._dataStore.createResource.apply(this._dataStore, arguments);
};

module.exports = Client;