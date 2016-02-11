var path = require('path');
var SqlConnection = require('./endpoint').SqlConnection;
var config = require( path.join(process.cwd(), '../.config') ).db_server_config;
var Transform = require('./datatransform');

console.log('SQL Code');

var cmd = process.argv[2];

var connection;

switch(cmd) {
    case 'rs':
        cmdResourceStats();
        break;
        
    default: 
        console.log('Invalid command: ' + cmd);
        break;        
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

function createFormatter(header, info) {
    
}

function finish_process() {
    process.exit(0);
}

function dumpheader(dataset) {
    var header = dataset.header;
    header.map(function(col) {
        //console.log(`[${col.index}] ${col.name} (type: ${col.type}, size: ${col.size})`); // TODO: implementar o DUMP HEADER e depois mostrar na forma tabular
        console.log(col);
    })
}

function dumprowset(dataset) {
    var rowset = dataset.rows;
    rowset.map(function(row) {
        console.log(row.join(', '));
    })
}


// - listagem das colunas resource_stats
// - listagem das colunas sys.dm_exec_requests
// - carregamento do SQL Text
// - carregamento do Query Plan
// - carregamento do XML