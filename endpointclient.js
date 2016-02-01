$('#btnExecute').click(function() {
    
    executeSql();
    //alert('bom dia'); 
      
    return true; 
});


function executeSql() {

    var SQL_ENDPOINT = 'http://localhost:3000'

    var SQL_ENDPOINT_EXECUTE = SQL_ENDPOINT + '/execute';

    $.post(SQL_ENDPOINT_EXECUTE, { request: 'test' } );
    
}
