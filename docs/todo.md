SQL Code
=========

Ferramenta moderna de coleta de dados do Azure

# Introdução

## Problemas

* Limitações do SMSS
   * Lentidão (carregamento)
   * Gerenciamento de login/pwd
Alternativa: dicas de onde clicar (e onde não clicar)   
Solução: Editor com Dashboard

* Limitação do Blocker Script
   * Interpretação do resultado XML

* Limitação do serviço de endpoint SQL
   * Necessidade de estar sempre conectado
   * Dificuldade em depuração?

* Entender o impacto do Waitstats
   * Não está claro o impacto dos waitstats sobre o resource-stats

## Cenários

* Identificar os pontos de gargalo de uma aplicação
* Obter um dashboard com informações básicas sobre o servidor
* Levantamento do resource_stats para identificar os momentos mais críticos
* Levantar o tempo de execução de query e o consumo correspondente

### Outros

* Editor de texto com suporte a syntax highlighting (ACE textmate)


Roadmap
========

## 0.2
- Versão web para consultas SQL
- Relatórios


Execução
=========

## Cenários

* Relatório com attentions (timeouts)
* Relatório de Workers
* Relatório sobre o resource stats
* Relatório com o tempo de queries
* Relatório de blocking
* Distribuição de waitstats

* UI: Tela de login (?)

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

## Ação

agora:
- Criar um template HTML

- Garantir que a página HTML inicial é customizável, substituindo o jQuery por React
se necessário (talvez nao seja). 
* coletar a query string - OK
* selecionar o template - OK
* template config = com options - OK
- Teste: Instanciar uma página HTML do zero usando somente services + options.
* limpar o template.js e mover a lógica para outro arquivo (templateConfig?) - OK
- Listar os Options na lateral
* Usar o template default para listar as configurações
- Separar os componentes de visualização JSX em arquivos distintos
* Criação dos entry points para os relatórios
- Teste: Criar uma página de visualização central
* Criar os samples para serem processados
* Criar uma página para carregar os componentes JSX
- Script XEvents
* Coletar mais dados sobre os eventos

depois:

- Encapsular as animações em componentes específicos de Alerts.
    * react (?)
    * create alert (global)
    * create alert for #id
- Configurar o webpack para gerar os pacotes necessários para usar o Require
- Teste: organizar novamente a estrutura de teste 
- Criar um diretório /dist com o output dos arquivos
- Compilação em typescript com suporte a debug

## Exemplo

Situação: 
- parser do attention

Etc
=====

## Referências Futuras

### Lab: Processar XMl

### Lab: ChartJS
* ChartJS: http://www.chartjs.org/docs/#bar-chart-introduction
* NvD3: http://nvd3.org/examples/bullet.html



Histórico
==========

## 0.1 (Alpha)
- Cleanup dos arquivos no root
- Versão console para consultas SQL
- Testes com Mocha