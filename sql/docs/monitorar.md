# Criação de indice columnstore funciona no Azure (somente no Premium)
create table tbp(id int)
create clustered columnstore index ccc on tbp

# Troca de banco de dados
ALTER DATABASE dbazure MODIFY (SERVICE_OBJECTIVE='s3');
select DATABASEPROPERTYEX(DB_NAME(),'ServiceObjective')

Pode ser monitorado a partir do master:

	select * from sys.dm_operation_status

Observamos a troca física da máquina pelo nome da instancia:

	MSSQL$FA9C7C5CAD38:Resource Pool Stats    
	MSSQL$EDCFD00E148E:Resource Pool Stats                     
                                                                                             
# Resource Governor

BASIC: CPU Delayed
select * from sys.dm_os_performance_counters where object_name like '%work%' order by 2
select * from sys.dm_os_performance_counters where object_name like '%resource%' order by 2

select * from sys.dm_os_performance_counters where instance_name = 'SloSharedPool1' 
select * from sys.dm_os_performance_counters where instance_name = 'SloSecSharedInitGroup' s/p

Log Governor:
select * from sys.dm_os_performance_counters where object_name= 'MSSQL$EDCFD00E148E:Databases' and instance_name ='dd46c112-ddd7-4aeb-a258-89a788358842' and counter_name ='Log Governor Used'

No caso do S3, nao é possivel encontrar um resource pool. Será que a limitação é feita pelo Schedulers?
No P2, aparecem 2 processadores ativos.

	select * from sys.dm_os_schedulers

As esperas do log:

	select * from sys.dm_db_wait_stats where wait_type='LOG_RATE_GOVERNOR'

O que será que esse Tare significa?

	select * from sys.dm_os_performance_counters where instance_name ='5e77016a-5c6e-49cc-ab26-0dc3a5b9c114' and counter_name ='Log Governor Tare'

O problema está relacionado com a quantidade de log:

	select * from sys.dm_tran_database_transactions

Não é um problema de latência ou IOPS.

	set statistics time on
	insert tb2 values(1)

	SQL Server Execution Times:
	   CPU time = 0 ms,  elapsed time = 49 ms.

Aumentando a CPU:

	while 1=1
	select count(*) from tbfast

	avg_cpu_percent                         avg_data_io_percent                     avg_log_write_percent              
	--------------------------------------- --------------------------------------- -----------------------------------
	63.35                                   3.83                                    100.00                             
	99.47                                   5.75                                    100.00                             
	98.90                                   4.00                                    96.11                              
	86.82                                   3.04                                    92.00                              
	99.34                                   4.41                                    98.29                              
	46.12                                   3.75                                    100.00                             
	11.06                                   3.79                                    99.67                              
	10.80                                   4.16                                    93.19                              
	10.48                                   3.50                                    100.00                             
	10.27                                   6.12                                    95.11                              
	10.47                                   3.54                                    99.97                              
	10.69                                   3.91                                    98.87                              
	10.00                                   4.12                                    95.02                              
	10.31                                   3.33                                    96.48                              
	10.01                                   3.91                                    96.14                              
	10.83                                   4.12                                    99.97                              
	10.14                                   4.54                                    98.55                              
	10.49                                   4.62                                    96.77                              
	10.49                                   3.58                                    100.00                             
	8.84                                    3.54                                    95.41                              
	12.53                                   3.66                                    100.00                             
	10.98                                   3.70                                    99.60                              

Ainda assim, o banco de dados continua funcionando. POr isso, é importante definir uma monitoração
na qual o banco de dados requer muito processamento (Premium) e um banco de dados que deve estar
bem otimizado.

As queries usadas:

select * from sys.dm_db_wait_stats
select * from sys.dm_exec_requests
select * from sys.dm_db_resource_stats
select * from sys.dm_os_memory_brokers
