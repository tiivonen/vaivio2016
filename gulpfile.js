var gulp = require('gulp');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var partialimport = require('postcss-partial-import');
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
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');



gulp.task('styles', function() {
  var processors = [
    partialimport({}),
    simplevars(),
    mixins(),

    customselectors(),

    nestedprops,
    nested(),
    cssnext({}),

    autoprefixer({
      browsers: ['last 2 versions']
    }),
    // csswring({
    //   removeAllComments: true
    // })

  ];

  return gulp.src('./dev/assets/css/styles.css')
    // .pipe( sourcemaps.init())
    .pipe(plumber({
      errorHandler: function(error) {
        gutil.log(gutil.colors.yellow(error.message));
        gutil.beep();
        this.emit('end');
      }
    }))
    .pipe(postcss(processors))
    // .pipe( sourcemaps.write('.'))
    .pipe(gulp.dest('./html/assets/css'))
    .pipe(browsersync.reload({
      stream: true
    }));
});

gulp.task('imagemin', function() {
  gulp.src('./dev/assets/img/**/*.{gif,jpg,png,svg}')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./html/assets/img'))
    .pipe(browsersync.reload({
      stream: true
    }));;
});

gulp.task('jade', function() {
  gulp.src('./dev/*.jade')
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./html'))
    .pipe(browsersync.reload({
      stream: true
    }));

});

gulp.task('browsersync', ['styles', 'jade'], function() {
  browsersync({
    browser: "google chrome",
    server: {
      baseDir: './html'
    }
  });
  gulp.watch("*.html").on("change", browsersync.reload);
});

// gulp.task('watch:styles' function(){
//   gulp.watch('**/*.css', ['styles']);
// });

gulp.task('watch', function() {
  gulp.watch('dev/assets/css/*.css', ['styles']);
  // gulp.watch('assets/js/**', ['minify']);
  // gulp.watch(['index.html', '_layouts/*.html', '_posts/*', '_includes/*'], ['jekyll-rebuild']);
  gulp.watch(['dev/*.jade'], ['jade']);
  gulp.watch(['dev/assets/img/**/*.{gif,jpg,png,svg}'], ['imagemin']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browsersync', 'watch', 'styles', 'jade', 'imagemin']);
