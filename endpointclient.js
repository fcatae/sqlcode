$('#btnExecute').click(function() {
    
    executeSql();
    //alert('bom dia'); 
      
    return true; 
});

var SQL_ENDPOINT = 'http://localhost:3000'
var SQL_ENDPOINT_GETCONNECTION = SQL_ENDPOINT + '/getConnection';
var SQL_ENDPOINT_EXECUTE = SQL_ENDPOINT + '/execute';

function executeSql() {


    $.post(SQL_ENDPOINT_EXECUTE, { request: 'test' } );
    
}

$(document).ready(function() {
    
    $.post(SQL_ENDPOINT_GETCONNECTION, null, function() {
        alert('ready')   
    });
    
    
})