var request = require('request');
var Promise = require('bluebird');

var internals = {
  convertJSONSafe: function(s){
    if(s && (typeof s === 'string')) {
      try{
        return JSON.parse(s);
      } catch(e){
        return s;
      }
    } else {
      return s;
    }
  }
};

module.exports = function(_options, resolveAll) {
  return new Promise(function(resolve, reject) {
    request(_options, function(err, resp, data) {
      delete _options.auth;
      if (err) {
        err.message += ' while attempting ' + JSON.stringify(_options);
        reject(new Error(err));
      } else if (resolveAll) {
        resolve({
          statusCode: resp.statusCode,
          data: internals.convertJSONSafe(data)
        });
      } else if (resp.statusCode > 399) {
        var msg = null;

        data = internals.convertJSONSafe(data);

        if (data) {
          msg = data.message || data;
        }

        var rej = new Error('"'+JSON.stringify(msg)+'" while attempting ' + JSON.stringify(_options));
        rej.statusCode = resp.statusCode;
        rej.data = data;
        rej.request = _options;

        reject(rej);
      } else {
        resolve(internals.convertJSONSafe(data));
      }
    });
  });
};