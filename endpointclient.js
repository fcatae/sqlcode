var SQL_ENDPOINT = 'http://localhost:3000'
var SQL_ENDPOINT_GETCONNECTION = SQL_ENDPOINT + '/getConnection';
var SQL_ENDPOINT_EXECUTE = SQL_ENDPOINT + '/execute';

$(document).ready(function() {
    
    $('#btnExecute').prop('disabled', true);
    
    $.post(SQL_ENDPOINT_GETCONNECTION, null, function() {
        setInterval(function() {
            enableAccess();
        }, 500)
    });
    
    $('#btnExecute').click(function(ev) {

        ev.preventDefault();

        executeSql();
        //alert('bom dia'); 
        
    });

})

function enableAccess() {
    $('.stateConnecting').hide(); 
    $('#btnExecute').prop('disabled', false);   
}

function executeSql() {

    var request = $('#txtCommand').val();
    
    $.post(SQL_ENDPOINT_EXECUTE, { request: request }, function(data) {
        var datarows = data.split('[;;;]');
        datarows.pop();
        
        var rows = datarows.map(function(v) { return JSON.parse(v); });
        
        showResults(rows);
    });
    
    $('#lastCommand').text(request);
    
}

function showResults(rows) {

    $('#results').html(JSON.stringify(rows));
    
}


