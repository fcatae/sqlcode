select service_broker_guid, create_date, * from sys.databases

create database dmaster as copy of master
--Msg 40804, Level 16, State 1, Line 15
--The service objective 'System2' specified is invalid.


