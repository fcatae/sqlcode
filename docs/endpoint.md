Endpoint
==========

Standalone application working as a gateway for SQL Server.

Based on tedious driver (TDS).

connection( database, secret, options ) 
connection.execute ( request ) -> json

request.on( 'row' )
request.on( 'error' )
request.on( 'done' )


Return json object


# Problems

Connection leak - the application would be consuming unecessary resources from database 