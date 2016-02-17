Criar os bancos de dados:

    create database dbp1
    create database dbp2
    ...

Status:

    select * from sys.dm_operation_status
    
Criar com elastic pool:

    create database db (SERVICE_OBJECTIVE = ELASTIC_POOL(name=[ElasticPool-1]))

Alterar as

    alter database dbazure modify (SERVICE_OBJECTIVE = 'p1')
    
Acompanhamento dos recursos:

    select start_time, database_name, sku, dtu_limit from sys.resource_stats
    order by start_time desc

Lista dos recursos:

    select * from sys.elastic_pool_resource_stats