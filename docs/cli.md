Scripts
=========

# connect

    connect <azure_server> [database] [user] [password] 

    -- assume the server is at database.windows.net

    -> user (spawn/store credentials)
    -> server (spawn/store server info)

    user -> user
    user -> server 

    server -> server
    server -> user

    connect -s localhost    

# request

    request -c "select * from table"
    request -f "file" -o output.rpt
    request -c "select filename,data from table" -m
    
    