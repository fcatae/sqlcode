var argv = require('minimist')(process.argv.slice(2));
var spawn = require('child_process').spawn;
var chalk = require('chalk');
var prompt = require('prompt');

var DEFAULT_DATABASE = '<default>';
var mode = false; // none/server/user

if(process.env.SQLSERVER_SRV) {
    process.env.SQLSERVER_USER = null;
    process.env.SQLSERVER_PWD = null;
}

var server = process.env.SQLSERVER_SRV || argv._[0];
var database = process.env.SQLSERVER_DB || argv._[1];
var username = process.env.SQLSERVER_USER || argv._[2];
var password = process.env.SQLSERVER_PWD || argv._[3];

if(process.env.SQLSERVER_USER && (!server)) {    
    // set the password
    process.exit(0);
}

// sintaxe: server + database
// opt: user + pwd

// connect server + database
// store user + pwd

function getUserPassword(callback) {

    prompt.start();
    prompt.message = '';
    prompt.delimiter = '';

    prompt.get([{
        name: 'username',
        description: 'User:',
        required: false,
        default: username,
        ask: function() { return (username == null || username == '')}
        }, {
        name: 'password',
        description: 'Password:',
        hidden: true,
        required: false,
        replace: '*',
        default: password,
        ask: function() { return (password == null || password == '')}
        }], function (err, result) {
        
        callback && callback(err, result);
    });
    
}

getUserPassword(function(err, result) {

    username = result.username;
    password = result.password;
    
    (server || result.username) && spawnCommand();
    
});

function spawnCommand() {
    var cmd = 'cmd';
    var args = ['/k','start'];
    var options = {
        env: getEnv(server, database, username, password),
        stdio: 'ignore',
        detached: true
    };
    spawn(cmd, args, options);
}

function getEnv(server, database, username, password) {
    // set process environment variables
    var env = process.env;

    var header;
    var decorate;
    
    if(server) {
        header = server.toUpperCase() + '/' + (database || DEFAULT_DATABASE) + ' ';
        decorate = chalk.green.bold;
    } else if(username) {
        header = '[' + username + '] ';
        decorate = chalk.red.bold;
    } else {
        decorate = function() { return '' }
    }

    env.PROMPT = decorate(header) + '$P$G';
    
    if(server) {
        env.SQLSERVER_SRV = server;
        (database) && (env.SQLSERVER_DB = database);
    }
    if(username) {
        env.SQLSERVER_USER = username;
        env.SQLSERVER_PWD = password;
    }
}