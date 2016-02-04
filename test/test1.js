var assert = require('assert');

var path = require('path');

describe('Xml Parser', function() {
    it('test1', function() {
        
        var _parser = require( path.join(process.cwd(), '/src/xmlparser') );

        it('Importar o parser', function() {
            assert.notEqual(_parser, null);
        });

        // it('Teste2', function() {
        //     throw "Not implemented";
        // });
    })
})