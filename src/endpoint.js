var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

function getConnection(parameters, done) {

    var config = {
        userName: (parameters && parameters.username) || process.env.SQLSERVER_USER,
        password: (parameters && parameters.password) || process.env.SQLSERVER_PWD,
        server: (parameters && parameters.servername) || process.env.SQLSERVER_SRV,
        options: {
            database: (parameters && parameters.database) || process.env.SQLSERVER_DB,
            encrypt: true, 
            appName: 'SuperConn',
            //connectTimeout
            //cancelTimeout
            requestTimeout: 0,
            packetSize: 8000
        },    
    };

    var connection = new Connection(config);

    connection.on('infoMessage', function(e) {
        console.log(e); 
    });
    connection.on('errorMessage', function(e) {
        
        // errors: https://azure.microsoft.com/pt-br/documentation/articles/sql-database-develop-error-messages/
        // error 40615,14,1
        // Cannot open server 'xxxxxxx' requested by the login. 
        // Client with IP address 'xx.xx.xx.xxx' is not allowed to access the server.  
        // To enable access, use the Windows Azure Management Portal or 
        // run sp_set_firewall_rule on the master database to create a firewall rule 
        // for this IP address or address range. 
        // It may take up to five minutes for this change to take effect.
        
        // error message : 18456,14,1
        // Login failed for user 'fcatae'.
        
        console.log(e); 
    });

    connection.on('end', function(e) {
        console.log(e); 
    });
    connection.on('error', function(e) {
        console.log(e); 
    });
    connection.on('connect', function(err) {

        (err) && console.log(err.message);
        done(err, connection);
        
    });

    return connection;
}

function execute(connection, sqlcmd, progress, done) {
    
    var request = new Request(sqlcmd, function(err, rowCount) {
        console.dir(err);
        console.log('executed: ' + rowCount )
        done && done();        
        });

    request.on('columnMetadata', function(c) {
        //console.dir(c);

        var a = c.map(function(elem) {
            var header = {
                name: elem.colName,
                rawLength: elem.dataLength,
                type: elem.type.type,
                typeSize: elem.type.maximumLength
            };
            return header.name;
        });
        
        progress && progress(a);
        // flatten
        //_.map(function(col) {})
            
    });
    request.on('row', function(c) {
        //console.dir(c);
        
        var a = c.map(function(elem) {
            return (elem.value instanceof Uint8Array) ? getArray(elem.value) : elem.value;
        })

        progress && progress(a);
                
        function getArray(arr) {
            var p = '0x';
            var b = arr.reduce(function(prev,cur) {
               var hex = cur.toString(16);
               hex = (hex.length == 1) ? '0' + hex : hex;
               
               return prev + hex; 
            });
            return p + b;
        }
        
    });
    request.on('done', function(c) {
        console.log('done');    
    });
    request.on('doneProc', function(c) {
        console.log('doneProc');    
    });
    
    connection.execSql(request);    
}
