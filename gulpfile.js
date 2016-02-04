var gulp = require('gulp');

var LIB = 'src/lib/';

gulp.task('lib', function() {
    return gulp.src([
        'bower_components/requirejs/require.js',
        'bower_components/sax-js/lib/sax.js'
        ])
        .pipe(gulp.dest(LIB));
});