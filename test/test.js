// - -------------------------------------------------------------------- - //
// - libs

var cp = require("child_process");
var assert = require("assert");
var clusterModule = require("bauer-cluster");
var clusterQueue = require("../");

// - -------------------------------------------------------------------- - //

describe("Queue",function() {
  
  it ("proto",function() {
    assert.strictEqual(typeof clusterModule.Worker.prototype.setupQueue,"function");
    assert.strictEqual(typeof clusterModule.Worker.prototype.queue,"function");
    assert.strictEqual(typeof clusterModule.Worker.prototype.request,"function");
  });

  it("queue",function(done) {
    var proc = cp.spawn("node",[__dirname + "/sample/sample.js"],{ stdio: "pipe" });
    var output = "";
    proc.stdout.on("data",function(data) {
      output += data.toString("utf8");
    });
    var error = "";
    proc.stderr.on("data",function(data) {
      error += data.toString("utf8");
    });
    proc.on("exit",function() {
      assert.equal(error,"");
      assert.equal(output,"request.1response.2request.3response.4request.5response.6request.7response.8request.9response.10request.11response.12request.13response.14request.15response.16request.17response.18request.19response.20master.exit");
      done();
    });
  });

});

// - -------------------------------------------------------------------- - //
