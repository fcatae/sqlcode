Scripts
=========

# connect

connect server [database] [user] [password] 

    -> user (spawn/store credentials)
    -> server (spawn/store server info)

    user -> user
    user -> server 

    server -> server
    server -> user
    

# request

    request -c "select * from table"
    request -f "file" -o output.rpt
    request -c "select filename,data from table" -m
    
    