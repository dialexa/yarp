var chai = require('chai');
var expect = chai.expect;
var nock = require('nock');
chai.use(require('chai-as-promised'));

var yarp = require('..');

describe('Yarp', function(){
  it('should export a function', function(){
    expect(yarp).to.be.a.Function;
  });

  describe('resolve only on success', function(){

    it('should resolve with the response data for a valid url', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, {
        foo: 'bar'
      });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(resp){
        expect(resp).to.deep.equal({foo: 'bar'});
        get.done();
      });
    });

    it('should parse JSON from a valid JSON string', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, '{"foo": "bar"}', {
       'Content-Type': 'text'
     });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(resp){
        expect(resp).to.deep.equal({foo: 'bar'});
        get.done();
      });
    });

    it('should resolve with a String if the response is not JSON', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, 'This is not json', {
       'Content-Type': 'text'
     });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(resp){
        expect(resp).to.deep.equal('This is not json');
        get.done();
      });
    });


    it('should resolve the promise if the status code is 2XX and data is empty', function(){
      var get = nock('http://example.com').get('/api/test').reply(204, null);

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(resp){
        expect(resp).to.equal('');
        get.done();
      });
    });

    it('should accept a single string for a GET', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, {
        foo: 'bar'
      });

      return yarp('http://example.com/api/test').then(function(resp){
        expect(resp).to.deep.equal({foo: 'bar'});
        get.done();
      });
    });

    it('should reject the promise if the status code is 4XX', function(){
      var get = nock('http://example.com').get('/api/test').reply(404, {
        message: 'not found'
      });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(){
        throw new Error('Should not have gotten here');
      }).catch(function(err){
        expect(err).to.be.an.Error;
        expect(err).to.have.property('statusCode', 404);
        expect(err).to.have.property('data');
        expect(err.data).to.have.property('message', 'not found');
        expect(err).to.have.property('request');
        get.done();
      });
    });

    it('should parse json data for a valid url', function(){
      var get = nock('http://example.com').get('/api/test').reply(404, {
        message: 'not found'
      });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test',
        json: true
      }).then(function(){
        throw new Error('Should not have gotten here');
      }).catch(function(err){
        expect(err).to.be.an.Error;
        expect(err).to.have.property('statusCode', 404);
        expect(err).to.have.property('data');
        expect(err.data).to.have.property('message', 'not found');
        expect(err).to.have.property('request');
        get.done();
      });
    });

    it('should reject if the status code is 5XX and the response is not JSON', function(){
      var get = nock('http://example.com').get('/api/test').reply(500, "this is not json", {
       'Content-Type': 'text'
     });
      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(){
        throw new Error('Should not have gotten here');
      }).catch(function(err){
        expect(err).to.be.an.Error;
        expect(err).to.have.property('message');
        get.done();
      });
    });

    it('should reject the promise if the status code is 5XX', function(){
      var get = nock('http://example.com').get('/api/test').reply(500);

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }).then(function(){
        throw new Error('Should not have gotten here');
      }).catch(function(err){
        expect(err).to.be.an.Error;
        expect(err).to.have.property('statusCode', 500);
        expect(err).to.have.property('data');
        expect(err).to.have.property('request');
        get.done();
      });
    });

    it('should reject the promise if there is an error in the request library', function(){
      return yarp({
        method: 'get',
        url: 'http://///.com/api/test'
      }).then(function(){
        throw new Error('Should not have gotten here');
      }).catch(function(err){
        expect(err).to.be.an.Error;
        expect(err).to.have.property('message');
        expect(err.message).to.match(/Invalid URI/);
      });
    });
  });

  describe('resolve on any response', function(){

    it('should resolve with the response data for a valid url', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, {
        foo: 'bar'
      });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).to.have.property('statusCode', 200);
        expect(resp).to.have.property('data');
        expect(resp.data).to.deep.equal({foo: 'bar'});
        get.done();
      });
    });

    it('should parse JSON from a valid JSON string', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, '{"foo": "bar"}', {
       'Content-Type': 'text'
     });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).to.have.property('statusCode', 200);
        expect(resp).to.have.property('data');
        expect(resp.data).to.deep.equal({foo: 'bar'});
        get.done();
      });
    });

    it('should resolve with a String if the response is not JSON', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, 'This is not json', {
       'Content-Type': 'text'
     });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).to.have.property('statusCode', 200);
        expect(resp).to.have.property('data');
        expect(resp.data).to.deep.equal('This is not json');
        get.done();
      });
    });


    it('should resolve the promise if the status code is 2XX and data is empty', function(){
      var get = nock('http://example.com').get('/api/test').reply(204, null);

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).to.have.property('statusCode', 204);
        expect(resp).to.have.property('data');
        expect(resp.data).to.equal('');
        get.done();
      });
    });

    it('should accept a single string for a GET', function(){
      var get = nock('http://example.com').get('/api/test').reply(200, {
        foo: 'bar'
      });

      return yarp('http://example.com/api/test', true).then(function(resp){
        expect(resp).to.have.property('statusCode', 200);
        expect(resp).to.have.property('data');
        expect(resp.data).to.deep.equal({foo: 'bar'});
        get.done();
      });
    });

    it('should reject the promise if the status code is 4XX', function(){
      var get = nock('http://example.com').get('/api/test').reply(404, {
        message: 'not found'
      });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).not.to.be.an.Error;
        expect(resp).to.have.property('statusCode', 404);
        expect(resp).to.have.property('data');
        expect(resp.data).to.have.property('message', 'not found');
        get.done();
      });
    });

    it('should parse json data for a valid url', function(){
      var get = nock('http://example.com').get('/api/test').reply(404, {
        message: 'not found'
      });

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test',
        json: true
      }, true).then(function(resp){
        expect(resp).not.to.be.an.Error;
        expect(resp).to.have.property('statusCode', 404);
        expect(resp).to.have.property('data');
        expect(resp.data).to.have.property('message', 'not found');
        get.done();
      });
    });

    it('should reject if the status code is 5XX and the response is not JSON', function(){
      var get = nock('http://example.com').get('/api/test').reply(500, "this is not json", {
       'Content-Type': 'text'
     });
      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).not.to.be.an.Error;
        expect(resp.data).to.equal('this is not json');
        get.done();
      });
    });

    it('should reject the promise if the status code is 5XX', function(){
      var get = nock('http://example.com').get('/api/test').reply(500);

      return yarp({
        method: 'get',
        url: 'http://example.com/api/test'
      }, true).then(function(resp){
        expect(resp).not.to.be.an.Error;
        expect(resp).to.have.property('statusCode', 500);
        expect(resp).to.have.property('data');
        get.done();
      });
    });

    it('should reject the promise if there is an error in the request library', function(){
      return yarp({
        method: 'get',
        url: 'http://///.com/api/test'
      }, true).then(function(){
        throw new Error('Should not have gotten here');
      }).catch(function(err){
        expect(err).to.be.an.Error;
        expect(err).to.have.property('message');
        expect(err.message).to.match(/Invalid URI/);
      });
    });
  });
});