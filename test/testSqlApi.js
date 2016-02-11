var path = require('path');
var assert = require('assert');
var SQLWebApi = require( path.join(process.cwd(), '/src/sqlapi') ).SQLWebApi;
var SQLAPI = require( path.join(process.cwd(), '/src/sqlapi') );
var request = require('request');

var PORT = 3030;
var SITEURL = 'http://localhost:' + PORT;
var config = require( path.join(__dirname, '../', '.config') ).db_server_config;

var _remoteCredentials = {
    username: config.SQLSERVER_USER,
    password: config.SQLSERVER_PWD,
    servername: config.SQLSERVER_SRV,
    database: config.SQLSERVER_DB
};
var _localCredentials = {
    username: 'fabteste',
    password: config.SQLSERVER_PWD,
    servername: 'localhost',
    database: 'master'
}; 
        
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
       
    describe('SQL Connection', function() {

        before(function() {
            SQLAPI.init(PORT, _localCredentials);
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

// POST implementation
// 
// // We need this to build our post string
// var querystring = require('querystring');
// var http = require('http');
// var fs = require('fs');
// 
// function PostCode(path, codestring, callback) {
//   // Build the post string from an object
//   var post_data = querystring.stringify({
//       'request' : codestring
//   });
// 
//   // An object of options to indicate where to post to
//   var post_options = {
//       host: 'localhost',
//       port: '3000',
//       path: path,
//       method: 'POST',
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': Buffer.byteLength(post_data)
//       }
//   };
// 
//   // Set up the request
//   var post_req = http.request(post_options, function(res) {
//       res.setEncoding('utf8');
//       res.on('end', function (chunk) {
//           console.log('close')
//           callback && callback();
//       });
//           
//       res.on('data', function (chunk) {
//           console.log('Response: ' + chunk);
//           callback && callback(chunk);
//       });
//       
//       
//   });
// 
//   // post the data
//   post_req.write(post_data);
//   post_req.end();
// 
// }
// 
// // console.log('PostCode(/getConnection)');
// // PostCode('/getConnection', null, function() {
// // 
// //     console.log('PostCode(/execute)');
// //     PostCode('/execute', 'select * from sys.dm_exec_requests', function(chunk) {
// //         console.log('Response: ' + JSON.stringify (chunk) );
// //     });
// //     
// // });