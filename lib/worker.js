/*!
**  bauer-cluster-queue -- Plugin for bauer-cluster to add request queue feature.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-cluster-queue>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var events = require("events");
var factory = require("bauer-factory");

var Request = require("./request.js");
var Response = require("./response.js");

// - -------------------------------------------------------------------- - //

var ClusterWorker = {

  // .setupQueue() :void
  setupQueue: function() {

    this._busy = 0;
    this._slots = 1;
    this._delay = 0;
    this._queue = [];
    this._pending = {};

    this._listeners = events.EventEmitter.listenerCount(this,"request");

    this.on("newListener",function(event) {
      if (event === "request") {
        if (this._listeners++ === 0) {
          this.flush();
        }
      }
    });

    this.on("removeListener",function(event) {
      if (event === "request") {
        this._listeners--;
      }
    });

    this.on("message",function(message) {
      if (factory.isObject(message) && factory.isString(message.id)) {
        if (factory.isDefined(message.response)) {
          var request = this._pending[message.id];
          if (request) {
            request.emit("response",message.response);
            delete this._pending[message.id];
            this.emit("response",request.data,message.response);
          }
        } else if (factory.isDefined(message.request)) {
          this.queue(message);
        }
      }
    });

  },
  
  flush: {
    
    // .flush() :void
    0: function() {
      if (this._queue.length > 0) {
        setTimeout(function() {
          this.queue(this._queue.shift());
          if (this._listeners > 0 && this._busy < this._slots) {
            this.flush();
          }
        }.bind(this),this._delay);
      }
    }
  },

  queue: {

    // .queue(message Object) :void
    o: function(message) {
      if (this._listeners > 0 && this._busy < this._slots) {
        this._busy++;
        var response = new Response(this,message.id);
        response.on("send",function() {
          this.worker._busy--;
          this.worker.flush();
        });
        this.emit("request",message.request,response);
      } else {
        this._queue.push(message);
      }
    }
  },

  request: {

    // .request() :Request
    0: function() {
      var request = new Request(this);
      request.on("send",function() {
        this.worker._pending[this.id] = this;
      });
      return request;
    },

    // .request(data Object) :Request
    o: function(data) {
      var request = this.request();
      request.send(data);
      return request;
    },

    // .request(data Object, callback Function) :Request
    of: function(data,callback) {
      var request = this.request(data);
      request.once("response",callback);
      return request;
    },

  },

};

// - -------------------------------------------------------------------- - //

module.exports = ClusterWorker;

// - -------------------------------------------------------------------- - //
