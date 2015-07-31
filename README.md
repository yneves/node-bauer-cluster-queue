# bauer-cluster

Plugin for `bauer-cluster` to add request/response queue functionality.

## Installation

```
npm install bauer-cluster-queue
```

## Usage

```js
var Cluster = require("bauer-cluster").Cluster;

var myCluster = new Cluster();

myCluster.require("bauer-cluster-queue");

myCluster.master(function() {
  
  var worker = this.fork("one","two");

  var request = worker.request({ ping: true });
  
  request.on("response",function(response) {
    
  });

});

myCluster.worker(function(worker) {

  worker.on("request",function(request,response) {
    if (request.ping) {
      response.send({ pong: true });
    }
  });

});

myCluster.start();
```

## License

[MIT](./LICENSE)
