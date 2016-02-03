PRINT 'BLOCKER_PFE_END sys.databases '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.master_files'
---- VIEW ANY DEFINITION
--SELECT 
--	d.database_id, d.file_id, state_desc = CAST(d.state_desc AS VARCHAR(16)), type_desc=CAST(d.type_desc AS VARCHAR(16)), d.physical_name, d.file_guid, d.data_space_id, d.name, d.size, d.max_size, d.growth, d.is_media_read_only, d.is_read_only, d.is_sparse, d.is_percent_growth 
--FROM sys.master_files d
--PRINT 'BLOCKER_PFE_END sys.master_files '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.master_files[Size]'
---- VIEW ANY DEFINITION
--SELECT 
--	d.database_id, type_desc=CAST(d.type_desc AS VARCHAR(16)), 
--	CAST(d.size AS BIGINT)*8/1024 AS 'Size(MB)', 
--	CASE d.is_percent_growth 
--		WHEN 0 THEN CAST(d.growth AS INT)*8/1024
--		WHEN 1 THEN CAST(d.growth AS INT)*CAST(d.size AS INT)/100*8/1024
--	END AS 'Growth(MB)',
--	CASE d.is_percent_growth 
--		WHEN 0 THEN CAST( (100*d.growth/d.size) AS SMALLINT )
--		WHEN 1 THEN CAST( d.growth AS SMALLINT )
--	END AS 'Growth(perc)',	
--	d.physical_name
--FROM sys.master_files d
--ORDER BY d.physical_name
--PRINT 'BLOCKER_PFE_END sys.master_files[Size] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.traces'
---- VIEW ANY DEFINITION
--SELECT 
--	t.id, t.status, t.path, t.max_size, t.stop_time, t.max_files, t.is_rowset, t.is_rollover, t.is_shutdown, t.is_default, t.buffer_count, t.buffer_size, t.file_position, t.reader_spid, t.start_time, t.last_event_time, t.event_count, t.dropped_event_count 
--FROM sys.traces t
--PRINT 'BLOCKER_PFE_END sys.traces '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--TRUNCATE TABLE #filehandle

--INSERT #filehandle(file_handle, database_id, file_id, filename)
--SELECT vfs.file_handle, vfs.database_id, vfs.file_id, f.physical_name FROM sys.dm_io_virtual_file_stats(-1,-1) vfs
--	LEFT JOIN sys.master_files f ON vfs.database_id = f.database_id AND vfs.file_id = f.file_id
--	WHERE file_handle<>0
	
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
	c.client_net_address, c.client_tcp_port, 
	CAST(c.most_recent_sql_handle AS VARBINARY(26)) AS 'most_recent_sql_handle', 
	c.net_packet_size, c.encrypt_option,
	c.connect_time, 
	s.login_time
FROM sys.dm_exec_connections c left join sys.dm_exec_sessions s on c.session_id = s.session_id

PRINT 'BLOCKER_PFE_END sys.dm_exec_connections/sessions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
	
GO
-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
CREATE PROCEDURE #spBlockerPfe_1
AS

SET NOCOUNT ON
SET LOCK_TIMEOUT 250

DECLARE @time DATETIME

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
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_tasks'
SELECT
t.session_id, t.request_id, t.exec_context_id AS 'ecid',
task_state = CAST(t.task_state AS NVARCHAR(10)), 
t.context_switches_count AS 'context_switches', t.pending_io_count AS 'pending_io',
t.scheduler_id
FROM sys.dm_os_tasks t
WHERE session_id IN (SELECT session_id FROM sys.dm_exec_sessions WHERE is_user_process=1) AND session_id<>@@SPID 
PRINT 'BLOCKER_PFE_END sys.dm_os_tasks '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_waiting_tasks'
SELECT
wt.session_id as 'spid', wt.blocking_session_id as 'blocked_spid', 
wt.wait_duration_ms, 
CAST(wt.wait_type AS NVARCHAR(32)) AS 'wait_type', 
CAST(wt.resource_description AS NVARCHAR(128)) AS 'resource_description',
wt.exec_context_id AS 'ecid', wt.blocking_exec_context_id AS 'block_ecid'
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
dt.database_transaction_last_rollback_lsn AS 'rollback_lsn'
FROM sys.dm_tran_database_transactions dt
WHERE database_transaction_begin_time is NOT NULL

PRINT 'BLOCKER_PFE_END sys.dm_tran_database_transactions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

GO

-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
CREATE PROCEDURE #spBlockerPfe_1_handle
AS

SET NOCOUNT ON
SET LOCK_TIMEOUT 250

DECLARE @time DATETIME

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN CollectSqlHandle'

-- COLLECT ADHOC REQUEST
INSERT #sqlquery_requested
SELECT
	sql_handle,
	statement_start_offset,
	statement_end_offset,
	query_hash,
	query_plan_hash
FROM sys.dm_exec_requests
WHERE sql_handle is not null AND session_id <> @@spid

-- COLLECT CURSOR
INSERT #sqlquery_requested
SELECT
	sql_handle,
	statement_start_offset,
	statement_end_offset,
	NULL,
	NULL
FROM sys.dm_exec_cursors(0)

-- OPENTRAN
INSERT #sqlquery_requested
SELECT 
	c.most_recent_sql_handle,
	0,
	0,
	NULL,
	NULL
FROM sys.dm_exec_connections c
WHERE session_id IN (SELECT session_id FROM sys.dm_tran_session_transactions)  AND session_id <> @@spid

PRINT 'BLOCKER_PFE_END CollectSqlHandle ' + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
GO

-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
CREATE PROCEDURE #spBlockerPfe_2(@prevDate DATETIME)
AS

SET NOCOUNT ON
SET LOCK_TIMEOUT 3000

DECLARE @time DATETIME

--SELECT @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_resource_governor_resource_pools'

--select 
--wp.pool_id, CAST(wp.name AS VARCHAR(16)) AS 'name', wp.statistics_start_time, 
--wp.total_cpu_usage_ms, wp.cache_memory_kb, wp.compile_memory_kb, wp.used_memgrant_kb, wp.total_memgrant_count, 
--wp.total_memgrant_timeout_count, wp.active_memgrant_count, wp.active_memgrant_kb, wp.memgrant_waiter_count, 
--wp.max_memory_kb, wp.used_memory_kb, wp.target_memory_kb, 
--wp.out_of_memory_count, wp.min_cpu_percent, wp.max_cpu_percent, wp.min_memory_percent, wp.max_memory_percent 
--from sys.dm_resource_governor_resource_pools wp

--PRINT 'BLOCKER_PFE_END sys.dm_resource_governor_resource_pools '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--SELECT @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_resource_governor_workload_groups'

--SELECT 
--wg.group_id, wg.pool_id, CAST(wg.name AS VARCHAR(16)) AS 'name', 
--wg.active_request_count, wg.queued_request_count, wg.blocked_task_count, wg.active_parallel_thread_count, 
--wg.statistics_start_time, wg.total_request_count, wg.total_queued_request_count, wg.total_cpu_limit_violation_count, 
--wg.total_cpu_usage_ms, 
--wg.total_lock_wait_count, 
--wg.total_lock_wait_time_ms, 
--wg.total_query_optimization_count, 
--wg.total_suboptimal_plan_generation_count, 
--wg.total_reduced_memgrant_count, 
--wg.max_request_cpu_time_ms, 
--wg.max_request_grant_memory_kb, 
--wg.request_max_memory_grant_percent,
--CAST(wg.importance AS VARCHAR(16)) AS 'importance', 
--wg.request_max_cpu_time_sec, wg.group_max_requests, 
--wg.request_memory_grant_timeout_sec, wg.max_dop
--from sys.dm_resource_governor_workload_groups wg

--PRINT 'BLOCKER_PFE_END sys.dm_resource_governor_workload_groups '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_schedulers'

SELECT
	sos.scheduler_id, sos.is_online, sos.is_idle, 
	sos.current_tasks_count, sos.runnable_tasks_count, sos.active_workers_count, sos.current_workers_count, sos.work_queue_count, 
	sos.pending_disk_io_count, sos.scheduler_address
FROM sys.dm_os_schedulers sos

PRINT 'BLOCKER_PFE_END sys.dm_os_schedulers '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SET @time = GETDATE()
PRINT ''
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


--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_sys_memory'
---- SQL 2008
--SELECT 
--s.system_high_memory_signal_state, s.system_low_memory_signal_state, s.available_physical_memory_kb, 
--s.available_page_file_kb, 
--s.system_cache_kb, s.kernel_paged_pool_kb, s.kernel_nonpaged_pool_kb, 
--s.total_physical_memory_kb, 
--s.total_page_file_kb
--FROM sys.dm_os_sys_memory s

--PRINT 'BLOCKER_PFE_END sys.dm_os_sys_memory '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_process_memory'
---- SQL 2008
--SELECT
--p.process_physical_memory_low, p.process_virtual_memory_low,
--p.memory_utilization_percentage AS 'memory_utilization', p.available_commit_limit_kb, p.virtual_address_space_available_kb,
--p.physical_memory_in_use_kb, p.large_page_allocations_kb, p.locked_page_allocations_kb, 
--p.virtual_address_space_reserved_kb, p.virtual_address_space_committed_kb, p.total_virtual_address_space_kb
--FROM sys.dm_os_process_memory p

--PRINT 'BLOCKER_PFE_END dm_os_process_memory '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
 
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_memory_clerks'

SELECT
mc.type, total_kb = mc.pages_kb, --SQL2012
mc.memory_node_id, mc.awe_allocated_kb, mc.shared_memory_reserved_kb, mc.shared_memory_committed_kb, mc.name
FROM sys.dm_os_memory_clerks mc
--mc.type, total_kb = mc.single_pages_kb+mc.multi_pages_kb+mc.virtual_memory_committed_kb, WHERE single_pages_kb+multi_pages_kb+virtual_memory_committed_kb > 102400 --SQL2012
--mc.memory_node_id, mc.single_pages_kb, mc.multi_pages_kb, mc.virtual_memory_reserved_kb, mc.virtual_memory_committed_kb, mc.awe_allocated_kb, mc.shared_memory_reserved_kb, mc.shared_memory_committed_kb, mc.name
--WHERE single_pages_kb+multi_pages_kb+virtual_memory_committed_kb > 102400 --SQL2012
WHERE pages_kb > 102400 --SQL2012

select * from sys.dm_os_memory_clerks 

PRINT 'BLOCKER_PFE_END sys.dm_os_memory_clerks '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_memory_brokers'

SELECT
mb.pool_id, mb.memory_broker_type, 
mb.allocations_kb, mb.allocations_kb_per_sec, 
mb.predicted_allocations_kb, mb.target_allocations_kb, mb.future_allocations_kb, mb.overall_limit_kb, 
last_notification = CAST(mb.last_notification AS VARCHAR(8))
FROM sys.dm_os_memory_brokers mb

PRINT 'BLOCKER_PFE_END sys.dm_os_memory_brokers '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
  
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_active_transactions'

SELECT
t.transaction_id, t.name, t.transaction_begin_time, t.transaction_type, t.transaction_state
FROM sys.dm_tran_active_transactions t
WHERE transaction_type <> 2 -- read-only transaction

PRINT 'BLOCKER_PFE_END sys.dm_tran_active_transactions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
 
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_session_transactions'

SELECT
session_id, transaction_id, is_user_transaction AS 'is_user', is_local
FROM sys.dm_tran_session_transactions

PRINT 'BLOCKER_PFE_END sys.dm_tran_session_transactions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_tran_active_snapshot_database_transactions'

SELECT 
	a.session_id, a.elapsed_time_seconds, a.is_snapshot, 
	a.transaction_id, a.transaction_sequence_num, a.first_snapshot_sequence_num, a.max_version_chain_traversed, a.average_version_chain_traversed
FROM sys.dm_tran_active_snapshot_database_transactions a

PRINT 'BLOCKER_PFE_END sys.dm_tran_active_snapshot_database_transactions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_requests[System]'

--SELECT
--	req.session_id, req.blocking_session_id AS 'blocked', 
--	req.database_id AS db_id, req.command, 
--	req.total_elapsed_time AS 'elapsed_time', req.cpu_time, req.granted_query_memory AS 'granted_memory', req.logical_reads, 
--	req.wait_time, CAST(req.wait_type AS VARCHAR(16)) AS 'wait_type', 
--	req.open_transaction_count AS 'tran_count', 
--	req.reads, req.writes,  
--	req.start_time, req.status, req.connection_id, 
--	req.transaction_id, req.task_address, req.request_id
--FROM sys.dm_exec_requests req
--WHERE group_id = 1

--PRINT 'BLOCKER_PFE_END sys.dm_exec_requests[System] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN dm_os_tasks[System]'
--SELECT
--t.task_address, t.session_id, t.request_id, t.exec_context_id AS 'ecid',
--task_state = CAST(t.task_state AS NVARCHAR(10)), 
--t.context_switches_count AS 'context_switches', t.pending_io_count AS 'pending_io',
--t.scheduler_id, t.worker_address
--FROM sys.dm_os_tasks t
--WHERE worker_address IS NOT NULL
--	AND (session_id IN (SELECT session_id FROM sys.dm_exec_sessions WHERE is_user_process=0) OR session_id IS NULL)
--PRINT 'BLOCKER_PFE_END sys.dm_os_tasks[System] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_sessions[last_request_time]'

DECLARE @lasttime DATETIME

SET @lasttime = @prevDate
-- SET @lasttime = DATEADD(s,-60,GETDATE())

SELECT 
	s.session_id, 
	s.login_time,
	s.status, 
	s.cpu_time, s.memory_usage, s.total_scheduled_time, s.total_elapsed_time, 
	s.last_request_start_time, s.last_request_end_time, 
	s.reads, s.writes, s.logical_reads, 
	s.row_count, 
	s.prev_error
FROM sys.dm_exec_sessions s 
WHERE (s.last_request_end_time > @lasttime OR s.last_request_end_time IS NULL) OR s.last_request_start_time > @lasttime 

PRINT 'BLOCKER_PFE_END sys.dm_exec_sessions[last_request_time] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_connections/sessions'
	
-- DECLARE @lasttime DATETIME
DECLARE @tbSessions TABLE (spid INT PRIMARY KEY)

INSERT @tbSessions(spid)
SELECT DISTINCT session_id FROM
	(
		SELECT session_id FROM sys.dm_exec_requests
	UNION ALL
		SELECT session_id FROM sys.dm_tran_session_transactions
	UNION ALL
		SELECT blocking_session_id FROM sys.dm_os_waiting_tasks WHERE blocking_session_id IS NOT NULL
	UNION ALL 
		SELECT session_id FROM sys.dm_exec_connections c
		WHERE c.connect_time > @lasttime
	) t
	WHERE session_id IS NOT NULL
	
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
WHERE c.session_id IN (SELECT spid FROM @tbSessions)
	
PRINT 'BLOCKER_PFE_END sys.dm_exec_connections/sessions '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_wait_stats'

select 
	w.wait_type, 
	w.waiting_tasks_count, 
	w.wait_time_ms, w.max_wait_time_ms, w.signal_wait_time_ms
from sys.dm_os_wait_stats w where wait_time_ms > 60000

PRINT 'BLOCKER_PFE_END sys.dm_os_wait_stats '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

-- restrito 
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_latch_stats'

select
	l.latch_class, l.waiting_requests_count, l.wait_time_ms, l.max_wait_time_ms
from sys.dm_os_latch_stats l where wait_time_ms > 60000

PRINT 'BLOCKER_PFE_END sys.dm_os_latch_stats '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


--SET @time = GETDATE()
--PRINT ''
--PRINT 'BLOCKER_PFE_BEGIN sys.dm_os_spinlock_stats'

--select 
--	CAST(s.name AS VARCHAR(64)) AS 'name', 
--	s.collisions, s.spins, s.spins_per_collision, s.sleep_time, s.backoffs
--from sys.dm_os_spinlock_stats s where sleep_time > 100

--PRINT 'BLOCKER_PFE_END sys.dm_os_spinlock_stats '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_exec_query_resource_semaphores'

SELECT 
	qrsem.resource_semaphore_id, qrsem.target_memory_kb, qrsem.max_target_memory_kb, qrsem.total_memory_kb, qrsem.available_memory_kb, qrsem.granted_memory_kb, qrsem.used_memory_kb, qrsem.grantee_count, qrsem.waiter_count, qrsem.timeout_error_count, qrsem.forced_grant_count, qrsem.pool_id
FROM sys.dm_exec_query_resource_semaphores qrsem

PRINT 'BLOCKER_PFE_END sys.dm_exec_query_resource_semaphores '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
 
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_io_pending_io_requests'

DECLARE @pending_io_requests_summary INT = 0

SELECT TOP 512
	io.io_pending_ms_ticks, io.io_pending, io.scheduler_address, io_pending_handle=io.io_handle, io.io_offset
FROM sys.dm_io_pending_io_requests io
ORDER BY io_pending_ms_ticks DESC

--IF @@ROWCOUNT > 32
SET @pending_io_requests_summary = 1

PRINT 'BLOCKER_PFE_END sys.dm_io_pending_io_requests '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

IF @pending_io_requests_summary = 1 
BEGIN
	SET @time = GETDATE()
	PRINT ''
	PRINT 'BLOCKER_PFE_BEGIN sys.dm_io_pending_io_requests[summary]'

	SELECT * FROM 
		(SELECT count=COUNT(*), avg_pending_ms_ticks=AVG(io_pending_ms_ticks), io_handle
		FROM sys.dm_io_pending_io_requests WHERE io_pending = 1 GROUP BY io_handle) i
	LEFT JOIN #filehandle f ON i.io_handle = f.file_handle
	ORDER BY avg_pending_ms_ticks DESC

	PRINT 'BLOCKER_PFE_END sys.dm_io_pending_io_requests[summary] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
END
	 
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.dm_io_virtual_file_stats'

SELECT 
	fs.database_id, fs.file_id, 
	fs.num_of_reads, fs.num_of_bytes_read, fs.io_stall_read_ms, fs.num_of_writes, fs.num_of_bytes_written, fs.io_stall_write_ms, fs.io_stall, 
	fs.size_on_disk_bytes, virtual_file_handle = fs.file_handle
FROM sys.dm_io_virtual_file_stats (-1,-1) fs

PRINT 'BLOCKER_PFE_END sys.dm_io_virtual_file_stats '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN sys.databases[log_reuse_wait_desc]'

SELECT d.name, d.log_reuse_wait_desc
FROM sys.databases d 
WHERE d.log_reuse_wait <> 0

PRINT 'BLOCKER_PFE_END sys.databases[log_reuse_wait_desc] '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
 
SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN DBCC_SQLPERF_LOGSPACE'

DBCC SQLPERF(LOGSPACE)

PRINT 'BLOCKER_PFE_END DBCC_SQLPERF_LOGSPACE '  + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SELECT @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN DBCC_OPENTRAN'
DBCC OPENTRAN
--DECLARE @dbid INT
--DECLARE curDatabases CURSOR FAST_FORWARD FOR
--SELECT database_id FROM sys.databases WHERE state=0
--OPEN curDatabases;
--FETCH NEXT FROM curDatabases INTO @dbid;
--WHILE (@@FETCH_STATUS <> -1)
--BEGIN
--	PRINT ''
--	DBCC OPENTRAN(@dbid)
--	FETCH NEXT FROM curDatabases INTO @dbid
--END
--DEALLOCATE curDatabases

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

-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
CREATE PROCEDURE #spBlockerPfe_2_handle
AS

SET NOCOUNT ON
SET LOCK_TIMEOUT 3000

DECLARE @time DATETIME

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN CollectSqlHandle2'

-- OPENTRAN
INSERT #sqlquery_requested
SELECT 
	c.most_recent_sql_handle,
	0,
	0,
	NULL,
	NULL
FROM sys.dm_exec_connections c
WHERE session_id IN (SELECT session_id FROM sys.dm_tran_session_transactions) AND session_id <> @@spid

PRINT 'BLOCKER_PFE_END CollectSqlHandle2 ' + convert(VARCHAR(12), datediff(ms,@time,getdate())) 


SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN FlushSqlHandle[object_name]'

SELECT DISTINCT
	CAST(req.sql_handle AS VARBINARY(26)) AS 'sql_handle',
	
	CAST(
		DB_NAME(dbid) + N'.' + 
		OBJECT_SCHEMA_NAME(objectid,dbid) + N'.' + 
		OBJECT_NAME(objectid,dbid) AS NVARCHAR(128)) AS 'object_name',
	st.dbid, st.objectid
FROM #sqlquery_requested req
CROSS APPLY sys.dm_exec_sql_text(req.sql_handle) st
WHERE objectid IS NOT NULL
ORDER BY dbid, objectid

PRINT 'BLOCKER_PFE_END FlushSqlHandle[object_name] ' + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN FlushSqlHandle[sqlquery_requested]'
SELECT
'COUNT=',			Count=COUNT(*),
'SQLHANDLE=',		CAST(req.sql_handle AS VARBINARY(26)) AS 'sql_handle',
	req.stmt_start, 
	req.stmt_end,
	'QUERY_HASH=',		req.query_hash,
	'QUERY_PLAN_HASH=',	req.query_plan_hash
FROM #sqlquery_requested req
WHERE req.query_hash IS NOT NULL
GROUP BY sql_handle, query_hash, stmt_start, req.stmt_end, req.query_plan_hash
ORDER BY COUNT(*) DESC

PRINT 'BLOCKER_PFE_END FlushSqlHandle[sqlquery_requested] ' + convert(VARCHAR(12), datediff(ms,@time,getdate())) 

SET @time = GETDATE()
PRINT ''
PRINT 'BLOCKER_PFE_BEGIN FlushSqlHandle[dm_exec_sql_text]'
SELECT TOP 1000
'COUNT=',			COUNT(*),
'SQLHANDLE=',		CAST(req.sql_handle AS VARBINARY(26)) AS 'sql_handle',
'SQLHASH=',			req.query_hash,
	req.stmt_start, 
	req.stmt_end,
	CHAR(13) + CHAR(10),
	'SQLTEXT=',			sqltext=(SELECT SUBSTRING(	text, stmt_start/2 + 1, 
												((CASE	WHEN stmt_end = -1 THEN DATALENGTH(text) 
														WHEN stmt_end = 0 THEN 1024
														ELSE stmt_end END) - stmt_start)/2 )
						FROM sys.dm_exec_sql_text(sql_handle))
FROM #sqlquery_requested req 
GROUP BY sql_handle, query_hash, stmt_start, req.stmt_end
ORDER BY COUNT(*) DESC

TRUNCATE TABLE #sqlquery_requested

PRINT 'BLOCKER_PFE_END FlushSqlHandle[dm_exec_sql_text] ' + convert(VARCHAR(12), datediff(ms,@time,getdate())) 
GO

-----------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------
GO

-----------------------------------------------------------------------------------------------------
EXEC #spBlockerPFE
-----------------------------------------------------------------------------------------------------
