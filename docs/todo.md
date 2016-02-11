
Problemas
==========

* Limitações do SMSS
   * Lentidão (carregamento)
   * Gerenciamento de login/pwd
Solução: Editor com Dashboard

* Limitação do Blocker Script
   * Interpretação do resultado XML

* Limitação do serviço de endpoint SQL
   * Necessidade de estar sempre conectado
   * Dificuldade em depuração?

* Entender o impacto do Waitstats
   * Não está claro o impacto dos waitstats sobre o resource-stats


Objetivo
==========

* Identificar os pontos de gargalo de uma aplicação
* Obter um dashboard com informações básicas sobre o servidor
* Levantamento do resource_stats para identificar os momentos mais críticos
* Levantar o tempo de execução de query e o consumo correspondente

Outros
=======

* Editor de texto com suporte a syntax highlighting

Plano
=======

## Stable v1.0

v1.0: Cenário : entrar no aplicativo para obter as últimas informações sobre o desempenho do sistema.

DONE: console:
- listagem das colunas resource_stats
- listagem das colunas sys.dm_exec_requests
- carregamento do SQL Text
- carregamento do Query Plan
- carregamento do XML

DONE: Módulo NodeJS com endpoint SQL.
- login armazendo em process.env
- adicionado o arquivo .config para permitir testes com Mocha

Mover a lógica do SQLCode para o REPL.

_cleanup

O carregamento do XML deverá ser feito  

* Relatório sobre o resource stats
* Relatório com o tempo de queries

* UI: Tela de login (?)

## Lab: Processar XMl

## Lab: ChartJS
* ChartJS: http://www.chartjs.org/docs/#bar-chart-introduction
* NvD3: http://nvd3.org/examples/bullet.html

