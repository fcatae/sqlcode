
Problemas
==========

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


Objetivo
==========

* Identificar os pontos de gargalo de uma aplicação
* Obter um dashboard com informações básicas sobre o servidor
* Levantamento do resource_stats para identificar os momentos mais críticos
* Levantar o tempo de execução de query e o consumo correspondente

Outros
=======

* Editor de texto com suporte a syntax highlighting (ACE textmate)

Plano
=======

* Relatório com attentions (timeouts)
* Relatório de Workers
* Relatório sobre o resource stats
* Relatório com o tempo de queries
* Relatório de blocking
* Distribuição de waitstats

* UI: Tela de login (?)

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

Ação:
- Garantir que a página HTML inicial é customizável, substituindo o jQuery por React
se necessário (talvez nao seja). 
- Teste: Instanciar uma página HTML do zero usando somente services + options.
- Separar os componentes de visualização JSX em arquivos distintos
- Teste: Criar uma página de visualização central
- Encapsular as animações em componentes específicos de Alerts.
- Configurar o webpack para gerar os pacotes necessários para usar o Require
- Teste: organizar novamente a estrutura de teste 
- Listar os Options na lateral

Situação: 
- parser do attention


## Lab: Processar XMl

## Lab: ChartJS
* ChartJS: http://www.chartjs.org/docs/#bar-chart-introduction
* NvD3: http://nvd3.org/examples/bullet.html






## Alpha v0.1

v0.1: Cenário : entrar no aplicativo para obter as últimas informações sobre o desempenho do sistema.

DONE: console:
- listagem das colunas resource_stats
- listagem das colunas sys.dm_exec_requests
- carregamento do SQL Text
- carregamento do Query Plan
- carregamento do XML

DONE: Módulo NodeJS com endpoint SQL.
- login armazendo em process.env
- adicionado o arquivo .config para permitir testes com Mocha

DONE: _cleanup

DONE: - Mover a lógica do SQLCode para o REPL (nao e mais necessario) - sqlcode
Endpoints:
- static
- live
- local
