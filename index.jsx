var React = require('react');
var _ = require('lodash');

var LINHAS = [
        '  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eius, enim.',
        'Lorem ipsum eu dolor sit amet, consectetur adipisicing elit. Ipsam, dolorem.',
        'Lorem ipsum dolor sit amet, consectetur  eu adipisicing elit. Blanditiis, soluta.',
        'Lorem ipsum dolor eu sit                 amet, consectetur adipisicing eu elit. Ratione, et.',
        'Lorem ipsum dolor sit amet,              consectetur eu adipisicing elit. Tempora, aspernatur!',
        'Lorem ipsum dolor sit amet,              consectetur adipisicing elit. Iste, quo!',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod, voluptates!',
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sunt, qui.'    
        ]; 
var LINHAS2 = ['asdfk saklfdj alskjdf lksjdf llsdj sad'];

function transformarLinhas() {    
    
    var lines = LINHAS; 
    
    var linhas_tokenized = lines.map(function(line) {
        var tokens = line.match(/(\S+)|(\s+)/g) || [''];
        return tokens;                
    });
    
    return linhas_tokenized;
}

var tokens = transformarLinhas();

var Palavra = React.createClass({

    handleKeyPress: function(ev) {
        var s = ev.key;
        console.log(s);
    },
    componentDidMount: function() {
        
        var selection = this.props.selection;
         
        if(selection) {
            var element = this.refs.spamElem;
            var text = element.firstChild;
            var cursor = window.getSelection();
            cursor.collapse(text, selection.position);
        }
    },
    componentDidUpdate: function() {
        
        var selection = this.props.selection;
         
        if(selection) {
            var element = this.refs.spamElem;
            var text = element.firstChild;
            var cursor = window.getSelection();
            cursor.collapse(text, selection.position);
        }
    },
    
    render: function() {
        var token = this.props.token;
        var selection = this.props.selection;
        var highlight = (selection != null) ? ' selectedspan' : '';
        var importante = (token == 'consectetur') ? ' importante' : '';
        var spaces = /\s/.test(token) ? ' spaces' : '';
        var classnames = importante + spaces + highlight;
        return <span ref="spamElem" className={classnames} >{token}</span>;
    }
    
});

var Linha = React.createClass({
    getInitialState: function() {
        return {
            selection: this.props.selection
        }
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return true;
    },
    componentWillReceiveProps: function(nextprops) {
        this.setState( {selection: nextprops.selection} );
    },
    render: function() {
        var tokens = this.props.tokens;
        var position = 0;
        var selection = this.state.selection;
        
        var highlight = (selection != null) ? ' lineborder' : '';
        
        var palavras = tokens.map(function(token,i) {
            
           var onlyIfSelected = (selection) && (i == selection.curtoken) ? selection : null; 
           var node = <Palavra key={i} token={token} selection={onlyIfSelected}></Palavra>
           
           return node;
        });
        
        return <div className={'line' + highlight} >{palavras}</div>;
    }
});

var TextSpace = React.createClass({
    getInitialState: function() {
        return {
            tokens: this.props.init,
            selection: null
        }
    },
    handlekey: function(ev) {
        //console.log('press: ' + ev.key);
        ev.preventDefault();
        
        var selection = window.getSelection();
        var anchor = selection.anchorNode;
        var offset = selection.anchorOffset;
        
        if(!selection.isCollapsed) {
            ev.preventDefault();  
        }

        // identifica o SPAN em edicao
        var span = anchor.parentNode;
        var nodename = span.nodeName;
        
        var path = span.dataset['reactid'];
        var path_components = path.split('.$');
        
        var curline = (path_components[1] | 0);
        var curtoken = (path_components[2] | 0);
        var token = this.state.tokens[curline][curtoken];
        var reactid = span.dataset['reactid'];
        
        // adiciona uma nova linha                
        if(ev.charCode == 13) {
            var newposition = 1 + (path_components[1] | 0);
            var newline = '';
            
            LINHAS.splice(newposition,0, newline);
            
            var currentline = lines[curposition]; 
            var start_text = (path_components[2] | 0) + offset;
             
            LINHAS[curposition] = currentline.substring(0, start_text);              
            LINHAS[newposition] = currentline.substring(start_text);           
             
            console.log('keydown: ' + ev.keyCode);
            
            this.forceUpdate();
            
            this['actionCreateNewLine'] = [path_components[0],newposition,0].join('.$'); 
            
            return;
        }
        
        var char = String.fromCharCode(ev.charCode);
        var newtoken = token.substring(0,offset) + char + token.substring(offset);
          
        // rever o token
        var getsubtokens = (function(token) {
            return token.match(/(\S+)|(\s+)/g) || [''];
        })(newtoken);
        
        var nextreactid = [ path_components[0], curline,curtoken+1].join('.$');
        
        if(getsubtokens.length == 1) {
            tokens[curline][curtoken] = newtoken;
            this.setState( {selection: {reactid: reactid, position: offset+1} } );            
        }
        else if(getsubtokens.length == 2){
            //MERGE: 'char' define o caracter a ser inserido, que nao combina com o token anterior
            // portanto, deve ser adicionado ao próximo token 

            // underflow
            if(curtoken == 0 && offset == 0) {
                console.log('UNDERFLOW');
                tokens[curline].unshift(char.toString());
                this.setState( {selection: {reactid: nextreactid, position: 0} } );
            } else
            {
                curtoken++;
                // overflow            
                if(curtoken == tokens[curline].length) {
                    tokens[curline].push('');
                }
                
                var nexttoken = tokens[curline][curtoken];
                var nextvalue = char + nexttoken;
                
                tokens[curline][curtoken] = nextvalue;

                nextreactid = [ path_components[0], curline,curtoken].join('.$');
                this.setState( {selection: {reactid: nextreactid, position: 1} } );
            }
            
        } else {
            // CREATE TOKENS
            // Substituimos o token na posicao 'curtoken' por outros 3 tokens
            var numDeletes = 1;
            var line = tokens[curline];
            
            line.splice(curtoken, numDeletes, getsubtokens);
            var flatline = _.flatten(line);
            tokens[curline] = flatline;
            
            //var nextreactid = [ path_components[0], curline,curtoken].join('.$');
            this.setState( {selection: {curline: curline, curtoken: curtoken+1, position: 1} } );
        }
        
        this.forceUpdate();
        
        ev.preventDefault();        
    },
    handleclick: function() {
        console.log('click')
        var selection = window.getSelection();
        var anchor = selection.anchorNode;
        var offset = selection.anchorOffset;
        
        if(!selection.isCollapsed) {
            ev.preventDefault();  
        }

        // identifica o SPAN em edicao
        var span = anchor.parentNode;
        var nodename = span.nodeName;
        
        var path = span.dataset['reactid'];
        var path_components = path.split('.$');
        
        var curline = (path_components[1] | 0);
        var curtoken = (path_components[2] | 0);
                
        this.setState( {selection: {curline: curline, curtoken: curtoken, position: 0} } );
    },
    componentDidUpdate: function() {
        
        var selection = this.state.selection;
         
        if(selection && selection.reactid ) {
            var element = document.querySelector('span[data-reactid="' + selection.reactid + '"]');
            var text = element.firstChild;
            var cursor = window.getSelection();
            cursor.collapse(text, selection.position);
            
            this.setState( {selection: null } );
        }
                   

    },
    handleKeyDown: function(ev) {
        if(ev.keyCode == 8 || ev.keyCode == 46) {
            console.log('keydown: ' + ev.keyCode);
            ev.preventDefault();
        }
        
    },
    
    render: function() {
        
        var tokens = this.state.tokens;
        var selection = this.state.selection;
        
        var linhas = tokens.map(function(line,i) {
            var onlyIfSelected = (selection) && (i == selection.curline) ? selection : null;
            
            return <Linha key={i} tokens={tokens[i]} selection={onlyIfSelected}></Linha>
        });
        
        return <div className="textspace" spellCheck="false" onKeyPress={this.handlekey} onKeyDown={this.handleKeyDown} contentEditable="true" >{linhas}</div>; 
    }
});

function render() {
   
    var textspace = document.querySelector('.textspace');
    //textspace && (lines = textspace.innerText.replace('\r\n','\n').split('\n'));     
    
    ReactDOM.render(
        <TextSpace init={tokens}></TextSpace>,
        document.getElementById('container')
    );
    
}


var a = render();
setInterval(render, 5000);
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
