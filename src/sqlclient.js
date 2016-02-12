// depends on jQuery

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
