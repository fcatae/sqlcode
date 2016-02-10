var path = require('path');
var assert = require('assert');


describe('SQL Connection', function() {
    
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
            username: '-invalid-login-',
            password: '-invalid-pwd-',
            servername: 'localhost',
            database: '-invalid-database-'
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
        
    describe('SQL Execute', function() {
        
        var _output;
        var _connection;
        
        before(function Open_SqlConnection(done) {
            _output = new ErrorOutput();
            _connection = new SqlConnection(_localCredentials, _output); // _localCredentials _credentials
            _connection.open(done)
        });
        
        it('executeBatch', function(done) {
            var count_header = 0;
            var count_rows = 0;
            
            _connection.executeBatch('SELECT a=1, b=2, c=3; SELECT a=4, b=5, c=6; ', function(h) {
                count_header++;
                assert(h && h.length == 3);
                
            }, function(r) {
                count_rows++;
                assert(r && r.length == 3);
                
            }, function(err,rowcount) {
                assert(err == null);
                assert(rowcount == 2);

                assert(count_header == 2);
                assert(count_rows == 2);
                
                done();
            });
        })
        
        it('execute', function(done) {
            _connection.execute('select a=1', function(err, dataset) {
                assert(dataset.header.length == 1);
                assert(dataset.header[0].name == 'a');

                assert(dataset.rows.length == 1);
                assert(dataset.rows[0] == 1);
                                
                done();
            })
        })
        
        it('select * from sys.dm_exec_requests', function(done) {
            _connection.execute('select * from sys.dm_exec_requests', function(err, dataset) {
                var header = dataset.header;
                
                assert(header['session_id'] != null);
                assert(header['wait_type'] != null);
                assert(header['reads'] != null);
                assert(header['sql_handle'] != null);

                assert(header['query_hash'] != null); // sql 2008

                assert(dataset.rows.length == 1);
                assert(header['session_id'].index == 0);
                assert(header['sql_handle'].index > 0);
                                
                done();
            });
        });

        it('Data types: primitives', function(done) {
            _connection.execute('select * from sys.dm_exec_requests', function(err, dataset) {
                var header = dataset.header;
                var row = dataset.rows[0];
                
                assert(header['session_id'].type == 'INT2' );
                assert(header['request_id'].type == 'INT4' );
                assert(header['row_count'].type == 'INT8' );

                assert(header['start_time'].type == 'DATETIME' );

                assert(header['ansi_defaults'].type == 'BIT' );

                assert(header['connection_id'].type == 'GUIDN' );
                assert(header['connection_id'].size == 16 );
                
                assert(header['statement_start_offset'].type == 'INTN' );
                assert(header['statement_start_offset'].size == 4 );

                assert(header['wait_type'].type == 'NVARCHAR' );
                assert(header['wait_type'].size == 120 );

                assert(header['wait_resource'].type == 'NVARCHAR' );
                assert(header['wait_resource'].size == 512 );
                
                assert(header['command'].type == 'NVARCHAR' );
                assert(header['command'].size == 64 );
                
                assert(header['sql_handle'].type == 'BIGVARBIN' );
                assert(header['sql_handle'].size == 64 );
                
                assert(header['query_hash'].type == 'BIGBinary' );
                assert(header['query_hash'].size == 8 );
                
                assert(header['query_plan_hash'].type == 'BIGBinary' );
                assert(header['query_plan_hash'].size == 8 );
                                
                done();
            });
        });   
                
        it('Data type: XML', function(done) {
            _connection.execute('select col = cast(\'<a><b>texto<c/></b></a>\' as xml) ', function(err, dataset) {
                var column = dataset.header[0];
                
                assert(column.name == 'col');
                assert(column.type == 'XML');

                assert(dataset.rows.length == 1);
                assert(dataset.rows[0].length == 1);

                var row = dataset.rows[0];
                
                assert(row[0].match(/<a><b>/));
                                
                done();
            });
        });        
        
        it('No-test: sys.dm_xe_database_session_targets', function(done) {
            _connection.execute('select * from sys.dm_xe_database_session_targets', function(err, dataset) {
                var column = dataset.header['target_data'];
                
                if(err == null) {
                    assert(column != null);

                    var row = dataset.rows[0];
                    var content = row[column.index];
                }
                                
                done();
            });
        });
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