var SQL_ENDPOINT = 'http://localhost:3000'
var SQL_ENDPOINT_GETCONNECTION = SQL_ENDPOINT + '/getConnection';
var SQL_ENDPOINT_EXECUTE = SQL_ENDPOINT + '/execute';

$(document).ready(function() {
    
    $('#btnExecute').prop('disabled', true);
    
    $.post(SQL_ENDPOINT_GETCONNECTION, null, function() {
        setInterval(function() {
            enableAccess();
        }, 1500)
    });
    
    $('#btnExecute').click(function() {
        executeSql();
        alert('bom dia'); 
        
        return true; 
    });

})

function enableAccess() {
    $('.stateConnecting').hide(); 
    $('#btnExecute').prop('disabled', false);   
}

function executeSql() {


    $.post(SQL_ENDPOINT_EXECUTE, { request: 'test' } );
    
}
