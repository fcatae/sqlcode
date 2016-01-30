var htmlparser = require("htmlparser");
 
var handler = new htmlparser.DefaultHandler(function (error, dom) {
    console.log('sync call?');    
});
console.log('start')
var parser = new htmlparser.Parser(handler);

console.log('parse-start')
parser.parseComplete('<xml><a><b></b><b></b><b></b></a></xml>');
console.log('parse-end')

console.log(JSON.stringify(handler.dom, null, 2));