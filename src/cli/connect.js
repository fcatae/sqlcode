var spawn = require('child_process').spawn;
var chalk = require('chalk');

function getEnv(server, database) {
    // inherit environment variables
    var env = process.env;

    var header = (server + '/' + database).toUpperCase();

    env.PROMPT = chalk.green.bold(header) + ' $P$G';    
}


var cmd = 'cmd';
var args = ['/k','start'];
var options = {
    env: getEnv('myserver', 'mydb'),
    stdio: 'ignore',
    detached: true
};

var proc = spawn(cmd, args, options);

proc.on('exit', function(code) {
    console.log('exiting...' + code)
})
