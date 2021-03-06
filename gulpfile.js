var gulp = require('gulp');
var mocha = require('gulp-mocha');

var LIB = 'dist/html/lib/';

gulp.task('lib', function() {
    return gulp.src([
        // CSS
        'bower_components/bootstrap/dist/css/bootstrap.css',
        
        // JS
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/sax-js/lib/sax.js',        
        'bower_components/react/react.min.js',        
        'bower_components/react/react-dom.min.js',        
        ])
        .pipe(gulp.dest(LIB));
});

gulp.task('test', function() {
    return gulp.src('test/**/test*.js')
        .pipe(mocha({ reporter: 'spec'}));
})