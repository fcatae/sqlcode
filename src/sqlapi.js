var path = require('path');
var bodyParser = require('body-parser')
var express = require('express');
var app;
var srv;

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

function define(path, dirname) {
    app.use(path, express.static( dirname ));
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
    define: define,
    attach: attach,
    close: close  
};

// SQL Endpoint
var SqlConnection = require('./endpoint').SqlConnection;
var ErrorOutput = require('./endpoint').ErrorOutput;

var _currentConnection = null;
var _credentials = null;

var SQLEndpoint = {
        
    init: function (port, credentials, api) {
        // provide default implementation
        api = api || this;
        
        SQLWebApi.listen(port);
        SQLWebApi.attach('/connection', api.connectionAPI);
        SQLWebApi.attach('/request', api.requestAPI);
        _credentials = credentials;
    },        
    close: function() {
        SQLWebApi.close();
    },
    connectionAPI: function(req,res) {
        _currentConnection = openConnection(_credentials, function(err, conn) {
            if(err) {
                res.statusCode = 500;
                res.end();
                return;
            }
            _currentConnection = conn;            
            
            // send back connection OK!
            res.end( 'true' );
        });
    },
    requestAPI: function(req,res) {
        var sqltext = req.query.q;
        
        if(_currentConnection != null && sqltext != null ) {
            executeCommand(_currentConnection, sqltext, function(err, dataset) {
                if(err) {
                    res.statusCode = 500;
                    res.end();
                    return;
                }
                                
                // send back dataset
                var content = JSON.stringify(dataset);
                
                res.end(content);                                
            })
        } else {
            res.statusCode = 400;
            res.end();
            return;
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

module.exports = SQLEndpoint; 
module.exports.SQLWebApi = SQLWebApi;
