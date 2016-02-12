"use strict";

$(document).ready(function() {

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

})

