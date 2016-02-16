# Lista de eventos

No total, há 48 eventos diferentes:

    select * from sys.dm_xe_objects where object_type = 'event'

## Importantes

* wait_info
* module_end
* rpc_completed
* sql_batch_completed
* sp_statement_completed
* sql_statement_completed
* sql_transaction
* attention
* error_reported

* blocked_process_report

# Warnings
* sql_statement_recompile
* missing_column_statistics
* missing_join_predicate
* hash_warning
* hash_spill_details
* execution_warning
* sort_warning
* exchange_spill
* plan_affecting_convert
* optimizer_timeout

* login
* logout
* existing_connection
* wait_info_external
* object_created
* object_deleted
* object_altered
* user_event
* query_optimizer_memory_gateway
* unmatched_filtered_indexes

* session_context_statistics
* query_execution_dynamic_push_down_statistics
* worker_wait_stats
* query_post_compilation_showplan
* query_pre_execution_showplan
* query_post_execution_showplan
* sql_batch_starting
* sql_statement_starting
* sp_statement_starting
* rpc_starting
* fulltextlog_written
* full_text_crawl_started
* lock_acquired

* lock_deadlock
* lock_deadlock_chain
* xml_deadlock_report
* database_xml_deadlock_report

* progress_report_online_index_operation


actions
==========

client_app_name
client_connection_id
client_hostname
client_pid
context_info
database_id
database_name
event_sequence
plan_handle
query_hash
query_plan_hash
request_id
session_id
sql_text
transaction_id
transaction_sequence
username

