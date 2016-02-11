Desabilitando a integridade referencial para inserir dados rapidamente.

Existem duas tabelas no banco de dados:

    create table tabelaProduto(id int not null primary key, descript varchar(10))
    create table tabelaDetalhes(prod int references tabelaProduto(id), quant int) 

Podemos criar uma tabela de staging de dados para alimentar a tabela de produto:

    create table tabelaProduto_TMP(id int not null primary key, descript varchar(10))

Schema da tabela é idêntico: mesmos tipos de dados, mesmos constraints.

Em um momento inicial, podemos fazer a carga da tabela Produtos usando a tabela TMP.

    --truncate table tabelaProduto_TMP
    insert tabelaProduto_TMP values (1, 'aaa'),(2, 'bbb'),(3, 'ccc')
    alter table tabelaProduto_TMP switch to tabelaProduto

Agora o banco de dados está ativo e recebendo novos comandos. Vamos supor que existam
registros que estão populando a tabela Detalhes e são dependentes de Produtos.

    insert tabelaDetalhes values (1,0)

Não é possível executar mais os comandos TRUNCATE ou ALTER TABLE SWITCH, pois geram erros.

    Msg 4712, Level 16, State 1, Line 33
    Cannot truncate table 'tabelaProduto' because it is being referenced by a FOREIGN KEY constraint.

    Msg 4905, Level 16, State 1, Line 36
    ALTER TABLE SWITCH statement failed. The target table 'dbteste.dbo.tabelaProduto' must be empty.

    Msg 4967, Level 16, State 1, Line 37
    ALTER TABLE SWITCH statement failed. SWITCH is not allowed because source table 'dbteste.dbo.tabelaProduto' contains primary key for constraint 'FK__tabelaDeta__prod__2C3393D0'.

As novas alterações são possíveis somente por novos DML (UPDATE/INSERT/DELETE). Por exemplo:

    delete tabelaProduto with (TABLOCKX)

Entretanto, podemos continuar alimentando a tabela Produtos usando o particionamento desde que 
as foreign keys sejam temporariamente desabilitadas.

    -- truncate table tabelaProduto_TMP
    -- insert tabelaProduto_TMP values (5, 'aaa'),(6, 'bbb'),(7, 'ccc')

    alter table dbteste.dbo.tabelaDetalhes nocheck constraint FK__tabelaDeta__prod__2C3393D0

    delete tabelaProduto with (TABLOCKX)
    alter table tabelaProduto_TMP switch to tabelaProduto

    alter table dbteste.dbo.tabelaDetalhes with nocheck check constraint FK__tabelaDeta__prod__2C3393D0
    
Pronto! Tudo está pronto. 