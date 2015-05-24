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

var Request = factory.class({

  inherits: events.EventEmitter,

  // new Request(worker)
  constructor: function(worker) {
    this.id = factory.guid();
    this.worker = worker;
  },

  send: {

    // .send()
    0: function() {
      this.worker.send({
        id: this.id,
        request: this.data,
      });
      this.emit("send");
    },

    // .send(data)
    1: function(data) {
      this.data = data;
      this.send();
    },

  },

});

// - -------------------------------------------------------------------- - //

module.exports = Request;

// - -------------------------------------------------------------------- - //
