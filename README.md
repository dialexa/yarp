YARP (Yet Another Request-Promise)
==================================

[![NPM](https://nodei.co/npm/yarp.png)](https://nodei.co/npm/yarp/)

There is a glut of promise-based wrappers around the awesome `request` module (https://github.com/request/request).

This is yet another one.

Overly Simple:

```javascript
var yarp = require('yarp');

yarp({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/users',
}).then(function(resp){           // resolves if statusCode < 300
  console.log(resp);
}).catch(function(err){           // rejects with object otherwise
  if(err.statusCode) {            // server responded with statusCode >= 300
    console.log(err.statusCode);
    console.log(err.message);     // if the server gave a message as part of its response
    console.log(err.data);        // the data received from the server (if present)
    console.log(err.request);     // the original request options
  } else {                        // internal client error
    console.log(err)
  }
}).done();
```
