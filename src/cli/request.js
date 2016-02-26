var argv = require('minimist')(process.argv.slice(2));
var fs = require('fs');

var Console = require('console').Console; 
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
var output;

var params = {
    filename: argv.f,
    adhoc: argv.c,
    output: argv.o,
    multiple_files: argv.m
};

if( (params.filename) && params.output == params.filename ) {
    console.log('Input file and output file must be different');
    process.exit(-1);
}

if( params.adhoc != null ) {
    commandList.push(argv.c);    
} 

if( params.filename != null ) {    
    var text = fs.readFileSync(params.filename, 'utf8');    
    commandList.push(text);
}

if( params.output != null ) {
    var output_file = fs.createWriteStream(params.output);
    output = new Console(output_file, process.stderr);
} else {
    output = new Console(process.stdout, process.stderr);
}

if( commandList.length == 0 ) {
    console.log('No command provided. Use either -c <adhoc> or -f <filename>');
    process.exit(-1);
}

commandList.map(function(sqlcmd) {

    if ( params.multiple_files ) {
        executeCommandFileData( sqlcmd, finalizarProcesso );        
    } else {
        executeCommand( sqlcmd, finalizarProcesso )
    }   
});
 
function finalizarProcesso() {

    if(output_file) {
        // async clean up: needs to flush the content to file prior to exiting the process
        output_file.end();
        
        output_file.on('close', function() {
            process.exit(0);   
        })            
    } else {
        process.exit(0);
    }
}

function executeCommand(commandText, callback) {
    var conn = new SqlConnection(credentials);

    conn.open(function() {
        conn.execute(commandText, function(err, data) {
            if(err) {
                callback(err);
                return;
            }
            var header = data.header;
            var format = Transform.createFormat(header);
            var format_output = Transform.create(format);
            
            format_output.attach(header);
            
            var h = format_output.printHeader();
            var s = format_output.printSeparator();
            
            output.log(h);
            output.log(s);
            
            data.rows.map(function(row) {
                var r = format_output.printRow(row);
                output.log(r);   
            })

            callback();
        });
        
    })    
}

function executeCommandSingleRow(commandText, callback) {
    var conn = new SqlConnection(credentials);

    conn.open(function() {
        conn.execute(commandText, function(err, data) {
            if(err) {
                callback(err);
                return;
            }
            
            var xml = data.rows[0][0];

            output.log(xml);
            
            callback();      
        });
        
    })    
}

function executeCommandFileData(commandText, callback) {
    var conn = new SqlConnection(credentials);

    conn.open(function() {
        conn.execute(commandText, function(err, data) {
            if(err) {
                callback(err);
                return;
            }
            
            if(data.header.length != 2) {
                console.log('Invalid number of output columns');
                callback();
            }
            
            data.rows.map(function(row) {
                var filename = row[0].trim();
                var filedata = row[1];
                
                if(isValidName(filename)) {
                    fs.writeFileSync(filename, filedata);   
                    console.log('File created: ' + filename);
                }
                
            })
            
            callback();
            
            function isValidName(filename) {
                return (filename) && (filename.length > 0) && 
                    (!filename.match(/[/\\]/));
            }      
        });
        
    })    
}
