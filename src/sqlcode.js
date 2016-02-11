var path = require('path');
var SqlConnection = require('./endpoint').SqlConnection;
var config = require( path.join(process.cwd(), '../.config') ).db_server_config;
var Transform = require('./datatransform');
var SQLAPI = require('./sqlapi');

function init() {
    
    console.log('SQL Code');

    var cmd = process.argv[2];

    var connection;

    switch(cmd) {
        case 'rs':
            cmdResourceStats();
            break;
        case 'er':
            cmdExecRequests();
            break;
        case 'sqltext':
            cmdExecSqlText();
            break;
        case 'queryplan':
            cmdExecQueryPlan();
            break;
        case 'xe':        
            cmdXEventDatabaseSessionTargets();
            break;
        case 'endpoint':
            cmdSetupEndpoint();
            break;
                    
        default: 
            console.log('Invalid command: ' + cmd);
            break;        
    }
}

function initSqlConnection(done) {
    var localCredentials = {
        username: 'fabteste',
        password: config.SQLSERVER_PWD,
        servername: 'localhost',
        database: 'master'
    }; 
    var credentials = {
        username: config.SQLSERVER_USER,
        password: config.SQLSERVER_PWD,
        servername: config.SQLSERVER_SRV,
        database: config.SQLSERVER_DB
    }; 
                
    connection = new SqlConnection(credentials);
    
    connection.open(done);
}

function cmdResourceStats() {
    
    initSqlConnection(function() {
        
        connection.execute('select * from sys.dm_db_resource_stats', function(err, dataset) {

            var format = Transform.create([
                ['end_time', Transform.toDateTimeYMD, 20],
                ['cpu', 'avg_cpu_percent', Transform.toNumberFixed.bind(null,1), 8],
                ['data', 'avg_data_io_percent', Transform.toNumberFixed.bind(null,1), 8],
                ['log', 'avg_log_write_percent', Transform.toNumberFixed.bind(null,1), 8]
            ]);
            
            format.attach(dataset.header);
            
            console.log(format.printHeader());
            console.log(format.printSeparator());
            
            dataset.rows.map(function(row) {
                console.log(format.printRow(row));    
            });            
            
            finish_process();
        });
    }); 
}

function cmdExecRequests() {
    
    initSqlConnection(function() {
        
        connection.execute('select * from sys.dm_exec_requests', function(err, dataset) {

            var formatcolumns = Transform.createFormat(dataset.header); 
            
            var format = Transform.create(formatcolumns);
            
            format.attach(dataset.header);
            
            console.log(format.printHeader());
            console.log(format.printSeparator());
            
            dataset.rows.map(function(row) {
                console.log(format.printRow(row));    
            });            
            
            finish_process();
        });
    }); 
}

function cmdExecSqlText() {
    
    initSqlConnection(function() {
        
        connection.execute('select t.text from sys.dm_exec_requests r cross apply sys.dm_exec_sql_text(r.sql_handle) t', function(err, dataset) {

            var format = Transform.create([
                ['text', 2000]            ]);
            
            format.attach(dataset.header);
            
            console.log(format.printHeader());
            console.log(format.printSeparator());
            
            dataset.rows.map(function(row) {
                console.log(format.printRow(row));    
            });            
            
            finish_process();
        });
    }); 
}

function cmdExecQueryPlan() {
    
    initSqlConnection(function() {
        
        connection.execute('select t.query_plan from sys.dm_exec_requests r cross apply sys.dm_exec_query_plan(r.plan_handle) t', function(err, dataset) {

            var format = Transform.create([
                ['query_plan', 2000]            ]);
            
            format.attach(dataset.header);
            
            console.log(format.printHeader());
            console.log(format.printSeparator());
            
            dataset.rows.map(function(row) {
                console.log(format.printRow(row));    
            });            
            
            finish_process();
        });
    }); 
}

function cmdXEventDatabaseSessionTargets() {
    
    initSqlConnection(function() {
        
        connection.execute('select * from sys.dm_xe_database_sessions s join sys.dm_xe_database_session_targets t on cast(s.address as int)= cast(t.event_session_address as int)', function(err, dataset) {

            var format = Transform.create([
                ['name', 20],
                ['target_data', 2000]
                ]);
            
            format.attach(dataset.header);
            
            console.log(format.printHeader());
            console.log(format.printSeparator());
            
            dataset.rows.map(function(row) {
                console.log(format.printRow(row));    
            });            
            
            finish_process();
        });
    }); 
}

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

function cmdSetupEndpoint() {
    SQLAPI.init(8080, _localCredentials);    
}

function finish_process() {
    process.exit(0);
}

init();