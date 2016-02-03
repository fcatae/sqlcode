-- ===============================================
-- Create SQL Login template for Windows Azure SQL Database
-- ===============================================
create database db4

drop login sql1

select * from sys.user_token

CREATE LOGIN login1 WITH password='<ProvidePassword>';
CREATE USER login1User FROM LOGIN login1;
EXEC sp_addrolemember 'dbmanager', 'login1User';
EXEC sp_addrolemember 'loginmanager', 'login1User';

select * from sys.user_token



CREATE LOGIN us1 
	WITH PASSWORD = 'stratovarius!2016' 
GO
create user us1 from login us1
EXEC sp_addrolemember 'loginmanager', 'us1';

sp_droprolemember 'loginmanager', 'us1'
sp_droprolemember 'dbmanager', 'us1'

select * from sys.sql_logins
select IS_ROLEMEMBER('dbmanager', name), IS_ROLEMEMBER('loginmanager', name), name from sys.sql_logins

select IS_SRVROLEMEMBER('loginmanager')
select IS_SRVROLEMEMBER('dd', 'fcatae')

select IS_SRVROLEMEMBER('dd', 'fcatae')

select IS_SRVROLEMEMBER('loginmanager', 'sql1')
select IS_SRVROLEMEMBER('dbmanager', 'fabteste')

select * from sys.dm_database_copies 
select * from sys.databases 
select * from sys.user_token

alter database dbazure set single_user
alter database dbazure set read_write


create database

alter database dbazure set delayed_durability = forced

select * from sys.database_principals

select * from 
