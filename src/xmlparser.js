/* global sax */

(function(exports) {

"use strict";

function Parser(saxLibrary) {

   var _saxLib = saxLibrary;
   
   return {
       parse: parse
   }
 
   function parse(valueText) {
       
       var text = valueText.toString();
       
       if(!(typeof text == 'string' || text instanceof String)) {
           throw "Invalid parameter data type";
       }       
       
       var parser = _saxLib.parser(true);
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
            // finish the process
        };

        parser.ontext = null;
        parser.onattribute = null;
        parser.onclosetag = null;

        // synchronous call
        parser.write(text).close();
       
        return result;
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
   }

    function processEvent(parser, node, eventList) {

        var old_open = parser.onopentag;
        var old_close = parser.onclosetag;
        var event = {};
        var data = {};
          
        parser.onopentag = function (node) {
            if(node.name == 'data' || node.name == 'action') {
                processEventData(parser, node, data);
            }
        };
        parser.onclosetag = function (tag) {
            if(tag == 'event') {
                // exit this process state
                cleanup();
                eventList.push(event)
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
        
    }   

    function processEventData(parser, node, root) {

        var old_open = parser.onopentag;
        var old_close = parser.onclosetag;
        var old_text = parser.ontext;
        
        parser.onopentag = function (node) {
            if(node.name == 'type') {
                type = node.name;
            }
            if(node.name == 'value') {
                captureValue = true;
                //value = null;
            }
            if(node.name == 'text') {
                captureText = true;
                //value = null;
            }            
        };
        parser.ontext = function(tval) {
            if(captureValue && value == null) {
                value = tval;
            }            
            if( captureText ) {
                value = tval;
            }            
        }

        parser.onclosetag = function (tag) {
            if(tag == 'data' || tag == 'action') {
                // exit this process state
                cleanup();

                // value can be NULL!
                // eg. sp_statement_completed.object_name, rpc_completed.data_stream, 
                // rpc_completed.output_parameters, sql_statement_completed.parameterized_plan_handle 
                    
                root[name] = value;
            }
            if(tag == 'value') {
                captureValue = false;
            }
            if(tag == 'text') {
                captureText = false;
            }
        };
        
        function cleanup() {
            parser.onopentag = old_open;
            parser.onclosetag = old_close;
            parser.ontext = old_text;
        }       
        
        var name = node.attributes["name"];
        var type;
        var value = null;
        var captureValue = false;
        var captureText = false;
        
        root[name] = null;
    }

}

exports.init = Parser;
    
})(typeof exports == 'undefined' ? this.XmlParser = {} : exports );