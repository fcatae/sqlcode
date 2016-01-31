var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

  var config = {
    userName: process.env.SQLSERVER_USER,
    password: process.env.SQLSERVER_PWD,
    server: process.env.SQLSERVER_SRV,
    options: {
        database: process.env.SQLSERVER_DB,
        encrypt: true, 
        appName: 'SuperConn',
        //connectTimeout
        //cancelTimeout
        requestTimeout: 0,
        packetSize: 200
    },    
  };

  var connection = new Connection(config);

  connection.on('infoMessage', function(e) {
     console.log(e); 
  });
  connection.on('errorMessage', function(e) {
     console.log(e); 
  });

  connection.on('end', function(e) {
     console.log(e); 
  });
  connection.on('error', function(e) {
     console.log(e); 
  });
  connection.on('connect', function(err) {
    if(err) {
        console.log(err.message);
        return;
    }        

    
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
    
    // If no error, then good to go...
      //executeStatement();
      console.log('connected')

      var request = new Request("select * from sys.objects,sys.objects b", function(err, rowCount) {
          console.dir(err);
          console.log('executed: ' + rowCount )
        });

      request.on('columnMetadata', function(c) {
        console.log('columnMetadata');
        console.dir(c);    
      });
      request.on('row', function(c) {
        console.log('row');    
        console.dir(c);
      });
      request.on('done', function(c) {
        console.log('done');    
      });
      request.on('doneProc', function(c) {
        console.log('doneProc');    
      });
      
      connection.execSql(request);
      
    });









/*
var sql = require('msnodesqlv8');
var conn_str = 'Driver={SQL Server Native Client 11.0};Server=(local));Database=(master);Trusted_Connection={Yes};';

sql.open(conn_str, function (err, conn) {
    if (err) {
        console.log("Error opening the connection!");
        return;
    }
    conn.queryRaw("SELECT * FROM sys.dm_exec_requests", function (err, results) {
        if (err) {
            console.log("Error running query!");
            return;
        }
        for (var i = 0; i < results.rows.length; i++) {
            console.log("0:" + results.rows[i][0]);
        }
    });
});
*/

