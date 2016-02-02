/* global sax */
"use strict";

define([], function() {
   
   var my = { nome: 'classe exportada',
    teste: parse
    };
      
   return my;  


   function show(target) {
       
       console.log(`RingBufferTarget: EventCount=${target.count}`);
       target.events.map(function(evt) {
           
       })
   }
   
   function parse(text, callback) {
       
       var parser = sax.parser(true);
       var result = {};
       
        parser.onerror = function (e) {
            console.log('Error');
        };
        
        parser.onopentag = function (node) {
            if(node.name == 'RingBufferTarget') {
                processRingBufferTarget(parser, node, result);
            }
        };
        
        parser.onend = function () {
            callback && callback(result);
        };

        parser.ontext = null;
        parser.onattribute = null;
        parser.onclosetag = null;

       parser.write(text).close();
   }
   
   function processRingBufferTarget(parser, node, target) {
       
        var old_open = parser.onopentag;
        var old_close = parser.onclosetag;
        var eventList = [];
        
        parser.onopentag = function (node) {
            if(node.name == 'event') {
                processEvent(parser, node, eventList);
            }
        };
        parser.onclosetag = function (tag) {
            if(tag == 'RingBufferTarget') {
                // exit this process state
                cleanup();
            }
        };
        
        function cleanup() {
            parser.onopentag = old_open;
            parser.onclosetag = old_close;
        }       
        
        target.count = node.attributes["eventCount"];
        target.events = eventList;
        
        console.log(`RingBufferTarget: EventCount=${node.attributes["eventCount"]}`);        
        
   }

    function processEvent(parser, node, eventList) {

        var old_open = parser.onopentag;
        var old_close = parser.onclosetag;
        var event = {};
        var data = {};
          
        parser.onopentag = function (node) {
            if(node.name == 'data') {
                processEventData(parser, node, data);
            }
        };
        parser.onclosetag = function (tag) {
            if(tag == 'event') {
                // exit this process state
                cleanup();
                eventList.push(event)
                console.log(data);
            }
        };
        
        function cleanup() {
            parser.onopentag = old_open;
            parser.onclosetag = old_close;
        }       
        
        event = {
            name: node.attributes["name"],
            timestamp: node.attributes["timestamp"],
            data: data
        }
        
        console.log(`  Event: name=${event.name} at ${event.timestamp}`);
    }   

    function processEventData(parser, node, root) {

        var old_open = parser.onopentag;
        var old_close = parser.onclosetag;
          
        parser.onopentag = function (node) {
        };
        parser.onclosetag = function (tag) {
            if(tag == 'data') {
                // exit this process state
                cleanup();
            }
        };
        
        function cleanup() {
            parser.onopentag = old_open;
            parser.onclosetag = old_close;
        }       
        
        var name = node.attributes["name"];
        var type;
        var value;
        
        root[name] = '1';
    }
   
});

