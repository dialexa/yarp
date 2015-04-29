YARP (Yet Another Request-Promise)
==================================

[![npm version](https://badge.fury.io/js/yarp.svg)](http://badge.fury.io/js/yarp)
[![Build Status](https://travis-ci.org/dialexa/yarp.svg)](https://travis-ci.org/dialexa/yarp)

There is a glut of promise-based wrappers around the awesome `request` module (https://github.com/request/request).

This is yet another one.

Overly Simple:

```javascript
var yarp = require('yarp');

yarp({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/users',
}).then(function(resp){           // resolves if statusCode < 400
  console.log(resp);
}).catch(function(err){           // rejects with object otherwise
  if(err.statusCode) {            // server responded with statusCode >= 400
    console.log(err.statusCode);
    console.log(err.message);     // if the server gave a message as part of its response
    console.log(err.data);        // the data received from the server (if present)
    console.log(err.request);     // the original request options
  } else {
    console.log(err)              // internal client error
  }
}).done();
```

As of 0.4.0, you can now pass `true` as a second parameter to have all responses treated as resolution:

```javascript
var yarp = require('yarp');

yarp({
  method: 'GET',
  url: 'http://jsonplaceholder.typicode.com/users',
}, true).then(function(resp){     // resolves for any status code
  console.log(resp.statusCode);   // status code from the response
  console.log(resp.data)          // response from the servdr, parsed if valid JSON
  console.log(resp.body)          // raw response
}).catch(function(err){
  console.log(err)                // rejects with internal client error
}).done();
```