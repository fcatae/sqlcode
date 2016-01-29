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

        var element = this.refs.spamElem;
        if(!element.firstChild) {
            // problem: we dont want to deal with span without text, so create one
            console.log('problem: we dont want to deal with span without text, so create one');
        }
                     
        if(selection) {
            var element = this.refs.spamElem;
            var text = element.firstChild || element;
            var cursor = window.getSelection();
            cursor.collapse(text, selection.position);
            // console.log('caret: updated at MOUNT');
            // console.log('offset: ' + selection.position + ' (curline: ' + selection.curline + ', ' + selection.curtoken + ')');
        }
    },
    componentDidUpdate: function() {
        
        var selection = this.props.selection;
         
        if(selection) {
            var element = this.refs.spamElem;
            
            // assert: we should always have first child (<BR> when it is empty)
            if(!element.firstChild) {
                // should this be an error?
                console.log('create empty space (otherwise the caret disapear)');
                // problem: copy and past during the copy extra char
            }
            
            var text = element.firstChild;
            var cursor = window.getSelection();
            cursor.collapse(text, selection.position);
            
            // console.log('caret: updated at update');
            // console.log('element type: ' + element.nodeType)
            // console.log('offset: ' + selection.position + ' (curline: ' + selection.curline + ', ' + selection.curtoken + ')');
        }
    },
    
    render: function() {
        var token = this.props.token;
        var selection = this.props.selection;
        var highlight = (selection != null) ? ' selectedspan' : '';
        var importante = (token == 'consectetur') ? ' importante' : '';
        var spaces = /\s/.test(token) ? ' spaces' : '';
        var classnames = importante + spaces + highlight;
        
        // <BR> trick - se nao colocar, a linha fica fantasma e nao pode ser selecionada por teclado (so por mouse)
        var empty_or_token = ( token.length == 0 ) ? <br/> : token ;
         
        return <span ref="spamElem" className={classnames} >{empty_or_token}</span>;
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
            
           var onlyIfSelected = (selection) && (i == selection.curline) ? selection : null; 
           var node = <Palavra key={i} token={token} selection={onlyIfSelected}></Palavra>
           
           // should we clean selection state after update?
           
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

        if(anchor == null ) {
            console.log('onde estamos escrevendo???');
        }    
        
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
        //var reactid = span.dataset['reactid'];
        
        var textlines = this.state.tokens;
        
        // adiciona uma nova linha                
        if(ev.charCode == 13) {
            
            console.log('ENTER');
            var empty_line = [''];
            
            var currentline;
            var previousline;
            
            var tokenline = this.state.tokens[curline];
            var tokensplit = this.state.tokens[curline][curtoken];
            var splitIni = tokensplit.substring(0,offset);
            var splitEnd = tokensplit.substring(offset);
            
            var currentline = tokenline.slice(0, curtoken);
            // valid token?
            splitIni && currentline.push(splitIni);
            
            var nextline = tokenline.slice(curtoken);
            // valid token?            
            nextline[0] = splitEnd;
            (!splitEnd) && nextline.shift();
            
            console.log(currentline);
            console.log(nextline);
            
            textlines.splice(curline+1,0,empty_line);
            
            // is valid?
            (currentline.length == 0) && (currentline = ['']);
            (nextline.length == 0) && (nextline = ['']);    

            this.state.tokens[curline] = currentline;
            this.state.tokens[curline+1] = nextline;
            
            // check if it is the last char
            
            
            this.setState( {selection: {curline: curline+1, curtoken: 0, position: 0} } );
            
            ev.preventDefault();
            return;
        }
        
        var char = String.fromCharCode(ev.charCode);
        
        if(token == null) {
            // nao deveria acontecer isso. ou devemos ignorar?
            console('assert: token == null')
            return;
        }
        
        var newtoken = token.substring(0,offset) + char + token.substring(offset);
          
        // rever o token
        var getsubtokens = (function(token) {
            return token.match(/(\S+)|(\s+)/g) || [''];
        })(newtoken);
        
        //var nextreactid = [ path_components[0], curline,curtoken+1].join('.$');
        
        if(getsubtokens.length == 1) {
            tokens[curline][curtoken] = newtoken;
            //this.setState( {selection: {reactid: reactid, position: offset+1} } );     
            this.setState( {selection: {curline: curline, curtoken: curtoken, position: offset+1} } );       
        }
        else if(getsubtokens.length == 2){
            //MERGE: 'char' define o caracter a ser inserido, que nao combina com o token anterior
            // portanto, deve ser adicionado ao próximo token 

            // underflow
            if(curtoken == 0 && offset == 0) {
                console.log('UNDERFLOW');
                tokens[curline].unshift(char.toString());
                //this.setState( {selection: {reactid: nextreactid, position: 0} } );
                this.setState( {selection: {curline: curline, curtoken: curtoken+1, position: 0} } );
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

                //nextreactid = [ path_components[0], curline,curtoken].join('.$');
                //this.setState( {selection: {reactid: nextreactid, position: 1} } );
                this.setState( {selection: {curline: curline, curtoken: curtoken, position: 1} } );
            }
            
        } else {
            // CREATE TOKENS
            // Substituimos o token na posicao 'curtoken' por outros 3 tokens
            var numDeletes = 1;
            var line = tokens[curline];
            
            line.splice(curtoken, numDeletes, getsubtokens);
            var flatline = _.flatten(line);
            tokens[curline] = flatline;
            
            this.setState( {selection: {curline: curline, curtoken: curtoken+1, position: 1} } );
        }
        
        //this.forceUpdate();
        
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
            console.log('remover reactid');
            
            var element = document.querySelector('span[data-reactid="' + selection.reactid + '"]');
            var text = element.firstChild;
            var cursor = window.getSelection();
            cursor.collapse(text, selection.position);
            
            this.setState( {selection: null } );
        }
        
        // deveriamos verificar se selection == null sempre?
        console.log();
                   

    },
    handleKeyDown: function(ev) {
        if(ev.keyCode == 8 || ev.keyCode == 46) {
            console.log('keydown: ' + ev.keyCode);
            ev.preventDefault();
        }
        handleKeyDown_lastSelection = window.getSelection();
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
var handleKeyDown_lastSelection;

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
