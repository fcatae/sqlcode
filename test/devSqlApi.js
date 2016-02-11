var path = require('path');
var assert = require('assert');
var SQLWebApi = require( path.join(process.cwd(), '/src/sqlapi') ).SQLWebApi;
var SQLAPI = require( path.join(process.cwd(), '/src/sqlapi') );
var request = require('request');

var PORT = 3030;
var SITEURL = 'http://localhost:' + PORT;

describe('SQL API', function() {
    
    describe('Express(Web)', function() {
        before(function StartWebServer() {
            // listen
            SQLWebApi.listen(PORT); 
        });
        
        after(function() {
            SQLWebApi.close();
        })
        
        it('listen port', function(done) {
            geturl('/', function() {
                done(); 
            });
        });

        it('Test ECHO/connection', function(done) {
            var step = 0;
            
            SQLWebApi.attach('/connection', function(req,res) {
                assert(step == 0);
                step = 1;           
                res.end('reply-connection');
            });
            geturl('/connection',function(body) {
                assert(step == 1);
                assert(body == 'reply-connection');
                step = 2;
                done();
            });
        });
        
        it('Test ECHO/request?q={req}', function(done) {
            var step = 0;
            SQLWebApi.attach('/request', function(req,res) {
                assert(step == 0);
                step = 1;           
                res.end('reply-request' + req.query.q);
            });
            geturl('/request?q={req}',function(body) {
                assert(step == 1);
                assert(body == 'reply-request{req}');
                step = 2;
                done();
            });
        });
                        
    }); // web
       
    describe.only('SQL Connection', function() {

        before(function() {
            SQLAPI.init(PORT);
        });
        
        after(function() {
            SQLAPI.close(); 
        });
        
        it('GET /connection', function(done) {
            geturl('/connection',function(body) {
                done();
            });
        });

        it('GET /request?q={req}', function(done) {
            geturl('/request?q=select 1',function(body) {
                var content = JSON.parse(body);
                
                var header = content.header;
                var rows = content.rows;
                
                assert(header && header.length == 1 && header[0].type == 'INT4');
                assert(rows && rows.length == 1 && rows[0].length == 1 && rows[0][0] == '1');
                
                done();
            });
        });
                            
    });
      
});
        
function geturl(url, done) {
    request( SITEURL + url , function (error, response, body) {
        assert(!error && response.statusCode == 200, 'request succeeded: ' + url);        
        done(body);       
    });
}