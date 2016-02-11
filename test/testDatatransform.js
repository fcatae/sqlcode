var path = require('path');
var assert = require('assert');
var config = require( path.join(process.cwd(), '/.config') ).db_server_config;

var Transform = require( path.join(process.cwd(), '/src/datatransform'));

var header = [
    { index: 0, name: 'end_time', size: 8, type: 'DATETIMN' },
    { index: 1, name: 'avg_cpu_percent', size: 17, type: 'DECIMALN' },
    { index: 2, name: 'avg_data_io_percent', size: 17, type: 'DECIMALN' },
    { index: 3, name: 'avg_log_write_percent', size: 17, type: 'DECIMALN' },
    { index: 4, name: 'avg_memory_usage_percent', size: 17, type: 'DECIMALN' },
    { index: 5, name: 'xtp_storage_percent', size: 17, type: 'DECIMALN' },
    { index: 6, name: 'max_worker_percent', size: 17, type: 'DECIMALN' },
    { index: 7, name: 'max_session_percent', size: 17, type: 'DECIMALN' },
    { index: 8, name: 'dtu_limit', size: 4, type: 'INTN' }
];

describe('Data Transform', function() {
    it('Create', function() {
        var format_resource_stats = Transform.create([
            ['end_time'],
            ['cpu','avg_cpu_percent'],
            ['data','avg_data_io_percent'],
            ['log','avg_log_write_percent']
        ]);
        assert(format_resource_stats.length == 4, 'length == 4');
        
        var all_columns = format_resource_stats.allColumns;
        
        assert(all_columns.length == 4, 'all_columns.length == 4');                       
        assert(all_columns.join('+') == 'end_time+avg_cpu_percent+avg_data_io_percent+avg_log_write_percent', 
            'all_columns == end_time + cpu + data + log');
    });

    it('Attach', function() {
        var format_resource_stats = Transform.create([
            ['end_time'],
            ['cpu','avg_cpu_percent'],
            ['data','avg_data_io_percent'],
            ['log','avg_log_write_percent'],
            ['--invalid-column--']
        ]);
        format_resource_stats.attach(header);  
        
        var activeColumns = format_resource_stats.activeColumns;
        assert( activeColumns.length == 4);
        
        var missingColumns = format_resource_stats.missingColumns;
        assert( missingColumns.length == 1, 'only one missing column');                     
        assert( missingColumns[0] == '--invalid-column--', 'missing column = invalid column');
    });

    it('printHeader', function() {
        var format_resource_stats = Transform.create([            
            ['end_time'],
            ['avg_cpu_percent'],
            ['avg_data_io_percent'],
            ['avg_log_write_percent']
        ]);  
        format_resource_stats.attach(header);
        
        var h = format_resource_stats.printHeader();
        var s = format_resource_stats.printSeparator();
        
        assert(h == 'end_time avg_cpu_percent avg_data_io_percent avg_log_write_percent');
        assert(s == '-------- --------------- ------------------- ---------------------');                            
    });

    it('printHeader with minSize', function() {
        var format_resource_stats = Transform.create([
            ['end_time', 3],
            ['cpu','avg_cpu_percent', 3],
            ['dataio','avg_data_io_percent', 3],
            ['logwrite','avg_log_write_percent', 3]
        ]);  
        format_resource_stats.attach(header);
        
        var h = format_resource_stats.printHeader();
        var s = format_resource_stats.printSeparator();
        
        assert(h == 'end cpu dat log');
        assert(s == '--- --- --- ---');                                    
    });

    it('printRow', function() {
        var format_resource_stats = Transform.create([
            ['logwrite','avg_log_write_percent', 6],
            ['dataio','avg_data_io_percent', 10]
        ]);  
        format_resource_stats.attach(header);
        
        var h = format_resource_stats.printHeader();
        var s = format_resource_stats.printSeparator();
        var r = format_resource_stats.printRow(new Date(1455156655148), 21.124, 0.00001, 80.999101);
        
        assert(h=='logwri dataio    ');
        assert(s=='------ ----------');
        assert(r=='80.999 0.00001   ');            
    });
    
    it('printRow with Vector', function() {
        var format_resource_stats = Transform.create([
            ['logwrite','avg_log_write_percent', 6],
            ['dataio','avg_data_io_percent', 10]
        ]);  
        format_resource_stats.attach(header);
        
        var h = format_resource_stats.printHeader();
        var s = format_resource_stats.printSeparator();
        var r = format_resource_stats.printRow([new Date(1455156655148), 21.124, 0.00001, 80.999101]);
        
        assert(h=='logwri dataio    ');
        assert(s=='------ ----------');
        assert(r=='80.999 0.00001   ');            
    });
        
    it('printRow with Transform', function() {
        var format_resource_stats = Transform.create([
            ['end_time', Transform.toDateTimeYMD, 20],
            ['cpu','avg_cpu_percent', 10],
            ['dataio','avg_data_io_percent', Transform.toNumberFixed.bind(null,1), 6],
            ['logwrite','avg_log_write_percent', Transform.toNumberFixed.bind(null,1), 6]
        ]);  
        format_resource_stats.attach(header);
        
        var h = format_resource_stats.printHeader();
        var s = format_resource_stats.printSeparator();
        var r = format_resource_stats.printRow(new Date(1455156655148), 21.124, 0.00001, 80.999101);
        
        assert(h=='end_time             cpu        dataio logwri');
        assert(s=='-------------------- ---------- ------ ------');
        assert(r=='2016-02-10 23:10:55  21.124     0.0    81.0  ');            
    });
    
});


