// - -------------------------------------------------------------------- - //

var cluster = require("bauer-cluster");

cluster.require("../../");

cluster.master(function() {

  var worker = this.fork();

  worker.on("exit",function() {
    process.stdout.write("master.exit");
  });

  worker.on("response",function(req,res) {
    process.stdout.write("response." + res);
    if (res == 20) {
      worker.kill();
    } else {
      worker.request(res + 1);
    }
  });

  worker.request(1);

});

cluster.worker(function(worker) {

  worker.on("exit",function() {
    process.stdout.write("worker.exit")
    process.stdout.write(message);
  });

  worker.on("request",function(req,res) {
    process.stdout.write("request." + req);
    res.send(req + 1);
  });

});

cluster.start();

// - -------------------------------------------------------------------- - //
