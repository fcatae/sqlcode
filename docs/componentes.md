Arquitetura
=============

## Organização

O carregamento do XML deverá ser feito em partes:
- HTML: navigation
- JSX: UI components 
- Modules: Services and non-UI dependencies 

1. Criamos uma página HTML customizável com init(services, options) para realizar os 
bindings necessários entre os componentes. Inicialmente teremos apenas uma página
HTML com o esqueleto.

2. Os componentes de visualização podem ser construídos com o JSX. Uma página de teste
deve permitir associar os Models aos Componentes JSX de forma centralizada, evitando
redundância.

3. Os módulos e serviços devem ser estruturados através do CommonJS. Isso facilita a
criação de testes individuais com o Mocha.



Visao Geral
=============

* Editor
    * Token

* Dashboard/Viewer
    * React

* Leitor XML

* Endpoint (Query Exec)
    * TDS  


Importante:
* Dashboard
* Leitor XML
* Query Exec


Dashboard
==========

Apresentar o status sobre a maquina
* Servername
* S0/S1/S2...
* DAtabases
* Resource_stats
* Login

Camada de apresentação baseada no React

Serviço para obtenção de dados

* escrever uma interface em react
* obter dados de um serviço

https://github.com/Azure/azure-content/blob/master/articles/sql-database/sql-database-service-tiers.md


Editor
=======

* Tokenizador
* Paste
* TAB
* emmets

* Syntax highlight
* Keyboard tracking (similar ao mouse tracking) - hover 

* usar a biblioteca keyboard.js?
* converter o projeto para Typescript?



Etc
====

Poderiamos criar atalhos:

* Teclado (f1, f2...)
* Comandos (!clrstack, !dso)
* Views de IDE (%v%)
* Funcoes de saida/projecao (graficos resourcestats)
* Automacao em cliente (bloquer infinito)
* Pin Column results

* Gerenciamento de senha?
* Arquivos de output (zip)

* command history (execution)
* query stats - rodando multiplas vezes, depois combina um grafico com porcentagens

Projetos.json para gerenciar multiplos servidores (criar alias)
barra de status: @@rowcount; server/database/time spent/rows

Gerenciamento de templates (Ctrl-M)
gerenciamento de arquivos (esperar por vscode extension?) R: provavelmente nao..

* Implementar um connection pooling