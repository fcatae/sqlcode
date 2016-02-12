describe('SQL API', function() {
    
    var _sqlclient;
    
    beforeEach(function() {
        _sqlclient = createSqlClient();    
    })
    
    afterEach(function() {
        _sqlclient = null;
    });
    
    it('createSqlClient', function() {
        assert( _sqlclient != null, 'createSqlClient() success');
    });
    
    it('sqlClient.connect()', function(done) {
        _sqlclient.open(function(err, handle) {
            assert( err == null );
            assert( handle != null );
            done();
        });
    });
    
    it('sqlClient.connect() called twice', function(done) {
        _sqlclient.open(function(err1) {
            assert(err1 == null);
            _sqlclient.open(function(err2) {
                assert(err2 == null);
                done();
            });
        });
    });
    
    it('sqlClient.connect() overlapping calls fail', function(done) {
        _sqlclient.open();
        assert( _sqlclient.isBusy(), 'connection open in progress');
        
        _sqlclient.open(function(err) {
            assert(err != null, 'connection open should fail this time');
            done();
        });                
    });
    
    it('sqlClient.execute()', function(done) {
        _sqlclient.open(function(err) {
            assert(err == null);
            _sqlclient.execute('command', function(err2, data) {
                assert(err2 == null);
                done();
            });
        });
    });            
    
    it('sqlClient.reset()', function(done) {
        _sqlclient.open(function(err) {
            assert(err != null);
            assert(err.statusText == 'abort')
            done();
        });
        _sqlclient.reset();
    });
    
    it.skip('http /testfail', function(done) {
        // hung
        // errors
    });
    
    // it('este 1d browser', function() {
    //     assert(1 == 1);
    // })
    // it('teste 1 browser', function() {
    //     assert(1 == 2);
    // })
});

function httpGet(url, param, success, error) {
    return $.get(url, param)
        .done(function(data) { success && success(data) })
        .fail(function(err) { error && error(err) });
}

function createSqlClient() {
    
    var _handle;
    var _req = null;
    
    var obj = {
        open: function(callback) {
            if(_req != null) {
                callback('Request in progress');
                return;
            }
            _req = httpGet('/connection', null, function(handle) {
                _handle = handle;
                _req = null;
                callback && callback(null, handle);
            }, function(errcode) {
                _req = null;
                callback && callback(errcode);
            });
        },
        execute: function(sqltext, callback) {
            if(_req != null) {
                throw new Error('Request in progress: ' + sqltext);
            }
            _req = httpGet('/request', { q: sqltext }, function(data) {
                _req = null;
                callback && callback(null, data);
            }, function(errcode) {
                _req = null;
                callback && callback(errcode);
            });
        },
        reset: function() {
            (_req) && (_req.abort());
            _req = null;
        },
        isBusy: function() {
            return (_req != null);
        }
    }; 
    
    return obj;
}
