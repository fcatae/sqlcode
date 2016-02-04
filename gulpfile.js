var gulp = require('gulp');
var mocha = require('gulp-mocha');

var LIB = 'src/lib/';

gulp.task('lib', function() {
    return gulp.src([
        // CSS
        'bower_components/bootstrap/dist/css/bootstrap.css',
        
        // JS
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/requirejs/require.js',
        'bower_components/sax-js/lib/sax.js',        
        ])
        .pipe(gulp.dest(LIB));
});

gulp.task('mocha', function() {
    return gulp.src('test/test1.js')
        .pipe(mocha({ reporter: 'spec'}));
})