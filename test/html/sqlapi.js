describe('SQL API', function() {
    
    var _sqlclient;
    
    beforeEach(function() {
        _sqlclient = createSqlClient();    
    })
    
    it('createSqlClient', function() {
        assert( _sqlclient != null, 'createSqlClient() success');
    });
    
    
    // 
    // it('teste 12s browser', function() {
    //     assert(1 == 1);
    // });
    // 
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
    $.get(url, param)
        .done(function() { success && success() })
        .fail(function() { error && error() });
}

function createSqlClient() {
    
    var _conn;
    var _req = null;
    
    var obj = {
        open: function() {
            httpGet('/connection', null, function(handle) {
                _conn = handle;
            });
        },
        execute: function(sqltext, callback) {
            if(_req != null) {
                throw new Error('Request in progress: ' + sqltext);
            }
            _req = httpGet('/request', { q: sqltext }, function(data) {
                _req = null;
                callback(null, data);
            }, function(errcode) {
                _req = null;
                callback(errcode);
            });
        },
        cancel: function() {
            (_req) && (_req.abort());
        }
    }; 
    
    return obj;
}
