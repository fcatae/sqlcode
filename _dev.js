"use strict";

var assert = require('assert');
var path = require('path');
var fs = require('fs');

describe('Parser XML', function() {

    var _parser;
    var _xmltext;
    
    before(function Load_ParserAndText() {
        _parser = require( path.join(process.cwd(), '/src/xmlparser') );
        _xmltext = fs.readFileSync( path.join(process.cwd(), '/test/ringbuffer.xml') );
    });
    
    it('Importar o parser', function() {
        assert.notEqual(_parser, null);
    });

    it('Carregar o XML', function() {
        assert.notEqual(_xmltext, null);
        assert( _xmltext.length > 0 );
    });

    // it('Teste2', function() {
    // });

    // it('Teste2', function() {
    // });



    // it('Teste2', function() {
    // });
    
});
