SQL Code
========

Ferramenta para ajudar no trabalho com SQL Azure.

Alfa-version: v0.2

* Não há (ainda) um diretório de /build ou /dist
* Testes são realizados pelo Mocha

## Web

Ao iniciar o endpoint, inicia-se um servidor web na porta 8080:

    sqlcode.js endpoint
    
A página default é apresentada com os dashboards (ainda não implementados).
A primeira implementação feita usando HTML (customizado) ficou um pouco 
engessada. Talvez seja melhor reescrever usando somente React (?). 
Pelo menos esse é o trabalho inicial.

    http://localhost:8080

É possível visualizar o trabalho usando a página de componentes:

    http://localhost:8080/componentes.html    


## SQL Code

A versão inicial é composta por um módulo baseado em Node e outro em HTML.
Para rodar, é necessário iniciar:

    sqlcode.js endpoint 
    
Ao passar o parâmetro 'endpoint', o programa escuta em uma porta HTTP e 
serve a página index.html. 

## Editor

[Editor](src/editor/index.html) está src/editor/index.html
    
As alterações são feitas em src/editor/index.jsx e compiladas com Webpack.


Histórico
==========

## 0.2
- Versão web para consultas SQL
- Relatórios baseados em template HTML

## 0.1 (Alpha)
- Cleanup dos arquivos no root
- Versão console para consultas SQL
- Testes com Mocha