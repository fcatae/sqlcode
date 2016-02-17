SELECT * FROM 
(VALUES
	('Edition', CAST(SERVERPROPERTY('Edition') AS VARCHAR)), 
	('ProductVersion', CAST(SERVERPROPERTY('ProductVersion') AS VARCHAR)),
	('productLevel', CAST(SERVERPROPERTY('ProductLevel') AS VARCHAR)),
	('ResourceVersion', CAST(SERVERPROPERTY('ResourceVersion') AS VARCHAR)),
	('ResourceLastUpdate', CONVERT(VARCHAR,SERVERPROPERTY('ResourceLastUpdateDateTime'),102)),
	('',''),
	('ServerName', @@SERVERNAME),
	('Database', DB_NAME()),
	('', ''),
	('Edition', CAST(DATABASEPROPERTYEX(DB_NAME(),'Edition') AS VARCHAR)),
	('ServiceObjective', CAST(DATABASEPROPERTYEX(DB_NAME(),'ServiceObjective') AS VARCHAR)),
	('MaxSizeInMBytes', CAST(CAST(DATABASEPROPERTYEX(DB_NAME(),'MaxSizeInBytes') AS BIGINT)/1024/1024 AS VARCHAR)),
	('',''),
	('Session', CAST(@@SPID AS VARCHAR)),
	('Date(UTC)', CONVERT(VARCHAR,GETUTCDATE(),120))
) 
A([SQL Azure],[Database Overview])




select * from sys.databases

select * from sys.database_connection_stats 
-- select * from sys.database_usage  NULL
select * from sys.elastic_pool_resource_stats 
select * from sys.event_log where event_category <> 'connectivity'
select * from sys.database_connection_stats 
 
 select * from sys.event_log
 --select * from sys.resource_usage 
 

declare @detailed int = 1
declare @logininfo int = 1
declare @layout int = 1
declare @permachine int = 0

declare @time datetime
SET @time = GETDATE()

SET NOCOUNT ON
SET LOCK_TIMEOUT 30000


IF @layout>0
BEGIN
	PRINT ''
	PRINT 'SQL Azure Database Overview'
	PRINT REPLICATE('-',50)
	PRINT 'CurrentSessionId: ' + CAST(@@SPID AS VARCHAR)
	PRINT 'CurrentDateUTC: ' + CONVERT(VARCHAR,GETUTCDATE(),120)
	PRINT ''
	PRINT 'ServerName: ' + @@SERVERNAME
	PRINT 'Database: ' + DB_NAME()
	PRINT ''
	PRINT 'Edition: ' + CAST(DATABASEPROPERTYEX(DB_NAME(),'Edition') AS VARCHAR)
	PRINT 'ServiceObjective: ' + CAST(DATABASEPROPERTYEX(DB_NAME(),'ServiceObjective') AS VARCHAR)
	PRINT 'MaxSizeInMBytes: ' + CAST(CAST(DATABASEPROPERTYEX(DB_NAME(),'MaxSizeInBytes') AS BIGINT)/1024/1024 AS VARCHAR)
	PRINT ''
	PRINT 'ProductVersion: ' + CAST(SERVERPROPERTY('ProductVersion') AS VARCHAR)
	PRINT 'ProductLevel: ' + CAST(SERVERPROPERTY('ProductLevel') AS VARCHAR)
	PRINT 'ResourceVersion: ' + CAST(SERVERPROPERTY('ResourceVersion') AS VARCHAR)
	PRINT 'ResourceLastUpdateDateTime: ' + CONVERT(VARCHAR,SERVERPROPERTY('ResourceLastUpdateDateTime'),102)
	PRINT 'Edition: ' + CAST(SERVERPROPERTY('Edition') AS VARCHAR)
END
ELSE
BEGIN
	select 
		spid = @@spid,
		getutcdate = GETUTCDATE(),
		servername = @@SERVERNAME,
		productVersion = SERVERPROPERTY('ProductVersion'),
		productLevel = SERVERPROPERTY('ProductLevel'),
		edition = SERVERPROPERTY('Edition'),
		resourceVersion = SERVERPROPERTY('ResourceVersion'),
		resourceLasteUpdateDateTime = SERVERPROPERTY('ResourceLastUpdateDateTime')

	select
		version = @@version

	select
		dbname = DB_NAME(),
		serviceObjective = DATABASEPROPERTYEX(DB_NAME(),'ServiceObjective'),
		maxSizeInMBytes = CAST(DATABASEPROPERTYEX(DB_NAME(),'MaxSizeInBytes') AS DECIMAL)/1024/1024,
		edition = DATABASEPROPERTYEX(DB_NAME(),'Edition')
END

PRINT ''
PRINT 'sys.databases'
PRINT '=============='
PRINT ''

SELECT 
d.database_id, 
	name=CAST(d.name AS VARCHAR(20)), 
	created = CONVERT(VARCHAR(12), d.create_date, 113), 
	state_desc=CAST(d.state_desc AS VARCHAR(14)), 
	cmpt_level = d.compatibility_level, 
	read_only = d.is_read_only, 
	autostat_crt = d.is_auto_create_stats_on, 
	autostat_upd = d.is_auto_update_stats_on, 
	autostat_async = d.is_auto_update_stats_async_on, 
	param_forced = d.is_parameterization_forced,
	d.owner_sid, 
	collation_name=CAST(d.collation_name AS VARCHAR(64)), 
	user_access_desc=CAST(d.user_access_desc AS VARCHAR(16)), 
	d.log_reuse_wait_desc,
	d.create_date
FROM sys.databases d

IF @logininfo>0
BEGIN

	PRINT ''
	PRINT 'Logins'
	PRINT '======='

	PRINT ''
	PRINT '# User Tokens'
	PRINT ''

	select principal_id, 
		name = cast(name as varchar(32)), 
		type = cast(type as varchar(10)), 
		usage = cast(usage as varchar(16)), 
		sid
		from sys.user_token

	PRINT ''
	PRINT '# SQL Logins'
	PRINT ''

	select l.principal_id, 
		login = cast(l.name as varchar(32)), 
		[user_name] = cast(p.name as varchar(32)),
		[schema_name] = p.default_schema_name,
		l.modify_date, 
		l.sid,
		p.*
	from sys.sql_logins l left join sys.database_principals p on l.sid = p.sid

	PRINT ''
	PRINT '# Role Membership'
	PRINT ''

	select 
		role_name = user_name(rm.role_principal_id),
		user_name = user_name(rm.member_principal_id)
	from sys.database_role_members rm
	order by role_name

	--select * from sys.sql_logins
	--select * from sys.database_principals
	--select * from sys.database_role_members

END


if @detailed > 0 	
begin
	--declare @rstats table(end_time datetime, database_name varchar(32), sku varchar(10), dtu_limit int, dtu int, storage_in_megabytes int, 
	--avg_cpu_percent decimal(2), avg_data_io_percent decimal(2), avg_log_write_percent decimal(2),  max_worker_percent decimal(2), max_session_percent decimal(2)
	--)

	--insert @rstats
	--select top 10 end_time, 
	--	database_name = cast(database_name as varchar(32)), 
	--	sku = cast(sku as varchar(10)), 
	--	dtu_limit, storage_in_megabytes, 
	--	dtu_current = IIF( IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent)>avg_log_write_percent , IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent), avg_log_write_percent ),
	--	avg_cpu_percent, avg_data_io_percent, avg_log_write_percent,  max_worker_percent, max_session_percent
	--from sys.resource_stats rs 

	--select * from @rstats
	--where
	--	(avg_cpu_percent > 10) OR
	--	(avg_data_io_percent > 10) OR
	--	(avg_log_write_percent > 10) OR
	--	(max_worker_percent > 10) OR
	--	(max_session_percent > 10)
	--order by end_time

	PRINT ''
	PRINT ''
	PRINT 'sys.resource_stats'
	PRINT '=============='
	PRINT ''
	
	declare @db int = 5*24;
	select @db = @db * (select count(*) from sys.databases) - 1;
	with vwDatabases As
	(
	select top(@db)
		timeslot = ( convert(varchar(15),end_time,121 )),
		database_name = cast(database_name as varchar(32)),
		max_dtu = max(IIF( IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent)>avg_log_write_percent , IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent), avg_log_write_percent )),
		max_cpu_percent = max(avg_cpu_percent), 
		max_data_io_percent = max(avg_data_io_percent), 
		max_log_write_percent = max(avg_log_write_percent) 
	from sys.resource_stats group by database_name, convert(varchar(15),end_time,121 )
	order by 1 desc
	)
	select
		timeslot = timeslot + '0', 
		database_name, 
		max_dtu = cast(max_dtu as int), 
		max_dtu_graph = cast( replicate('*',cast(max_dtu/5 as int)) as varchar(20)),
		max_cpu_percent = cast(max_cpu_percent as int), 
		max_data_io_percent = cast(max_data_io_percent as int), 
		max_log_write_percent = cast(max_log_write_percent as int)
	from vwDatabases order by database_name, timeslot
end

if @permachine>0 
begin
	SELECT * from sys.dm_os_schedulers -- 24 processors
	SELECT * FROM sys.dm_os_memory_clerks mc -- 136GB
	SELECT * FROM sys.dm_os_waiting_tasks wt -- 129 waiting tasks: VDI_CLIENT_OTHER, BROKER_TASK_STOP
	SELECT * FROM sys.dm_os_memory_brokers mb -- varios pools 
	DBCC SQLPERF(LOGSPACE) -- curioso!
end

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)'

select * from sys.dm_os_performance_counters