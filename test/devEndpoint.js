var path = require('path');

describe('Endpoint SQL', function() {
    
    var _endpoint;
    
    it('import endpoint', function() {
        _endpoint = require( path.join(process.cwd(), '/src/endpoint') );
    });
})