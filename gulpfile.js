var gulp = require('gulp');
var shell = require('gulp-shell');
var fs = require('fs');
var downloadatomshell = require('gulp-download-atom-shell');

gulp.task('downloadatomshell', function(cb){
    downloadatomshell({
        version: '0.13.3',
        outputDir: 'binaries'
    }, cb);
});

gulp.task('numberslides', function() {
    var slideindex = 0;
    var manifest = JSON.parse(fs.readFileSync('./app/slides/manifest.json'));
    manifest.content.forEach( function(deck) {
        try {
            var slds = JSON.parse(fs.readFileSync('./app/slides/' + deck.file));
            slds.slides.forEach(function(sld) {
                sld.number = ++ slideindex;
            });
            fs.writeFileSync('./app/slides/' + deck.file, JSON.stringify(slds, null, 2));
        } catch(e) {
            console.log('JSON Parsing error for ./app/slides/' + deck.file);
            console.log(e.message);
        }
    });
});

gulp.task('demo', shell.task([
        'binaries\\atom.exe app debug:true slide:' + gulp.env.slide
]));

gulp.task('democ', shell.task([
    'binaries/atom app debug:false html:components/' + gulp.env.comp + '/demo.html'
]));

gulp.task('default', ['downloadatomshell']);