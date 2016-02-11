Exemplos de data transform:

* Conversão e formatação de data (start_time), varbinary (sql_handle), integer (duration)
* Campos calculados (ex: start_time = end_time - duration)
* Fixed text length: posicionamento de texto no estilo do blocker
* Salvar arquivos XML em disco

A biblioteca é composta pelo TextUtil e DataConverts

As informações serão renderizadas pelo cliente. 
* HTML: usando componentes React/Angular 
* Texto: usando componentes TextUtil (biblioteca)
* Conversão: usando componentes de DataConverts (biblioteca) 

A responsabilidade do DataTransform é alterar somente as Rows - não afetando o Header. 

DataTransform
==============

definição de column: [alias, name, dataconvert]

filter? color? podem ser adicionados como tags ou campos calculados.

    rows.filter(f).map(project);

TextUtil
=========
PrintHeader
PrintSeparator
Ultimo campo é sempre variavel

DataConverts
=============

formatUint8Array('0x')
formatDateTime('0x')