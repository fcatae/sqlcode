"use strict";

function templateInit(options) {
    
    options = options || {};
    
    (options.aviso) && alert(options.aviso)

    var conn = createSqlClient();

    $('#idButtonRetry').click(function() {
        beforeConnectionOpen();
        connectionOpen();       
    })
    function beforeConnectionOpen() {
        $('#idAlertConnecting').show();
        $('#idAlertConnectionFailed').hide();
        $('#idButton').prop('disabled', true).css("cursor", "default");
    }
    
    function connectionOpen() {
        conn.open(connectionOpenCallback); 
        //setTimeout(connectionOpenCallback, 1000);
    }
    
    function connectionOpenCallback(err) {
        if(err == null) {
            
            setInterval(function() {
                $('#idAlertConnecting').fadeOut(50);    
            }, 500);
            $('#idButton').prop('disabled', false);     

        } else {
            // failed state
            $('#idAlertConnecting').hide();
            $('#idAlertConnectionFailed').show();
        }        
    }    
    
    beforeConnectionOpen();
    connectionOpen();    

    $('#idProgress').hide();

    $('#idButton').click(function() {
        var text = $('#idTextarea').val();
        
        $('#idProgress').show();        
        $('#idButton').prop('disabled', true);
        $('#idResults').hide();
        
        function connectionExecute() {
            conn.execute(text, connectionExecuteCallback);
            //setTimeout(connectionExecuteCallback, 2000);
        }
        
        function connectionExecuteCallback(err, data) {
            $('#idProgress').hide();
            $('#idButton').prop('disabled', false);
            if( err == null ) {
                $('#idAlertExecute').hide();
                $('#idResults').text(data);
                $('#idResults').show();                                         
            } else {
                $('#idAlertExecute').show();
                $('#idResults').hide();                     
            }            
        } 
        
        connectionExecute();
    })

    $('#idAlertExecute').hide();
    $('#idResults').hide();

    
}