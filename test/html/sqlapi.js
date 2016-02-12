describe('SQL API1', function() {
    
    it('SQL API1', function() {
    });
    
    it('teste 12s browser', function() {
        assert(1 == 1);
    });
    
    it('este 1d browser', function() {
        assert(1 == 1);
    })
    it('teste 1 browser', function() {
        assert(1 == 2);
    })
});

/*
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

    var resultDom = $('#results');
     
    resultDom.empty();
    
    var tableDom = $('<table></table>');
    var theadDom = $('<thead></thead>'); 
    var tbodyDom = $('<tbody></tbody>');
    
    rows.map(function(row) {
        var columns = row.map(function(col) {
           return '<td>' + col + '</td>'; 
        });
        var rowHtml =  '<tr>' + columns.join('') + '</tr>'
        
        tbodyDom.append(rowHtml);
    })
    tableDom.append(theadDom);
    tableDom.append(tbodyDom);
    
    resultDom.append(tableDom);
    
    //$('#results').html(JSON.stringify(rows));
    
}

function escapeHtml(str) {
    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return str.replace(/[&<>]/g, function(tag) {
        return tagsToReplace[tag] || tag;
    });
};
*/