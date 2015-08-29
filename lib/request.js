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

var UID = 0;

// - -------------------------------------------------------------------- - //

var Request = factory.createClass({

  inherits: events.EventEmitter,

  // new Request(worker Worker) :Request
  constructor: function(worker) {
    this.id = (UID++).toString(16);
    this.worker = worker;
  },

  send: {

    // .send() :void
    0: function() {
      this.worker.send({
        id: this.id,
        request: this.data,
      });
      this.emit("send");
    },

    // .send(data Object) :void
    o: function(data) {
      this.data = data;
      this.send();
    },

  },

});

// - -------------------------------------------------------------------- - //

module.exports = Request;

// - -------------------------------------------------------------------- - //
