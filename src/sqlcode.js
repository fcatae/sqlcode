var path = require('path');
var SqlConnection = require('./endpoint').SqlConnection;
var config = require( path.join(process.cwd(), '../.config') ).db_server_config;

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
        
        // binding: end_time , cpu, data, log
        // transform: localdate, strfixed2, strfixed2, strfixed2
        // space: 8, 4, 4, 4

        
        connection.execute('select * from sys.dm_db_resource_stats', function(err, dataset) {
            dumpheader(dataset);
            //dumprowset(dataset);

            var format = createFormatter(dataset.header, [
                ['end_time', null, 8],
                ['avg_cpu_percent', null, 8],
                ['avg_data_io_percent ', null, 8],
                ['avg_log_write_percent ', null, 8]
            ]);
            
            // format.printHeader();
            // format.printRow();
            
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