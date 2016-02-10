
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
