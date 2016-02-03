sempre no contexto do bd

select * FROM sys.databases
SET NOCOUNT ON
SET LOCK_TIMEOUT 30000


alter database dbazure set AUTO_UPDATE_STATISTICS on
ALTER DATABASE dbazure SET COMPATIBILITY_LEVEL =120