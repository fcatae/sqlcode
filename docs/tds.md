

completion callback is called.
 
* new Connection(config)



* connection.cancel()

* connection.close()

* connection.reset(callback)

Procedure:
* connection.callProcedure(request)

Adhoc SQL:
* connection.execSql(request)
* connection.execSqlBatch(request)

Exec Prepare:
* connection.execute(request, parameters)
* connection.prepare(request)
* connection.unprepare(request)



## new Connection(config)

Sintaxe usada para criar uma conexão com banco de dados:

    var Connection = require('tedious').Connection;
    var config = {...};
    var connection = new Connection(config);

Exemplo:

    var config = {
        // userName: '',
        // password: '',
        IntegratedSecurity: true,
        server: '127.0.0.1',
        options: {encrypt: true}
    };

    var connection = new Connection(config);

    connection.on('connect', function(err) {
        if(err) {
            console.log(err.message);
            return;
        }   
            
        console.log('connected')
        }
    );


Opções:

* userName 
 * User name to use for authentication. 

* password 
 * Password to use for authentication. 

* server 
 * Hostname to connect to. 

* domain 
 * Once you set domain, driver will connect to SQL Server using domain login. 

* options.port 
 * Port to connect to (default: 1433). 

* options.appName

* options.instanceName 
 * The instance name to connect to. The SQL Server Browser service must be 
   running on the database server, and UDP port 1444 on the database server must be reachable. 
   (no default) 

* options.database 
 * Database to connect to (default: dependent on server configuration). 

* options.connectTimeout 
 * The number of milliseconds before the attempt to connect is considered failed (default: 15000). 

* options.requestTimeout 
 * The number of milliseconds before a request is considered failed, 
   or 0 for no timeout (default: 15000). 

* options.cancelTimeout 
 * The number of milliseconds before the cancel (abort) of a request is considered failed (default: 5000). 

* options.packetSize 
 * The size of TDS packets. Should be a power of 2. (default: 4096). 

* options.isolationLevel 
 * The default isolation level that transactions will be run with. (default: READ_COMMITED). 

* options.encrypt 
 * A boolean determining whether or not the connection will be encrypted. Set to true if you're on Windows Azure. (default: false). 


## Lifecycle

* Event: 'connect'
* Event: 'end'
* Event: 'error'


Eventos

info


An object with these properties: 

number

Error number

state

The error state, used as a modifier to the error number.

class

The class (severity) of the error. A class of less than 10 indicates an informational message.

message

The message text.

procName

The stored procedure name (if a stored procedure generated the message).

lineNumber

The line number in the SQL batch or stored procedure that caused the error. Line numbers begin at 1; therefore, if the line number is not applicable to the message, the value of LineNumber will be 0. 

* Event: 'infoMessage'
* Event: 'errorMessage'


Os requests:

•new Request(sql, callback)
•Event: 'columnMetadata'
•Event: 'row'
•Event: 'done'
•Event: 'doneInProc'
•Event: 'doneProc'
•Event: 'returnValue'
•request.addParameter(name, type, value, [options])
•request.addOutputParameter(name, type, [value], [options])
