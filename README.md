node-bauer-cluster-queue
================

This is a plugin for `bauer-cluster` to add request queue feature. You should take a look at [bauer-cluster](https://github.com/yneves/node-bauer-cluster) before using it.

## Installation

```
npm install bauer-cluster-queue
```

## Usage

This plugin should be loaded by the `Cluster` object before calling `.start` method.

```js
var cluster = require("bauer-cluster");

cluster.require("bauer-cluster-queue");

cluster.master(function() {});
cluster.worker(function(worker) {});

cluster.start();
```

## Worker

### .config.slots

This configuration defines how many concurrent requests the worker can handle. Above the specified number, requests are queued until slots become available. Defaults to `1`. This should be configured at the child process.

```js
worker.configure({
  slots: 10,
});
```

### .request

Sends a request to the other side. Normally its used by the parent process to send requests to the child process, but it can go both ways. Requests can be of any type that can be go through IPC. You can pass a callback which will be called once when the response comes. It returns a `Request` object.

```js
var request = worker.request({ read: "path" });
request.on("response",function(data) {});
// same as
worker.request({ read: "path"},function(data) {});
```

Also, its possible to create an empty requests and send it later. Just like this.

```js
var request = worker.request();
request.on("response",function(data) {});
request.send({ read: "path" });
```

### Event "request"

Emitted when a request is ready to be handled. It means that a slot is occupied by this request and will only be freed when a response is sent. It gets the request's content and the response object as arguments.

```js
worker.on("request",function(request,response) {
  try {
    // do something with the request and then send a response
    response.send({ ok: true });
  } catch(error) {
    response.send({ ok: false, error: error.toString() });
  }
});
```

### Event "response"

Emitted when a response comes back from the other side, just after the `response` event of the `Request` object. It makes possible to handle all responses at a single point.

```js
worker.on("response",function(request,response) {
  if (!response.ok) {
    console.log(response.error);
  }
});
```


## License

MIT
