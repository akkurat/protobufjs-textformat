"use strict";

const assert = require('assert') , fs = require('fs');

const ProtoBuf = require('protobufjs');

const sut = require('..');

describe('parse', function() {
  it('should successfully load the basic prototype text format', async function() {
    const fqn = 'caffe.NetParameter';
    const input = fs.readFileSync('./test/basic.prototxt', 'utf-8');
    
    const root = await (new ProtoBuf.Root()).load('./test/caffe.proto', { keepCase: true })
    const result = sut.parse(root, fqn, input)
      , message = result.message;

    assert.equal(true, result.status);
    assert.equal('FlickrStyleCaffeNet', message.name);
    assert.equal(1, message.layers.length);
    assert.equal('data', message.layers[0].name);
    assert.equal('IMAGE_DATA', message.layers[0].type);
  });
});


describe('parse googlefont', function() {
  it('should successfully load the basic googlefont pb text format', async function() {
    const fqn = 'google.fonts_public.FamilyProto';
    const input = fs.readFileSync('./test/METADATA.pb', 'utf-8');
    
    const root = await (new ProtoBuf.Root()).load('./test/fonts_public.proto', { keepCase: true })
    const result = sut.parse(root, fqn, input), message = result.message;

    assert.equal(true, result.status);
    assert.equal('Roboto', message.name);
    assert.equal('italic', message.fonts[1].style);
    assert.equal(75.0, message.axes[0].min_value);
    assert.equal('wght', message.axes[1].tag);
  });
});

