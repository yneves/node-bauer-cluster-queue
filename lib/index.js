/*!
**  bauer-cluster-queue -- Plugin for bauer-cluster to add request queue feature.
**  Copyright (c) 2014 Yuri Neves Silveira <http://yneves.com>
**  Licensed under The MIT License <http://opensource.org/licenses/MIT>
**  Distributed on <http://github.com/yneves/node-bauer-cluster-queue>
*/
// - -------------------------------------------------------------------- - //

"use strict";

var factory = require("bauer-factory");
var clusterModule = require("bauer-cluster");

clusterModule.Request = require("./request.js");
clusterModule.Response = require("./response.js");

factory.extendClass(clusterModule.Worker,require("./worker.js"));

module.exports = function(clusterInstance) {

  clusterInstance.master(function() {
    clusterInstance.on("fork",function(worker) {
      worker.setupQueue();
    });
  });

  clusterInstance.worker(function(worker) {
    worker.setupQueue();
  });
};

// - -------------------------------------------------------------------- - //
