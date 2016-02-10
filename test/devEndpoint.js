var path = require('path');
var assert = require('assert');


describe.only('SQL Connection', function() {
    
    var SqlConnection;
    var ErrorOutput;
    var _credentials;
    var _localCredentials;
    var _invalidCredentials;
    
    before(function getEndpoint() {
        SqlConnection = require( path.join(process.cwd(), '/src/endpoint')).SqlConnection;
        ErrorOutput = require( path.join(process.cwd(), '/src/endpoint')).ErrorOutput;
        _credentials = {
            username: process.env.SQLSERVER_USER,
            password: process.env.SQLSERVER_PWD,
            servername: process.env.SQLSERVER_SRV,
            database: process.env.SQLSERVER_DB
        };
        _localCredentials = {
            username: 'fabteste',
            password: process.env.SQLSERVER_PWD,
            servername: 'localhost',
            database: 'master'
        }; 
        _invalidCredentials = {
            username: 'aa',
            password: '',
            servername: process.env.SQLSERVER_SRV,
            database: process.env.SQLSERVER_DB
        };                
    });
    
    it('Create local connection', function(done) {
        var output = new ErrorOutput();
        var conn = new SqlConnection(_localCredentials, output);
        conn.open(function(conn_err) {
            var info = output.info;
            var errors = output.errors;

            assert(conn_err == null);
            assert( errors == null || errors.length == 0);
            
            //Changed database context to 'database'
            //Changed language setting to <language>
            assert(info && info.match(/Changed/));
            
            done();
        })
    });
    
    it('Create remote connection', function(done) {
        var output = new ErrorOutput();
        var conn = new SqlConnection(_credentials, output);
        conn.open(function(conn_err) {
            var info = output.info;
            var errors = output.errors;

            assert(conn_err == null);
            assert( errors == null || errors.length == 0);
                        
            //Changed database context to 'database'
            //Changed language setting to <language>
            assert(info && info.match(/Changed/));
            
            done();
        })
    });

    it('Create an invalid connection', function(done) {
        var output = new ErrorOutput();
        var conn = new SqlConnection(_invalidCredentials, output);
        conn.open(function(conn_err) {
            var info = output.info;
            var errors = output.errors;

            assert(conn_err != null);
            assert( errors == null || errors.length > 0);
            
            done();
        })
    });
    

    
});

describe('Endpoint SQL', function() {
    
    var _endpoint;
    var _credentials;
    
    before(function getEndpoint() {
        _endpoint = require( path.join(process.cwd(), '/src/endpoint') );
        _credentials = {
            username: process.env.SQLSERVER_USER,
            password: process.env.SQLSERVER_PWD,
            servername: process.env.SQLSERVER_SRV,
            database: process.env.SQLSERVER_DB
        };
    });
    
    it('get connection', function(done) {
        _endpoint.getConnection(_credentials, done);        
    });    
    
    it('handle connection error', function(done) {
        _endpoint.getConnection(null, function(err) {
            assert.notEqual(err, null, "open connection must fail");
            done();
        });        
    });
    
})