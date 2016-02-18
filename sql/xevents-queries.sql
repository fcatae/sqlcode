select * from sys.dm_exec_requests
select * from sys.dm_db_resource_stats
select cast(address as int),* from sys.dm_xe_database_sessions
select cast(target_data as xml), event_session_address from sys.dm_xe_database_session_targets
GO

DROP EVENT SESSION queries ON DATABASE
GO
CREATE EVENT SESSION queries ON DATABASE
    ADD EVENT rpc_completed(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0 AND duration>100000),
    ADD EVENT sql_batch_completed(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0 AND duration>100000),
    ADD EVENT sp_statement_completed(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0 AND duration>100000),
    ADD EVENT sql_statement_completed(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0 AND duration>100000),
    ADD EVENT sql_transaction(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0 AND transaction_type<>0 AND duration>100000),
    ADD EVENT attention(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0),
    ADD EVENT error_reported(
		ACTION(session_id, client_app_name,client_hostname,username, query_hash,query_plan_hash,plan_handle, sql_text)
		WHERE sqlserver.is_system=0 AND severity>15)

ALTER EVENT SESSION queries ON DATABASE
	ADD TARGET ring_buffer

ALTER EVENT SESSION waitstats ON DATABASE
    WITH (STARTUP_STATE=ON)
    
ALTER EVENT SESSION queries ON DATABASE
	STATE = START

