# VERY SLOW:

insert a values(1)
go 1000


# SLOW:

while




create table tb1(id int)
set nocount off
declare @i int = 0
while @i<100
begin
insert tb1 values (1)
set @i = @i + 1
end
truncate table tb1

# FAST:

ALTER DATABASE dbazure SET DELAYED_DURABILITY = FORCED

select * from sys.databases

begin tran
create table b(id int)
commit tran with( DELAYED_DURABILITY  = on)

sp_flush_log