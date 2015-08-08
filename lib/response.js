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

// - -------------------------------------------------------------------- - //

var Response = factory.createClass({

  inherits: events.EventEmitter,

  // new Response(worker Worker, id String)
  constructor: function(worker,id) {
    this.worker = worker;
    this.id = id;
  },

  send: {

    // .send() :void
    0: function() {
      this.worker.send({
        id: this.id,
        response: this.data,
      });
      this.emit("send");
    },

    // .send(data Object) :void
    1: function(data) {
      this.data = data;
      this.send();
    },

  },

});

// - -------------------------------------------------------------------- - //

module.exports = Response;

// - -------------------------------------------------------------------- - //
