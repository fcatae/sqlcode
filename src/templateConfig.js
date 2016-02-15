(function() {

    var config = {
        xml: {
            aviso: 'Hey!!!'
        }
    };
    
    var current = window.location.search.substring(1);
    
    var options = config[current] || {};
    
    $(document).ready(function() {
        templateInit(options);
        //templateIndexHtml(options.ui);
    })

    // // query string
    // function getQueryVariable(variable) {
    //     // assumes no hash
    //     var query = window.location.search.substring(1);
    //     var vars = query.split('&');
    //     for (var i = 0; i < vars.length; i++) {
    //         var pair = vars[i].split('=');
    //         if (decodeURIComponent(pair[0]) == variable) {
    //             return decodeURIComponent(pair[1]);
    //         }
    //     }
    // }
    
})();

function templateIndexHtml(ui) {
        
    var conn = createSqlClient();

    ui.retryButton.click(function() {
        beforeConnectionOpen();
        connectionOpen();       
    })
    function beforeConnectionOpen() {
        ui.alertConnecting.show();
        ui.alertConnectionFailed.hide();
        ui.defaultButton.prop('disabled', true).css("cursor", "default");
    }
    
    function connectionOpen() {
        conn.open(connectionOpenCallback); 
        //setTimeout(connectionOpenCallback, 1000);
    }
    
    function connectionOpenCallback(err) {
        if(err == null) {
            
            setInterval(function() {
                ui.alertConnecting.fadeOut(50);    
            }, 500);
            ui.defaultButton.prop('disabled', false);     

        } else {
            // failed state
            ui.alertConnecting.hide();
            ui.alertConnectionFailed.show();
        }        
    }    
    
    beforeConnectionOpen();
    connectionOpen();    

    ui.progressBar.hide();

    ui.defaultButton.click(function() {
        var text = ui.textarea.val();
        
        ui.progressBar.show();        
        ui.defaultButton.prop('disabled', true);
        ui.results.hide();
        
        function connectionExecute() {
            conn.execute(text, connectionExecuteCallback);
            //setTimeout(connectionExecuteCallback, 2000);
        }
        
        function connectionExecuteCallback(err, data) {
            ui.progressBar.hide();
            ui.defaultButton.prop('disabled', false);
            if( err == null ) {
                ui.alertExecute.hide();
                ui.results.text(data);
                ui.results.show();                                         
            } else {
                ui.alertExecute.show();
                ui.results.hide();                     
            }            
        } 
        
        connectionExecute();
    })

    ui.alertExecute.hide();
    ui.results.hide();
}