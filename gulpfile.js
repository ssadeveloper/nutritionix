'use strict';

var fs = require('fs-extra');
var path = require('path');
var sha1 = require('node-sha1');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var streamqueue = require('streamqueue');

var distDir = './client/nix_dist';

gulp.task('clean', function () {
  fs.removeSync(distDir + '/*');
});

gulp.task('vendors.css', function () {
  var stream = streamqueue({objectMode: true});
  stream.queue(
    gulp.src('./client/nix_assets/scss/vendors.scss')
      .pipe(plugins.sass({
        errLogToConsole: true
      }))
  );

  stream.queue(gulp.src([
    './client/nix_bower_components/angular-chart.js/dist/angular-chart.css',
    './client/nix_bower_components/angular-rangeslider/angular.rangeSlider.css',
    './client/nix_bower_components/angular-loading-bar/build/loading-bar.css',
    './client/nix_bower_components/cal-heatmap/cal-heatmap.css'
  ]));

  stream.queue(
    gulp.src('./client/nix_bower_components/nutrition-label/nutritionLabel.css')
      .pipe(plugins.replace('url("images/', 'url("/nix_bower_components/nutrition-label/images/'))
  );

  return stream.done()
    .pipe(plugins.minifyCss({compatibility: 'ie9'}))
    .pipe(plugins.replace('http://', '//'))
    .pipe(plugins.concat('vendors.css'))
    .pipe(gulp.dest(distDir));
});

gulp.task('main.css', function () {
  return gulp.src(['./client/nix_assets/scss/main.scss'])
    .pipe(plugins.sass({
      errLogToConsole: true
    }))
    .pipe(plugins.minifyCss({compatibility: 'ie9'}))
    .pipe(plugins.concat('main.css'))
    .pipe(gulp.dest(distDir));
});

gulp.task('vendors.js', function () {
  var stream = streamqueue({objectMode: true});

  stream.queue(gulp.src([
    './client/nix_bower_components/lodash/lodash.min.js',
    './client/nix_bower_components/jquery/dist/jquery.min.js',
    './client/nix_bower_components/moment/min/moment-with-locales.min.js',
    './client/nix_bower_components/moment-timezone/builds/moment-timezone-with-data.min.js',
    './client/nix_bower_components/Chart.js/Chart.min.js',
    './client/nix_bower_components/d3/d3.min.js',
    './client/nix_bower_components/cal-heatmap/cal-heatmap.min.js'
  ]));

  stream.queue(
    gulp.src([
        './client/nix_bower_components/nutrition-label/nutritionLabel.js'
      ])
      .pipe(plugins.uglify())
  );

  stream.queue(gulp.src([
    './client/nix_bower_components/angular/angular.min.js',
    './client/nix_bower_components/angular-animate/angular-animate.min.js',
    './client/nix_bower_components/angular-messages/angular-messages.min.js',
    './client/nix_bower_components/angular-sanitize/angular-sanitize.min.js',
    './client/nix_bower_components/angular-touch/angular-touch.min.js',
    './client/nix_bower_components/angular-shims-placeholder/dist/angular-shims-placeholder.min.js',
    './client/nix_bower_components/angular-ui-router/release/angular-ui-router.min.js',
    './client/nix_bower_components/ui-router-metatags/dist/ui-router-metatags.min.js',
    './client/nix_bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './client/nix_bower_components/angular-nutritionix-api/angular-nutritionix-api.min.js',
    './client/nix_bower_components/angular-chart.js/dist/angular-chart.min.js',
    './client/nix_bower_components/angular-encode-uri/dist/angular-encode-uri.min.js',
    './client/nix_bower_components/angular-google-analytics/dist/angular-google-analytics.min.js',
    './client/nix_bower_components/angular-pusher/angular-pusher.min.js',
    './client/nix_bower_components/angular-moment/angular-moment.min.js',
    './client/nix_bower_components/angular-loading-bar/build/loading-bar.min.js',
    './client/nix_bower_components/ngstorage/ngStorage.min.js',
    './client/nix_bower_components/ng-focus-if/focusIf.min.js',
    './client/nix_bower_components/track-api-angular-client/track-api-angular-client.min.js'
  ]));

  stream.queue(
    gulp.src([
        './client/nix_bower_components/ng-debounce/angular-debounce.js',
        './client/nix_bower_components/angular-rangeslider/angular.rangeSlider.js',
        './client/nix_bower_components/ngtweet/dist/ngtweet.js',
        './client/nix_bower_components/angular-truncate/src/truncate.js',
        './client/nix_bower_components/angular-facebook/lib/angular-facebook.js'
      ])
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.uglify())
  );

  return stream.done()
    .pipe(plugins.concat('vendors.js'))
    .pipe(plugins.replace(/\/\/# sourceMappingURL=.*?map/g, ''))
    .pipe(plugins.replace('.catch', "['catch']"))
    .pipe(plugins.replace('.finally', "['finally']"))
    .pipe(gulp.dest(distDir));
});

gulp.task('templates.js', function () {
  return gulp.src(['./client/nix_app/**/*.html', '!./client/nix_app/index.html'])
    .pipe(plugins.angularTemplatecache({
      module: 'nutritionix',
      root:   '/nix_app/'
    }))
    .pipe(gulp.dest(distDir));
});

gulp.task('main.js', ['templates.js'], function () {
  var stream = streamqueue({objectMode: true});
  stream.queue(gulp.src([
      './client/nix_app/app.js',
      './client/nix_app/**/*module.js',
      './client/nix_app/**/*.js'
    ])
    .pipe(plugins.babel({presets: ['es2015']}))
  );

  stream.queue(gulp.src('./client/nix_dist/templates.js'));

  stream = stream.done()
    .pipe(plugins.concat('main.js'))
    .pipe(plugins.replace('.catch', "['catch']"))
    .pipe(plugins.replace('.finally', "['finally']"));

  if ((process.env.NODE_ENV || 'development') !== 'development') {
    stream = stream.pipe(plugins.stripDebug());
  }

  return stream.pipe(plugins.ngAnnotate())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(distDir));
});

gulp.task("layout", ['vendors.js', 'vendors.css', 'main.js', 'main.css'], function () {
  var layoutFile = "./client/nix_app/index.html";

  var files = [
    'vendors.css',
    'vendors.js',
    'main.css',
    'main.js'
  ];

  var layout = fs.readFileSync(layoutFile, "utf8");

  files.forEach(function (fileName) {
    var ext = path.extname(fileName);
    var basename = path.basename(fileName, ext);

    var hashedFileName = basename + '_' + sha1(fs.readFileSync(path.join(distDir, fileName), "utf8")).substr(0, 6) +
      ext;

    fs.renameSync(path.join(distDir, fileName), path.join(distDir, hashedFileName));

    layout = layout.replace(fileName, hashedFileName);

    if (ext === '.js' && fs.existsSync(path.join(distDir, fileName + '.map'))) {
      fs.renameSync(path.join(distDir, fileName + '.map'), path.join(distDir, hashedFileName + '.map'));

      fs.outputFileSync(
        path.join(distDir, hashedFileName),
        fs.readFileSync(path.join(distDir, hashedFileName), 'utf8').replace(fileName + '.map', hashedFileName + '.map')
      );
    }
  });

  fs.outputFileSync(path.join(distDir, 'layout.html'), layout);
});


gulp.task('watch', ['clean', 'default', 'layout'], function () {
  gulp.watch('./client/**/*.scss', ['default']);
  gulp.watch('./client/nix_app/**/*.js', ['default']);
  gulp.watch('./client/nix_app/**/*.html', ['default']);
});


gulp.task('default', ['clean'], function () {
  return gulp.start('layout');
});

gulp.task('develop', ['watch'], function () {
  return plugins.nodemon({
      script: 'server/app.js',
      watch:  'server/**/*',
      env:    {'NODE_ENV': 'development'}
    })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!');
    });
});
