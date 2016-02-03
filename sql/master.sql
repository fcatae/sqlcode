declare @time datetime
declare @detailed int = 0

SET NOCOUNT ON
SET LOCK_TIMEOUT 30000

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

if @detailed > 0 	
	select * from sys.resource_stats

SET @time = GETDATE()
PRINT ''
PRINT '# Logins'
PRINT ''

select * from sys.sql_logins
select * from sys.database_principals
select * from sys.database_role_members

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)'

SET @time = GETDATE()
PRINT ''
PRINT '# sys.dm_exec_sessions'
PRINT ''

SELECT 
d.database_id, d.name, state_desc=CAST(d.state_desc AS VARCHAR(20)), user_access_desc=CAST(d.user_access_desc AS VARCHAR(16)), d.compatibility_level, 
	d.create_date, collation_name=CAST(d.collation_name AS VARCHAR(64)), d.owner_sid, 
	d.log_reuse_wait_desc, 
	read_only = d.is_read_only, 
	autostat_crt = d.is_auto_create_stats_on, 
	autostat_upd = d.is_auto_update_stats_on, 
	autostat_async = d.is_auto_update_stats_async_on, 
	param_forced = d.is_parameterization_forced
FROM sys.databases d

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)'
