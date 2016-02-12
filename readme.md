SQL Code
========

Ferramenta para ajudar no trabalho com SQL Azure.

Alfa-version: v0.1

* Não há um diretório de /build ou /dist

## Editor

[Editor](src/editor/index.html) está src/editor/index.html
    
As alterações são feitas em src/editor/index.jsx e compiladas com Webpack.

## SQL Code

A versão inicial é composta por um módulo baseado em Node e outro em HTML.
Para rodar, é necessário iniciar:

    sqlcode.js endpoint 
    
Ao passar o parâmetro 'endpoint', o programa escuta em uma porta HTTP e 
serve a página index.html. 