var Connection = require('tedious').Connection;

  var config = {
    userName: 'fab',
    password: 'telefone',
    server: '127.0.0.1',
    
    // If you're on Windows Azure, you will need this:
    //options: {encrypt: true}
  };

  var connection = new Connection(config);

  connection.on('connect', function(err) {
    // If no error, then good to go...
      //executeStatement();
      alert('connected')
    }
  );

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

function teste(param) { alert('sql ready: ' + param)}

module.exports = teste; 

teste('modulo carregado')

