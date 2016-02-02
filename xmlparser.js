/* global $ */
"use strict";

require(['xmlclass.js'], function(xml) {
    console.log(xml.nome);    
}); 

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
       
       var parser = sax.parser(true);
       
       parser.onopentag = function(node) {
           console.log('opentag')
       }

        parser.onerror = function (e) {
            console.log('e');
        };
        parser.ontext = function (t) {
            console.log('t');
        };
        parser.onopentag = function (node) {
            console.log('node');
        };
        parser.onattribute = function (attr) {
            console.log('attr');
        };
        parser.onend = function () {
            console.log('onend');
        };
       parser.onclosetag = function (tag) {
            console.log('onclosetag');
        };
       parser.write('<xml>Hello, <who name="world">world</who>!</xml>').close();

       // read RingBufferTarget
       // read Event
       // read Data Type/Value
   }
   
});