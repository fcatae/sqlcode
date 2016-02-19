var argv = require('minimist')(process.argv.slice(2));
var spawn = require('child_process').spawn;
var chalk = require('chalk');

var DEFAULT_DATABASE = 'master';

var server = argv._[0] || process.env.SQLSERVER_SRV;
var database = argv._[1] || process.env.SQLSERVER_DB || DEFAULT_DATABASE;
var username = argv._[2] || process.env.SQLSERVER_USER;
var password = argv._[3] || process.env.SQLSERVER_PWD;

var cmd = 'cmd';
var args = ['/k','start'];
var options = {
    env: getEnv(server, database),
    stdio: 'ignore',
    detached: true
};

function getEnv(server, database) {
    // inherit environment variables
    var env = process.env;

    var header = server.toUpperCase() + '/' + database;

    env.PROMPT = chalk.green.bold(header) + ' $P$G';    
}

if(server) {
    
    spawn(cmd, args, options);
    
} else {
    // server not defined: store user and password

}


