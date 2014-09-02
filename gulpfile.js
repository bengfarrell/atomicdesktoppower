var gulp = require('gulp');
var shell = require('gulp-shell');
var downloadatomshell = require('gulp-download-atom-shell');

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
        version: '0.13.3',
        outputDir: 'binaries'
    }, cb);
});

gulp.task('demo', shell.task([
    'binaries/atom app debug:true slide:' + gulp.env.slide
]));

gulp.task('democ', shell.task([
    'binaries/atom app debug:false html:components/' + gulp.env.comp + '/demo.html'
]));

gulp.task('default', ['downloadatomshell']);