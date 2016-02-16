
CREATE EVENT SESSION waitstats ON DATABASE
	ADD EVENT sqlos.wait_info 
		( 
		ACTION (session_id,query_hash,query_plan_hash)
		WHERE ( -- where
				duration>0 AND (package0.divides_by_uint64(package0.counter,1000) OR -- 0
					(duration>10 AND (package0.divides_by_uint64(package0.counter,100) OR -- 10
						(duration>100 AND (package0.divides_by_uint64(package0.counter,10) OR --100
							(duration>500) -- always included 
						)) -- duration>100 -- package 10
					)) -- duration>10 -- package0-100
				) -- package0-1000
			) -- where
        )
GO

CREATE EVENT SESSION waitstats ON DATABASE
	ADD EVENT sqlos.wait_info 
		( 
		ACTION (session_id,query_hash,query_plan_hash)
		WHERE ( -- where
				duration>0 AND (package0.divides_by_uint64(package0.counter,1000) OR -- 0
					(duration>10 AND (package0.divides_by_uint64(package0.counter,100) OR -- 10
						(duration>100 AND (package0.divides_by_uint64(package0.counter,10) OR --100
							(duration>1000) -- always included 
						)) -- duration>100 -- package 10
					)) -- duration>10 -- package0-100
				) -- package0-1000
			) -- where
        )
GO
ALTER EVENT SESSION waitstats ON DATABASE
	ADD TARGET ring_buffer

ALTER EVENT SESSION waitstats ON DATABASE
	STATE = START
