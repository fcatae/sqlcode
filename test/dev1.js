"use strict";

var assert = require('assert');
var path = require('path');
var fs = require('fs');

describe('Parser XML', function() {

    
    var _parser;
    var _xmltext;
    var _sax;
    
    before(function Load_ParserAndText() {
        _sax = require( path.join(process.cwd(), '/lib/sax') )
        _parser = require( path.join(process.cwd(), '/src/xmlparser') ).init(_sax);
        _xmltext = fs.readFileSync( path.join(process.cwd(), '/test/ringbuffer.xml') );
    });
    
    it('Importar o parser', function() {
        assert.notEqual(_parser, null);
    });

    it('Carregar o XML', function() {
        assert.notEqual(_xmltext, null);
        assert( _xmltext.length > 0 );
    });

    it('Carregar a dependência SAX', function() {
        _sax = require(path.join(process.cwd(), 'lib/sax'));
        assert.notEqual(_sax, null);
    });

//     it('Processar tag RingBuffer', function() {
//         var text = '<RingBufferTarget eventCount="0"></RingBufferTarget>';
//         
//         var resultJson = _parser.parse(text);
//         
//         assert(resultJson != null, "empty result");
//         assert(resultJson.ringbuffertarget != null, "empty result");                
//     });

    // it('Teste2', function() {
    // });



    // it('Teste2', function() {
    // });
    
});
