describe('SQL API', function() {
    
    this.slow(500);
    
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
    
});
