var gulp = require('gulp');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var partialimport  = require('postcss-partial-import');
var csswring = require('csswring');
var cssnext = require('postcss-cssnext');
var autoprefixer = require('autoprefixer');
var nestedprops = require('postcss-nested-props');
var nested = require('postcss-nested');
var simplevars = require('postcss-simple-vars');
var mixins = require('postcss-mixins');
var browsersync = require('browser-sync');
var customselectors = require('postcss-custom-selectors');
var grace = require('cssgrace');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('styles', function() {
  var processors = [
    partialimport({}),
    mixins(),
    simplevars(),
    customselectors(),

    nestedprops,
    nested(),
    cssnext({}),

    autoprefixer({browsers:['last 2 versions']}),
    // csswring({
    //   removeAllComments: true
    // })

  ];

  return gulp.src('./dev/styles.css')
    // .pipe( sourcemaps.init())
    .pipe(plumber({
      errorHandler: function (error) {
        gutil.log(gutil.colors.yellow(error.message));
        gutil.beep();
        this.emit('end');
    }}))
    .pipe(postcss(processors))
    // .pipe( sourcemaps.write('.'))
    .pipe(gulp.dest('./styles'))
    .pipe(browsersync.reload({stream:true}));
});

gulp.task('browsersync', ['styles'], function() {
    browsersync({
        server: {
            baseDir: './'
        }
    });
    gulp.watch("*.html").on("change", browsersync.reload);
});

// gulp.task('watch:styles' function(){
//   gulp.watch('**/*.css', ['styles']);
// });

gulp.task('watch', function () {
    gulp.watch('dev/*.css', ['styles']);
    // gulp.watch('assets/js/**', ['minify']);
    // gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_includes/*'], ['jekyll-rebuild']);
    // gulp.watch(['_jadefiles/*.jade'], ['jade']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browsersync', 'watch', 'styles']);
