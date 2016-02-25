SQL Code
=========

Ferramenta moderna de coleta de dados do Azure

# Introdução

## Problemas

* Limitações do SMSS
   * Lentidão (carregamento)
   * Gerenciamento de login/pwd

* Limitação do Blocker Script
   * Necessidade de estar sempre conectado e falhas intermitentes
   * Não está claro o impacto dos waitstats sobre o resource-stats

* Dificuldade de usar Extended Events
   * Interpretação do resultado XML


Notas:
* Alternativa: dicas de onde clicar (e onde não clicar)   
* Solução: Editor com Dashboard

## Cenários

* Usar como **ferramenta** do dia a dia 
* Identificar os **pontos de gargalo** de uma aplicação
* Apresentar um **dashboard** com informações básicas sobre o servidor
* Visualizar os momentos com **maior consumo de recursos**
* Criar **relatórios automatizados** e **gráficos**

## Solução

* Relatórios
* Editor de texto
* Salvar arquivos

### Relatórios

* Relatório com attentions (timeouts)
* Relatório com o tempo de queries
* Distribuição de waitstats

### Editor de Texto Avançado

* Editor de texto com suporte a syntax highlighting (ACE textmate)



Roadmap
========

## 0.3
- Script XEvents: Duration e Wait types
- Dashboards para múltiplos servers
- Relatórios adicionais   
- Workspace: salvar arquivos
    
PLAN
======

## Situation

* Rodar XEvents contra 4 servidores
    * ter script pronto
    * ter relatórios de dashboard
    * suporte a endpoint com multiplas conexões
    * configurar xevents automaticamente
    * obter relatorio do xevents automaticamente
    * salvar os arquivos do xevents

## Tasks    

* Script
    * Relatório de blocking
    - master.sql
    - elastic.md
* Integração Typescript
    * Fácil depuração
* Command Line
    * Input
    * Process Env    
    * SELECT 1
    * XML
* Componentes Dashboard
    * master
    * resource_stats
    * workers
    * XEvents

* Charts
    * Versão Texto
    * Versão Gráfica    
* Parser de RPT
    * Carregamento do resource stats
* Gravação de arquivos
* /Dist
    * Integrado com o Gulp ou outro workflow + webpack
    * Reorganizar o diretório de testes
* UI: Tela de login (?)
* Reestruturar Alerts 
    * create alert (global)
    * create alert for #id

## Actions

Command CLI???
### process spawner 
    ok- child_process.spawn(command[, args][, options])
    ok- https://nodejs.org/api/child_process.html#child_process_options_detached
    ok- env var setting
-   ok- prompt: set prompt=[%computername%] $p$g

### execute script
### salvar arquivo
- report
- xml

### launcher para os demais cli

### Dashboards para múltiplos servers?
- adicionar endpoint /post para getconnection
- passar as credenciais para o getconnection e receber o handler
- chamar o comando /request usando o handle 

Etc
=====

## Referências Futuras

### Lab: Debugging Typescript

### Lab: Debugging Chrome

### Lab: ChartJS
* ChartJS: http://www.chartjs.org/docs/#bar-chart-introduction
* NvD3: http://nvd3.org/examples/bullet.html
