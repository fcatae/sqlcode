/* global sax */
"use strict";

define([], function() {
   
   var my = { nome: 'classe exportada',
    teste: parse
    };
      
   return my;  


   function parse(text) {
       
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
       parser.write(text).close();
   }
   
});

