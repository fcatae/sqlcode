/* global $ */
"use strict";

$(document).ready(function() {
   
   function initTeste() {
       $('#txtXml').text('<a><b></b><b><c></c><d></d></b><b></b></a>');
   }
   
   function loadTeste() {
       $.ajax({
           url: 'xmlsample.xml', 
           type: 'GET',
           dataType: 'text',
           success: function(data) {
              $('#txtXml').val(data);           
           } 
       });

   }
   
   loadTeste();
   
   $('#btnParse').click(parse);
   
   function parse() {
       
        var text = $('#txtXml').val();

        require(['xmlclass.js'], function(xmlparse) {
            console.log(xmlparse.nome);
            xmlparse.teste(text);    
        }); 


       // read RingBufferTarget
       // read Event
       // read Data Type/Value
   }
   
});