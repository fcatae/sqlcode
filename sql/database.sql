
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
	PRINT '# Role Membership'
	PRINT ''

	select 
		role_name = user_name(rm.role_principal_id),
		user_name = user_name(rm.member_principal_id)
	from sys.database_role_members rm
	order by role_name

END


if @detailed > 0 	
begin

	select * from sys.dm_db_resource_stats

	PRINT ''
	PRINT ''
	PRINT 'sys.dm_db_resource_stats'
	PRINT '=============='
	PRINT ''
	


	with vwDatabases As
	(
	select 
		timeslot = end_time,
		max_dtu = (IIF( IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent)>avg_log_write_percent , IIF(avg_cpu_percent>avg_data_io_percent, avg_cpu_percent, avg_data_io_percent), avg_log_write_percent )),
		max_cpu_percent = (avg_cpu_percent), 
		max_data_io_percent = (avg_data_io_percent), 
		max_log_write_percent = (avg_log_write_percent),
		max_worker_percent, 
		max_session_percent 
	from sys.dm_db_resource_stats 
	--order by 1 desc
	)
	select
		timeslot = convert(varchar(19),timeslot, 121) + ' ',
		max_dtu = cast(max_dtu as int), 
		max_dtu_graph = cast( replicate('*',cast(max_dtu/5 as int)) as varchar(20)),
		max_cpu_percent = cast(max_cpu_percent as int), 
		max_data_io_percent = cast(max_data_io_percent as int), 
		max_log_write_percent = cast(max_log_write_percent as int),
		max_worker_percent = cast(max_worker_percent as int), 
		max_session_percent = cast(max_session_percent as int)
	from vwDatabases order by timeslot

	select * from sys.dm_exec_requests




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



















exec sp_spaceused



SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_sessions'

SELECT 
	s.session_id, 
	s.group_id, 
	CAST(s.status AS VARCHAR(16)) AS 'status',
	CAST(s.host_name AS VARCHAR(20)) AS 'host_name', 
	CAST(s.login_name AS VARCHAR(32)) AS 'login_name', 
	CAST(s.program_name AS VARCHAR(64)) AS 'program_name', 
	s.host_process_id, 
	CAST(s.original_login_name AS VARCHAR(32)) AS 'original_login_name', 
	s.client_interface_name, s.client_version, 
	s.login_time
FROM sys.dm_exec_sessions s 

PRINT 'BLOCKER_PFE_END sys.dm_exec_sessions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
	
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_connections/sessions'

SELECT 
	s.session_id, 
	s.group_id, 
	CAST(s.status AS VARCHAR(16)) AS 'status',
	CAST(s.host_name AS VARCHAR(20)) AS 'host_name', 
	CAST(s.login_name AS VARCHAR(32)) AS 'login_name', 
	CAST(s.program_name AS VARCHAR(64)) AS 'program_name', 
	s.host_process_id, 
	c.connection_id,
	CAST(s.original_login_name AS VARCHAR(32)) AS 'original_login_name', 
	s.client_interface_name, s.client_version, 
	CAST(c.auth_scheme AS VARCHAR(16)) AS 'auth_scheme', 
	CAST(c.net_transport AS VARCHAR(16)) AS 'net_transport', 
	c.client_net_address, --c.client_tcp_port, 
	CAST(c.most_recent_sql_handle AS VARBINARY(26)) AS 'most_recent_sql_handle', 
	c.net_packet_size, c.encrypt_option,
	c.connect_time, 
	s.login_time
FROM sys.dm_exec_connections c left join sys.dm_exec_sessions s on c.session_id = s.session_id

PRINT 'BLOCKER_PFE_END sys.dm_exec_connections/sessions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
	
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_requests'

SELECT 
	req.session_id, req.blocking_session_id AS 'blocked', 
	req.database_id AS db_id, req.command, 
	req.total_elapsed_time AS 'elapsed_time', req.cpu_time, req.granted_query_memory AS 'granted_memory', req.logical_reads, 
	req.wait_time, CAST(req.wait_type AS VARCHAR(16)) AS 'wait_type', 
	req.open_transaction_count AS 'tran_count', 
	req.reads, req.writes,  
	req.start_time, req.status, req.connection_id, req.user_id, 
	req.group_id, -- KATMAI (SQL2008)
	req.transaction_id, req.request_id, 
	CAST(req.plan_handle AS VARBINARY(26)) AS 'plan_handle', 
	CAST(req.sql_handle AS VARBINARY(26)) AS 'sql_handle', 
	req.nest_level,
	req.statement_start_offset AS 'stmt_start', req.statement_end_offset AS 'stmt_end', 
	req.query_hash, req.query_plan_hash
FROM sys.dm_exec_requests req
WHERE session_id<>@@SPID  --group_id > 1 AND session_id<>@@SPID 

PRINT 'BLOCKER_PFE_END sys.dm_exec_requests '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_cursors'

SELECT
	c.session_id, c.cursor_id, 
	DATEDIFF(ms, c.creation_time, GETDATE()) AS 'elapsed_time', 
	c.worker_time, c.reads, c.writes, c.dormant_duration, c.fetch_buffer_start, 
	c.ansi_position, c.is_open, c.fetch_status, c.creation_time, 
	CAST(c.sql_handle AS VARBINARY(26)) AS 'sql_handle', 
	c.statement_start_offset AS 'stmt_start', c.statement_end_offset AS 'stmt_end', 
	c.plan_generation_num, c.is_async_population, c.is_close_on_commit, c.fetch_buffer_size
FROM sys.dm_exec_cursors(0) c
 
PRINT 'BLOCKER_PFE_END sys.dm_exec_cursors '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_query_memory_grants'

SELECT
	mg.session_id, 
	mg.query_cost, mg.dop, 
	convert(VARCHAR(12), datediff(ms,request_time,getdate())) AS 'elapsed_time',
	mg.wait_time_ms, 
	mg.resource_semaphore_id AS 'sem_id', mg.requested_memory_kb, mg.granted_memory_kb, 
	mg.used_memory_kb, mg.required_memory_kb, mg.max_used_memory_kb, mg.ideal_memory_kb, 
	mg.request_time, mg.grant_time, mg.timeout_sec, 
	mg.queue_id, mg.wait_order, 
	mg.request_id,
	CAST(mg.plan_handle AS VARBINARY(26)) AS 'plan_handle', 
	CAST(mg.sql_handle AS VARBINARY(26)) AS 'sql_handle', 
	mg.group_id, mg.pool_id
FROM sys.dm_exec_query_memory_grants mg

PRINT 'BLOCKER_PFE_END sys.dm_exec_query_memory_grants '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 



SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_waiting_tasks'
SELECT
wt.session_id as 'spid', wt.blocking_session_id as 'blocked_spid', 
wt.wait_duration_ms, 
CAST(wt.wait_type AS NVARCHAR(32)) AS 'wait_type', 
CAST(wt.resource_description AS NVARCHAR(128)) AS 'resource_description',
wt.exec_context_id AS 'ecid', wt.blocking_exec_context_id AS 'block_ecid',*
FROM sys.dm_os_waiting_tasks wt
WHERE session_id IN (SELECT session_id FROM sys.dm_exec_sessions WHERE is_user_process=1)
PRINT 'BLOCKER_PFE_END sys.dm_os_waiting_tasks  '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_database_transactions'

SELECT 
dt.transaction_id, dt.database_id AS 'db_id', 
DATEDIFF(ms, dt.database_transaction_begin_time, GETDATE()) AS 'time_ms', 
dt.database_transaction_type AS 'type', 
dt.database_transaction_state AS 'state', 
dt.database_transaction_log_record_count AS 'log_record_count', 
dt.database_transaction_log_bytes_used AS 'log_bytes_used', 
dt.database_transaction_log_bytes_reserved AS 'log_bytes_reserved', 
dt.database_transaction_begin_time AS 'begin_time', 
dt.database_transaction_begin_lsn AS 'begin_lsn', 
dt.database_transaction_last_lsn AS 'last_lsn',
dt.database_transaction_last_rollback_lsn AS 'rollback_lsn',*
FROM sys.dm_tran_database_transactions dt
WHERE database_transaction_begin_time is NOT NULL

PRINT 'BLOCKER_PFE_END sys.dm_tran_database_transactions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_waiting_tasks[BlockedSessions]';

;WITH cteBlockedSessions
AS
	(
	SELECT session_id, blocking_session_id FROM sys.dm_os_waiting_tasks 
	WHERE blocking_session_id <> session_id 
	)
SELECT 
	blk.blocking_session_id AS 'session_id', 
	CAST(c.most_recent_sql_handle AS VARBINARY(26)) as 'most_recent_sql_handle',
	at.transaction_id,
	DATEDIFF(ms, at.transaction_begin_time, GETDATE()) AS 'elapsed_time',
	CAST(r.sql_handle AS VARBINARY(26)) as 'sql_handle',
	r.statement_start_offset, r.statement_end_offset,
	at.transaction_begin_time, at.transaction_state 
FROM cteBlockedSessions blk 
	INNER JOIN sys.dm_exec_connections c ON blk.blocking_session_id = c.session_id
	INNER JOIN sys.dm_tran_session_transactions st ON st.session_id = c.session_id
	INNER JOIN sys.dm_tran_active_transactions at ON st.transaction_id = at.transaction_id
	LEFT JOIN sys.dm_exec_requests r ON c.session_id = r.session_id
WHERE blk.blocking_session_id not in (SELECT session_id FROM cteBlockedSessions)

PRINT 'BLOCKER_PFE_END sys.dm_os_waiting_tasks[BlockedSessions] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

PRINT 'BLOCKER_PFE_END sys.dm_os_memory_clerks '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_active_transactions'

SELECT
t.transaction_id, t.name, t.transaction_begin_time, t.transaction_type, t.transaction_state
FROM sys.dm_tran_active_transactions t
WHERE transaction_type <> 2 -- read-only transaction

SELECT
session_id, transaction_id, is_user_transaction AS 'is_user', is_local
FROM sys.dm_tran_session_transactions

SELECT 
	a.session_id, a.elapsed_time_seconds, a.is_snapshot, 
	a.transaction_id, a.transaction_sequence_num, a.first_snapshot_sequence_num, a.max_version_chain_traversed, a.average_version_chain_traversed
FROM sys.dm_tran_active_snapshot_database_transactions a


PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_connections/sessions'
	
-- DECLARE @lasttime DATETIME
DECLARE @tbSessions TABLE (spid INT PRIMARY KEY)

	
SELECT 
	s.session_id, 
	s.group_id, 
	CAST(s.status AS VARCHAR(16)) AS 'status',
	CAST(s.host_name AS VARCHAR(20)) AS 'host_name', 
	CAST(s.login_name AS VARCHAR(32)) AS 'login_name', 
	CAST(s.program_name AS VARCHAR(64)) AS 'program_name', 
	s.host_process_id, 
	c.connection_id,
	CAST(s.original_login_name AS VARCHAR(32)) AS 'original_login_name', 
	s.client_interface_name, s.client_version, 
	CAST(c.auth_scheme AS VARCHAR(16)) AS 'auth_scheme', 
	CAST(c.net_transport AS VARCHAR(16)) AS 'net_transport', 
	c.client_net_address, c.client_tcp_port, 
	CAST(c.most_recent_sql_handle AS VARBINARY(26)) AS 'most_recent_sql_handle', 
	c.net_packet_size, c.encrypt_option,
	c.connect_time, s.login_time
FROM sys.dm_exec_connections c left join sys.dm_exec_sessions s on c.session_id = s.session_id


--select 
--	w.wait_type, 
--	w.waiting_tasks_count, 
--	w.wait_time_ms, w.max_wait_time_ms, w.signal_wait_time_ms
--from sys.dm_os_wait_stats w where wait_time_ms > 60000


select 
	w.wait_type, 
	w.waiting_tasks_count, 
	w.wait_time_ms, w.max_wait_time_ms, w.signal_wait_time_ms
from sys.dm_db_wait_stats w 

PRINT 'BLOCKER_PFE_END sys.dm_os_wait_stats '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SELECT 
	qrsem.resource_semaphore_id, qrsem.target_memory_kb, qrsem.max_target_memory_kb, qrsem.total_memory_kb, qrsem.available_memory_kb, qrsem.granted_memory_kb, qrsem.used_memory_kb, qrsem.grantee_count, qrsem.waiter_count, qrsem.timeout_error_count, qrsem.forced_grant_count, qrsem.pool_id
FROM sys.dm_exec_query_resource_semaphores qrsem

PRINT 'BLOCKER_PFE_END sys.dm_exec_query_resource_semaphores '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
 
--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_io_pending_io_requests'

--DECLARE @pending_io_requests_summary INT = 0

--SELECT TOP 512
--	io.io_pending_ms_ticks, io.io_pending, io.scheduler_address, io_pending_handle=io.io_handle, io.io_offset
--FROM sys.dm_io_pending_io_requests io
--ORDER BY io_pending_ms_ticks DESC


PRINT 'BLOCKER_PFE_END DBCC_SQLPERF_LOGSPACE '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SELECT @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN DBCC_OPENTRAN'
DBCC OPENTRAN

select * from sys.databases
PRINT 'BLOCKER_PFE_END DBCC_OPENTRAN '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_locks[OBJECTS]'
SELECT
l.resource_database_id AS 'db_id', l.resource_associated_entity_id AS 'entity_id', 
CAST(l.request_mode AS VARCHAR(8)) AS req_mode, req_status = CAST(l.request_status AS VARCHAR(8)),
l.request_session_id AS 'session_id', l.request_owner_id, 
resource_subtype = CAST(l.resource_subtype AS VARCHAR(16)),
object_description = CASE WHEN request_mode NOT LIKE 'Sch-%' THEN 
	CAST(
		DB_NAME(resource_database_id) + N'.' +
		OBJECT_SCHEMA_NAME(resource_associated_entity_id, resource_database_id) + N'.' +
		OBJECT_NAME(resource_associated_entity_id, resource_database_id) AS NVARCHAR(64))
	ELSE CAST(resource_description AS NVARCHAR(64)) END 
FROM sys.dm_tran_locks l
WHERE l.resource_type = 'OBJECT'

PRINT 'BLOCKER_PFE_END sys.dm_tran_locks[OBJECTS] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_locks[WAIT]'
SELECT
CAST(l.resource_type AS VARCHAR(12)) AS 'resource_type',
l.resource_database_id AS 'db_id', l.resource_associated_entity_id AS 'entity_id', 
CAST(l.request_mode AS VARCHAR(8)) AS 'req_mode', req_status = CAST(l.request_status AS VARCHAR(8)),
l.request_session_id AS 'session_id', l.request_owner_id, 
resource_subtype = CAST(l.resource_subtype AS VARCHAR(16)),
resource_description =
	CASE WHEN l.resource_type = 'OBJECT' AND request_mode NOT LIKE 'Sch-%' THEN 
		CAST(
		DB_NAME(resource_database_id) + N'.' +
		OBJECT_SCHEMA_NAME(resource_associated_entity_id, resource_database_id) + N'.' +
		OBJECT_NAME(resource_associated_entity_id, resource_database_id) AS NVARCHAR(64))
	ELSE CAST(resource_description AS NVARCHAR(64)) END
FROM sys.dm_tran_locks l
WHERE l.request_status = 'WAIT'
	
PRINT 'BLOCKER_PFE_END sys.dm_tran_locks[WAIT] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

GO


select * from sys.dm_xe_database_sessions

max_event_limit

select * from sys.dm_xe_objects where object_type='event'

create event session fabricio2 on database
	add event wait_info

alter event session fabricio2 on database
	add target ring_buffer(set max_events_limit=10000,max_memory=10000)

select * from sys.dm_os_performance_counters

select * from sys.databases