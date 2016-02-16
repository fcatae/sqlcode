DROP EVENT SESSION queries ON server
GO
CREATE EVENT SESSION queries ON server
    ADD EVENT rpc_completed(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0 AND duration>100),
    ADD EVENT sql_batch_completed(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0 AND duration>100),
    ADD EVENT sp_statement_completed(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0 AND duration>100),
    ADD EVENT sql_statement_completed(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0 AND duration>100),
    ADD EVENT sql_transaction(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0 AND duration>100),
    ADD EVENT attention(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0),
    ADD EVENT error_reported(
		ACTION(session_id, client_app_name,username, query_hash,query_plan_hash,plan_handle,tsql_frame, tsql_stack , sql_text)
		WHERE sqlserver.is_system=0)

ALTER EVENT SESSION queries ON server
	ADD TARGET ring_buffer

ALTER EVENT SESSION queries ON server
	STATE = START


CREATE EVENT SESSION queries ON database
    ADD EVENT rpc_completed,
    ADD EVENT sql_batch_completed,
    ADD EVENT sp_statement_completed,
    ADD EVENT sql_statement_completed,
    ADD EVENT sql_transaction,
    ADD EVENT attention,
    ADD EVENT error_reported

-- ACTION(client_app_name,username,query_hash,query_plan_hash,session_id,sql_text,plan_handle,tsql_frame,tsql_stack)
ACTION(client_app_name,username,query_hash,query_plan_hash,session_id,sql_text,plan_handle,tsql_frame,tsql_stack)


    WHERE (([package0].[greater_than_uint64]([sqlserver].[database_id],(4))) AND ([package0].[equal_boolean]([sqlserver].[is_system],(0))))),

WHERE(sqlserver.is_system=0)




CREATE EVENT SESSION waitstats ON database
	ADD EVENT sqlos.wait_info 
		( 
		ACTION (session_id,query_hash,query_plan_hash)
		WHERE 
			(duration>10) AND 
				((duration<100 AND package0.divides_by_uint64(package0.counter,10) ) 
				OR (duration>=100))
		)

alter event session waitstats on database
	add target ring_buffer

alter event session waitstats on database
	state = start

alter event session fabricio2 on database
	add target ring_buffer(set max_events_limit=10000,max_memory=10000)
