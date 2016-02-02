/* global sax */

define([], function() {
   
   var my = { nome: 'classe exportada',
    teste: parse
    };
      
   return my;  


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
   }
   
});

