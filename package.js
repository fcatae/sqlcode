/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var React = __webpack_require__(1);


	    var lines = [
	  '  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, enim.',
	  'Lorem ipsum eu dolor sit amet, consectetur adipisicing elit. Ipsam, dolorem.',
	  'Lorem ipsum dolor sit amet, consectetur  eu adipisicing elit. Blanditiis, soluta.',
	  'Lorem ipsum dolor eu sit                 amet, consectetur adipisicing eu elit. Ratione, et.',
	  'Lorem ipsum dolor sit amet,              consectetur eu adipisicing elit. Tempora, aspernatur!',
	  'Lorem ipsum dolor sit amet,              consectetur adipisicing elit. Iste, quo!',
	  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod, voluptates!',
	  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt, qui.'    
	]; 



	function transformarLinhas() {
	    
	    var linhas = lines;
	    
	    var linhas_tokenized = linhas.map(function(line) {
	        var tokens = line.match(/(\S+)|(\s+)/g) || [''];
	        return tokens;                
	    });
	    
	    return linhas_tokenized;
	}

	var tokens = transformarLinhas();

	var Palavra = React.createClass({displayName: "Palavra",

	    handleKeyPress: function(ev) {
	        var s = ev.key;
	        console.log(s);
	    },
	    render: function() {
	        var token = this.props.token;
	        var importante = (token == 'consectetur') ? ' importante' : '';
	        var spaces = /\s/.test(token) ? ' spaces' : '';
	        var classnames = importante + spaces;
	        return React.createElement("span", {className: classnames}, token);
	    }
	    
	});

	var Linha = React.createClass({displayName: "Linha",
	    render: function() {
	        var tokens = this.props.tokens;
	        var position = 0;
	        
	        var palavras = tokens.map(function(token) {
	           var node = React.createElement(Palavra, {key: position, token: token})
	           position += token.length;
	           return node;
	        });
	          
	        return React.createElement("div", {className: "line"}, palavras);
	    }
	});

	var TextSpace = React.createClass({displayName: "TextSpace",
	    
	    handlekey: function(ev) {
	        console.log('press: ' + ev.key);
	        var selection = window.getSelection();
	        var anchor = selection.anchorNode;
	        var offset = selection.anchorOffset;
	        
	        if(!selection.isCollapsed) {
	            ev.preventDefault();  
	        }
	        
	        // adiciona uma nova linha                
	        if(ev.charCode == 13) {
	            var span = anchor.parentNode;
	            var nodename = span.nodeName;
	            
	            var path = span.dataset['reactid'];
	            var path_components = path.split('.$');
	            
	            var curposition = (path_components[1] | 0);
	            var newposition = 1 + (path_components[1] | 0);
	            var newline = '';
	            
	            lines.splice(newposition,0, newline);
	            
	            var currentline = lines[curposition]; 
	            var start_text = (path_components[2] | 0) + offset;
	             
	            lines[curposition] = currentline.substring(0, start_text);              
	            lines[newposition] = currentline.substring(start_text);           
	             
	            console.log('keydown: ' + ev.keyCode);
	            
	            this.forceUpdate();
	            
	            this['actionCreateNewLine'] = [path_components[0],newposition,0].join('.$'); 
	            
	            ev.preventDefault();
	        }
	        
	        ev.preventDefault();        
	    },
	    componentDidUpdate: function() {
	        
	        if(this['actionCreateNewLine']) {
	            var selection = window.getSelection();
	            var reactid = this['actionCreateNewLine'];
	            
	            this['actionCreateNewLine'] = null;
	            
	            var element = document.querySelector('span[data-reactid="' + reactid + '"]');
	            selection.collapse(element, 0);
	        }
	        
	        console.log('componentDidUpdate');  
	                    

	    },
	    handleKeyDown: function(ev) {
	        if(ev.keyCode == 8 || ev.keyCode == 46) {
	            console.log('keydown: ' + ev.keyCode);
	            ev.preventDefault();
	        }
	        
	    },
	    
	    render: function() {
	        
	        var tokens = this.props.tokens;
	        
	        var linhas = tokens.map(function(line,i) {
	            return React.createElement(Linha, {key: i, tokens: tokens[i]})
	        });
	        
	        return React.createElement("div", {className: "textspace", spellCheck: "false", onKeyPress: this.handlekey, onKeyDown: this.handleKeyDown, contentEditable: "true"}, linhas); 
	    }
	});

	function render() {
	   
	    var textspace = document.querySelector('.textspace');
	    //textspace && (lines = textspace.innerText.replace('\r\n','\n').split('\n'));     
	    
	    ReactDOM.render(
	        React.createElement(TextSpace, {tokens: tokens}),
	        document.getElementById('container')
	    );
	    
	    
	}


	var a = render();
	setInterval(render, 1000);
	// bug1 : incluir espacos dentro de um SPAN incorreto
	// bug2 : adicionar chaves incorretas

	//     
	// setInterval(function() {
	//     g_index = g_index + 1;   
	//     render(); 
	// }, 1000)


	// 
	// var WebPack = React.createClass({
	//     render: function() {
	//         return <h3>Webpack funcionando</h3>;
	//     }
	// });
	// 
	// module.exports = WebPack;
	// module.exports.teste = function() { alert('OK')};

	//http://www.matts411.com/static/demos/grid/index.html
	//http://www.bacubacu.com/colresizable/#samples


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = React;

/***/ }
/******/ ])