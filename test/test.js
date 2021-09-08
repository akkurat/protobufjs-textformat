"use strict";

var assert = require('assert')
  , fs = require('fs');

var ProtoBuf = require('protobufjs');

var sut = require('..');

describe('parse', function() {
  it('should successfully load the basic prototype text format', async function() {
    var fqn = 'caffe.NetParameter';
    var input = fs.readFileSync('./test/basic.prototxt', 'utf-8');
    
    var builder = await (new ProtoBuf.Root()).load('./test/caffe.proto', { keepCase: true })
    var result = sut.parse(builder, fqn, input)
      , message = result.message;

    assert.equal(true, result.status);
    assert.equal('FlickrStyleCaffeNet', message.name);
    assert.equal(1, message.layers.length);
    assert.equal('data', message.layers[0].name);
    assert.equal('IMAGE_DATA', message.layers[0].type);
  });
});

