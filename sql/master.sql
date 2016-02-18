PRINT 'Master Script v1.0'
PRINT ''

DECLARE @fast BIT = 0
DECLARE @time DATETIME

SET NOCOUNT ON

SELECT * FROM 
(VALUES
	('Edition', CAST(SERVERPROPERTY('Edition') AS VARCHAR)), 
	('ProductVersion', CAST(SERVERPROPERTY('ProductVersion') AS VARCHAR)),
	('ProductLevel', CAST(SERVERPROPERTY('ProductLevel') AS VARCHAR)),
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
A([SQL Azure],[Database Overview]);


PRINT ''
PRINT '-- SELECT * FROM sys.[databases]' -- list all databases
PRINT ''
SELECT @time = GETDATE()

SELECT 
	database_id, 
	name=CAST(name as VARCHAR(20)), 
	database_owner=(SELECT CAST(name as VARCHAR(16)) FROM sys.sql_logins WHERE sid=owner_sid), 
	created = CONVERT(VARCHAR(12), create_date, 113),
	create_date, 
	compatibility_level, 
	collation_name = CAST(collation_name AS VARCHAR(30)), 
	is_read_only, 
	state_desc=CAST(state_desc AS VARCHAR(10)),  
	is_auto_create_stats_on, 
	is_auto_create_stats_incremental_on, 
	is_auto_update_stats_on, 
	is_auto_update_stats_async_on,
	target_recovery_time_in_seconds,
	containment_desc = cast(containment_desc AS VARCHAR(18)), 
	is_parameterization_forced, 
	delayed_durability_desc,
	is_query_store_on
FROM sys.databases;

-- ALTER DATABASE <database> SET READ_ONLY
-- ALTER DATABASE <database> SET DELAYED_DURABILITY = FORCED

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';


PRINT ''
PRINT '-- SELECT * FROM sys.[elastic_pool_resource_stats]' -- resource consumption (elastic pool)
PRINT ''
SELECT @time = GETDATE()

SELECT 
	start_time, 
	end_time, 
	elastic_pool_name=CAST(elastic_pool_name AS VARCHAR(32)), 
	max_dtu = CAST(IIF( IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent)>avg_log_write_percent , IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent), avg_log_write_percent ) AS VARCHAR(6)),
	elastic_pool_dtu_limit, 
	elastic_pool_storage_limit_mb, 
	avg_storage_percent, 
	avg_cpu_percent, 
	avg_data_io_percent, 
	avg_log_write_percent, 
	max_worker_percent, 
	max_session_percent 
FROM sys.elastic_pool_resource_stats --ORDER BY 1 DESC
WHERE end_time > DATEADD(s,-3600,GETDATE())

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';


PRINT ''
PRINT '-- SELECT * FROM sys.[resource_stats]' -- resource consumption (servers)
PRINT ''
SELECT @time = GETDATE()

DECLARE @numdb INT = (SELECT COUNT(*)-1 FROM sys.databases)

SELECT TOP(@numdb) 
	start_time, 
	end_time, 
	database_name = CAST(database_name AS VARCHAR(32)), 
	max_dtu = CAST(IIF( IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent)>avg_log_write_percent , IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent), avg_log_write_percent ) AS VARCHAR(6)),
	sku = CAST(sku AS VARCHAR(6)),  
	dtu_limit,
	storage_in_megabytes, 
	avg_cpu_percent, 
	avg_data_io_percent, 
	avg_log_write_percent, 
	max_worker_percent, 
	max_session_percent		
FROM sys.resource_stats ORDER BY 1 DESC
-- Bug: Filtering with WHERE is slow. Use TOP + ORDER_BY instead.

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';

PRINT ''
PRINT '-- SELECT * FROM sys.[database_connection_stats]' 
PRINT ''
SELECT @time = GETDATE()

IF @fast=0
BEGIN
	SELECT
		database_name, 
		start_time, 
		end_time, 
		success_count, 
		total_failure_count, 
		connection_failure_count, 
		terminated_connection_count, 
		throttled_connection_count	
	FROM sys.database_connection_stats 
	WHERE end_time > DATEADD(s,-3600,GETDATE())
	ORDER BY end_time DESC
END

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';


PRINT ''
PRINT '-- SELECT * FROM sys.[user_token]'
PRINT ''
SELECT @time = GETDATE()

SELECT principal_id, 
	name = CAST(name AS VARCHAR(32)), 
	[type] = CAST([type] AS VARCHAR(10)), 
	[usage] = CAST(usage AS VARCHAR(16)), 
	[sid]
FROM sys.user_token

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';


PRINT ''
PRINT '-- SELECT * FROM sys.[sql_logins] JOIN sys.[database_principals]'
PRINT ''
SELECT @time = GETDATE()

SELECT l.principal_id, 
	login = CAST(l.name AS VARCHAR(32)), 
	[user_name] = CAST(p.name AS VARCHAR(32)),
	[default_schema_name] = p.default_schema_name,
	l.modify_date, 
	l.sid
FROM sys.sql_logins l LEFT JOIN sys.database_principals p ON l.sid = p.sid

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';


PRINT ''
PRINT '-- SELECT * FROM sys.[database_role_members]'
PRINT ''
SELECT @time = GETDATE()

SELECT 
	[role_name] = CAST(USER_NAME(rm.role_principal_id) AS VARCHAR(32)),
	[user_name] = CAST(USER_NAME(rm.member_principal_id) AS VARCHAR(32))
FROM sys.database_role_members rm
ORDER BY role_name

PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)';


PRINT ''
PRINT '-- WITH() SELECT * FROM sys.[resource_stats]'
PRINT ''
SELECT @time = GETDATE()

SELECT @time = GETDATE()

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


PRINT '(Processing time: '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) + 'ms)'
