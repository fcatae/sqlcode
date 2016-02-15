(function() {

    var config = {
        index: {
            process: templateIndexHtml
        },
        xml: {
            process: templateXmlHtml
        },
        default: {
            process: templateDefault
        }
    };
    
    var current = window.location.search.substring(1);
    
    var options = config[current] || config.default;
    
    $(document).ready(function() {
        templateInit(options);
        
        (options.process) && options.process(options.ui);

        //templateIndexHtml(options.ui);
    })

    function templateDefault(ui) {
        ui.defaultButton.hide();
        ui.textarea.hide();
        ui.results.text('');
        
        var location = window.location.href;
        for(var elem in config) {
            ui.results.append(`<p><a href="${location}?${elem}">${location}?${elem}</a></p>`);
        }
    }

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

function templateXmlHtml(ui) {
    
    var initial = '<RingBufferTarget eventCount="2"> \
        <event name="sp_statement_completed" package="sqlserver" \
        timestamp="2016-02-02T12:39:47.375Z"></event> \
        <event name="sp_statement_completed" package="sqlserver" \
        timestamp="2016-02-02T12:39:47.375Z"></event> \
        </RingBufferTarget>';
            
   ui.textarea.text(initial);
      
   ui.defaultButton.click(parse);
   
   function parse() {
       
        var text = ui.textarea.val();

        var parser = XmlParser.init(window.sax);
        var data = parser.parse(text);

        // $('#results').text(JSON.stringify(data));
          
        renderXmlDisplay(ui.results.selector, data);
   }
   
}