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
        _sqlclient.open(function(err) {
            assert( err == null );
            assert( _sqlclient.getConnection() != null );
            done();
        });
    });
    
    it('sqlClient.connect() twice should FAIL', function(done) {
        _sqlclient.open();
        assert( _sqlclient.getConnection() == null, 'connection open in progress');
        
        _sqlclient.open(function(err) {
            assert(err != null, 'connection open should fail this time');
            done();
        });                
    });
    
    it.skip('sqlClient.cancel()', function(done) {
        assert( _sqlclient.getConnection() != null );
    });
    
    it.skip('sqlClient.cancel()', function(done) {
        assert( _sqlclient.getConnection() != null );
    });
    
    // it('este 1d browser', function() {
    //     assert(1 == 1);
    // })
    // it('teste 1 browser', function() {
    //     assert(1 == 2);
    // })
});
// 
// $(document).ready(function() {    
//     
//     httpGet('/connection', null, function() {
//         $('#mocha').text('hello mocha');
//     }).fail(function(){
//         $('#mocha').text('FAIL');
//     })
//     
// });

function httpGet(url, param, success, error) {
    return $.get(url, param)
        .done(function(data) { success && success(data) })
        .fail(function(err) { error && error(err) });
}

function createSqlClient() {
    
    var _handle;
    var _connreq;
    var _req = null;
    
    var obj = {
        open: function(callback) {
            if(_connreq != null) {
                callback('Connection open request in progress');
                return;
            }
            _connreq = httpGet('/connection', null, function(handle) {
                _handle = handle;
                _connreq = null;
                callback && callback(null, handle);
            }, function(errcode) {
                _connreq = null;
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
        cancel: function() {
            (_req) && (_req.abort());
        },
        getConnection: function() {
            return _handle;
        }
    }; 
    
    return obj;
}
