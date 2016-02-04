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

    it('Processar tag RingBuffer simples', function() {
        var text = '<RingBufferTarget eventCount="0"></RingBufferTarget>';
        
        var resultJson = _parser.parse(text);
        
        assert(resultJson != null, "empty result");
        assert(resultJson.count != null, "empty result");                
    });

    it('Processar tag RingBuffer com Eventos', function() {
        var text = '<RingBufferTarget eventCount="2"> \
            <event name="sp_statement_completed" package="sqlserver" \
            timestamp="2016-02-02T12:39:47.375Z"></event> \
            <event name="sp_statement_completed" package="sqlserver" \
            timestamp="2016-02-02T12:39:47.375Z"></event> \
            </RingBufferTarget>';

        var resultJson = _parser.parse(text);
        
        assert(resultJson != null, "empty result");
        assert(resultJson.events != null, "empty result");
        assert.equal(resultJson.count, 2, "attrib should be exactly 2");                
        assert.equal(resultJson.events.length, 2, "array should have exactly 2 events");                
    });

    it('Validar que é possível ter diferentes números de atributos e elementos', function() {
        var text = '<RingBufferTarget eventCount="511"> \
            <event name="sp_statement_completed" package="sqlserver" \
            timestamp="2016-02-02T12:39:47.375Z"></event> \
            <event name="sp_statement_completed" package="sqlserver" \
            timestamp="2016-02-02T12:39:47.375Z"></event> \
            </RingBufferTarget>';

        var resultJson = _parser.parse(text);
        
        assert(resultJson != null, "empty result");
        assert(resultJson.events != null, "empty result");
        assert.equal(resultJson.count, 511, "attrib should be exactly 511");                
        assert.equal(resultJson.events.length, 2, "array should have exactly 2 events");                
    });
    
    it('Verificar o uso de Strings e Buffers', function() {
        
        var stringType = "<RingBufferTarget></RingBufferTarget>";
        _parser.parse(stringType);     
            
        var bufferType = new Buffer("<RingBufferTarget></RingBufferTarget>");
        _parser.parse(bufferType);
              
    })
    
    it('Processar arquivo ringbuffer.xml', function() {
        var text = _xmltext;
        var resultJson = _parser.parse(text);
        
        assert(resultJson != null, "empty result");
        assert(resultJson.events != null, "empty result");
        assert.equal(resultJson.count, 10, "attrib should be exactly 10");                
        assert.equal(resultJson.events.length, 10, "array should have exactly 10 events");                
    });
    
    it('Validar elementos do ringbuffer.xml', function() {
        var text = _xmltext;
        var resultJson = _parser.parse(text);
        
        var expectedArray = ['sql_batch_completed', 'error_reported',
            'error_reported', 'sp_statement_completed', 'rpc_completed',
            'error_reported', 'error_reported', 'sql_statement_completed', 
            'sql_batch_completed', 'sql_statement_completed'];

        var actualArray = resultJson.events.map(function(evento) {
           return evento.name; 
        });
        
        assert( expectedArray.length == actualArray.length, "same length");
        
        expectedArray.map(function(elem,i) {
           assert( expectedArray[i] == actualArray[i], "same elements" ); 
        });
    })
    
});
