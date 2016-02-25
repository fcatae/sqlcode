var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var SqlConnection = require('../endpoint').SqlConnection;
var ErrorOutput = require('../endpoint').ErrorOutput;
var Transform = require('../datatransform');

var credentials = {
    username: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PWD,
    servername: process.env.SQLSERVER_SRV,
    database: process.env.SQLSERVER_DB
};

var commandList = [];

var filename = argv.f;
var adhoc = argv.c;

if( adhoc != null ) {
    commandList.push(argv.c);    
} 

if( filename != null ) {    
    var text = fs.readFileSync(filename, 'utf8');    
    commandList.push(text);
}

var isSingleRow = ( argv.s !== undefined );

commandList.map(function(sqlcmd) {

    if (isSingleRow) {
        executeCommandSingleRow(sqlcmd, finalizarProcesso);        
    } else {
        executeCommand(sqlcmd, finalizarProcesso)
    }   
});

function finalizarProcesso() {
    process.exit(0);
}

function executeCommand(commandText, callback) {
    var conn = new SqlConnection(credentials);

    conn.open(function() {
        conn.execute(commandText, function(err, data) {
            var header = data.header;
            var format = Transform.createFormat(header);
            var format_output = Transform.create(format);
            
            format_output.attach(header);
            
            var h = format_output.printHeader();
            var s = format_output.printSeparator();
            
            console.log(h);
            console.log(s);
            
            data.rows.map(function(row) {
                var r = format_output.printRow(row);
                console.log(r);   
            })

            callback();
        });
        
    })    
}

function executeCommandSingleRow(commandText, callback) {
    var conn = new SqlConnection(credentials);

    conn.open(function() {
        conn.execute(commandText, function(err, data) {
            var xml = data.rows[0][0];

            console.log(xml);
            
            callback();      
        });
        
    })    
}
