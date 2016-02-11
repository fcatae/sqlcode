var path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
var app;
var srv;

var _ = require('lodash');

// Server functions

function listen(port) {
    app = express();
    
    // usar o bodyParser=url_encoded
    app.use(bodyParser.urlencoded({ extended: false }))

    // allow cross origin
    // app.use(function (req, res, next) {
    //     res.setHeader('Access-Control-Allow-Origin', '*');
    //     next();
    // });

    app.use(express.static( __dirname ));
    
    srv = app.listen(port);
}

function attach(eventname, func) {
    app.get(eventname, func);
}

function close() {
    srv.close();
    app = null;
    srv = null;
}

var SQLWebApi = {
    listen: listen,
    attach: attach,
    close: close  
};

// SQL Endpoint
var config = require( path.join(__dirname, '../', '.config') ).db_server_config;
var SqlConnection = require('./endpoint').SqlConnection;
var ErrorOutput = require('./endpoint').ErrorOutput;

var _credentials = {
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
        
var _currentConnection = null;

var SQLEndpoint = {
    init: function (port) {        
        SQLWebApi.listen(port);
        SQLWebApi.attach('/connection', this.connectionAPI);
        SQLWebApi.attach('/request', this.requestAPI);
    },        
    close: function() {
        SQLWebApi.close();
    },
    connectionAPI: function(req,res) {
        _currentConnection = openConnection(_localCredentials, function(err, conn) {
            _currentConnection = conn;            
            // send back connection OK!
            res.statusCode = (conn) ? 200 : 500;
            res.end( conn ? 'true' : 'false');
        });
    },
    requestAPI: function(req,res) {
        var sqltext = 'select 1';
        if(_currentConnection != null) {
            executeCommand(_currentConnection, sqltext, function(err, dataset) {
                console.log("d");
                // send back dataset
            })
        }
    }
};

function openConnection(credentials, done) {
    var conn = new SqlConnection(credentials);
    conn.open(function(err) {
        if(err != null) {
            done(err);
            return;
        }
        done(null, conn);
    })
}

function executeCommand(conn, sqltext, done) {
    conn.execute(sqltext, function(err, dataset) {
        if(err != null) {
            done(err);
            return;
        }
        done(null, dataset);        
    });
}

// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

function PostCode(path, codestring, callback) {
  // Build the post string from an object
  var post_data = querystring.stringify({
      'request' : codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'localhost',
      port: '3000',
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('end', function (chunk) {
          console.log('close')
          callback && callback();
      });
          
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          callback && callback(chunk);
      });
      
      
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

// console.log('PostCode(/getConnection)');
// PostCode('/getConnection', null, function() {
// 
//     console.log('PostCode(/execute)');
//     PostCode('/execute', 'select * from sys.dm_exec_requests', function(chunk) {
//         console.log('Response: ' + JSON.stringify (chunk) );
//     });
//     
// });

module.exports = SQLEndpoint; 
module.exports.SQLWebApi = SQLWebApi;

// module.exports.listen = listen;
// module.exports.attach = attach;
// module.exports.close = close;