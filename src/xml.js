/* global $ */
"use strict";

$(document).ready(function() {

    var initial = '<RingBufferTarget eventCount="2"> \
        <event name="sp_statement_completed" package="sqlserver" \
        timestamp="2016-02-02T12:39:47.375Z"></event> \
        <event name="sp_statement_completed" package="sqlserver" \
        timestamp="2016-02-02T12:39:47.375Z"></event> \
        </RingBufferTarget>';
            
    $('#txtXml').text(initial);
      
   $('#btnParse').click(parse);
   
   function parse() {
       
        var text = $('#txtXml').val();


        var parser = XmlParser.init(window.sax);
        var data = parser.parse(text);

        // $('#results').text(JSON.stringify(data));
                
        renderXmlDisplay('#results', data);
   }
   
});