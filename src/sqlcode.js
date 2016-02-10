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
    var credentials = {
        username: 'fabteste',
        password: config.SQLSERVER_PWD,
        servername: 'localhost',
        database: 'master'
    }; 
            
    connection = new SqlConnection(credentials);
    
    connection.open(done);
}

function cmdResourceStats() {
    
    initSqlConnection(function() {
        console.log('rs!')
    });
    
}
// - listagem das colunas resource_stats
// - listagem das colunas sys.dm_exec_requests
// - carregamento do SQL Text
// - carregamento do Query Plan
// - carregamento do XML