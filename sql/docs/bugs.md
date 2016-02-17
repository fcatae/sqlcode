dbcc inputbuffer

db_name(5)

from sys.resource_stats WHERE...



max_event"S"_limit
https://msdn.microsoft.com/en-us/library/ff878182.aspx 

nao tem deadlock search nem blocked report???

select * from sys.dm_xe_database_sessions s join sys.dm_xe_database_session_targets t on cast(s.address as int)= cast(t.event_session_address as int)
ele nao permite fazer JOIN???

nao tem tsql_frame , tsql_stack no azure xevents.

Toda hora falta memoria?
Msg 25746, Level 16, State 2, Line 26
Operation failed. Operation will cause database event session memory to exceed allowed limit. Event session memory may be released by stopping active sessions or altering session memory options. Check sys.dm_xe_database_sessions for active sessions that can be stopped or altered.

XML: truncated=1 - limite de 4MB

design change: nao é possivel usar variaveis para estabelecer filtros


na master: 
alter database dbp1 set delayed_durability = allowed
funciona!!! mas select * from sys.databases nao reflete o status correto.

