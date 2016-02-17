
SQL Server machine

	SELECT * from sys.dm_os_schedulers -- 24 processors
	SELECT * FROM sys.dm_os_memory_clerks mc -- 136GB
	SELECT * FROM sys.dm_os_waiting_tasks wt -- 129 waiting tasks: VDI_CLIENT_OTHER, BROKER_TASK_STOP
	SELECT * FROM sys.dm_os_memory_brokers mb -- varios pools 
	DBCC SQLPERF(LOGSPACE) -- curioso!

Database Management

CREATE DATABASE <database>
ALTER DATABASE <database> MODIFY (SERVICE_OBJECTIVE='')

SELECT * FROM sys.dm_operation_status


ALTER DATABASE dbazure
MODIFY
(SERVICE_OBJECTIVE='S1');
