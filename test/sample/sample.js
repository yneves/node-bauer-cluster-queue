// - -------------------------------------------------------------------- - //

"use strict";

var mod = require("bauer-cluster");

var cluster = new mod.Cluster();

cluster.require("../../../");

cluster.master(function() {

  var worker = this.fork();

  worker.on("exit",function() {
    process.stdout.write("master.exit");
  });

  worker.on("response",function(req,res) {
    process.stdout.write("response." + res.counter);
    if (res.counter === 20) {
      worker.kill();
    } else {
      worker.request({ counter: res.counter + 1 });
    }
  });

  worker.request({ counter: 1 });

});

cluster.worker(function(worker) {

  worker.on("exit",function() {
    process.stdout.write("worker.exit");
    process.stdout.write(message);
  });

  worker.on("request",function(req,res) {
    process.stdout.write("request." + req.counter);
    res.send({ counter: req.counter + 1 });
  });

});

cluster.start();

// - -------------------------------------------------------------------- - //
