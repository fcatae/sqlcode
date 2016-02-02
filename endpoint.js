var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var _ = require('lodash');

var activeConnection = null;

app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();

});


app.get('/getConnection', function(req, res) {

    activeConnection = API_getConnection(null, function(err) {
        if(err) {
            res.send({error: err.message});
        }
        res.end('true');
    });

});
app.post('/getConnection', function(req, res) {

    activeConnection = API_getConnection(null, function(err) {
        if(err) {
            res.send({error: err.message});
        }
        
        res.end();
    });

});

app.get('/execute', function(req, res) {
    var request = 'select * from sys.databases';
    api_execute(request,res);
});

app.post('/execute', function(req, res) {
    var request = req.body.request;
    api_execute(request,res);
});

function api_execute(request,res) {
        if(activeConnection == null) {
        activeConnection = API_getConnection(null, function(err) {
            continueAPI();
        });    
    } else {
        continueAPI();
    }
    
    function continueAPI() {        
        API_execute(activeConnection, request, function(obj) {
            res.write(JSON.stringify(obj) + '[;;;]');
        }, function() {
            res.end();
        });
    }
}


app.listen(3000);

//-------------------------------------------------------------------------------

var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

function API_getConnection(parameters, done) {

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

function API_execute(connection, sqlcmd, progress, done) {
    
    var request = new Request(sqlcmd, function(err, rowCount) {
        console.dir(err);
        console.log('executed: ' + rowCount )
        done && done();        
        });

    request.on('columnMetadata', function(c) {
        console.log('columnMetadata');
        //console.dir(c);
        // flatten
        //_.map(function(col) {})
            
    });
    request.on('row', function(c) {
        console.log('row');    
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

//-------------------------------------------------------------------------------

function initDb() {

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


}


// We need this to build our post string
var querystring = require('querystring');
var http = require('http');
var fs = require('fs');

function PostCode(path, codestring, callback) {
  // Build the post string from an object
  var post_data = querystring.stringify({
      'request' : codestring
  });

  // An object of options to indicate where to post to
  var post_options = {
      host: 'localhost',
      port: '3000',
      path: path,
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };

  // Set up the request
  var post_req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('end', function (chunk) {
          console.log('close')
          callback && callback();
      });
          
      res.on('data', function (chunk) {
          console.log('Response: ' + chunk);
          callback && callback(chunk);
      });
      
      
  });

  // post the data
  post_req.write(post_data);
  post_req.end();

}

// console.log('PostCode(/getConnection)');
// PostCode('/getConnection', null, function() {
// 
//     console.log('PostCode(/execute)');
//     PostCode('/execute', 'select * from sys.dm_exec_requests', function(chunk) {
//         console.log('Response: ' + JSON.stringify (chunk) );
//     });
//     
// });

