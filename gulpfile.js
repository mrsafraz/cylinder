var gulp        = require('gulp');
var traceur     = require('gulp-traceur');
var rename_     = require('gulp-rename');
var durandal    = require('gulp-durandal');
var fs          = require('fs');
var del         = require('del');
var sourcemaps  = require('gulp-sourcemaps');
var sass        = require('gulp-sass');
var plumber     = require('gulp-plumber');
var changed     = require('gulp-changed');
var browserSync = require('browser-sync');
var gulpWatch   = require('gulp-watch');
var batch       = require('gulp-batch');

var BASE_PATH = process.cwd();
var REQUIREJS_CONFIG;
var DEPS_CONFIG;

var TRACEUR_OPTIONS = {
  "modules": "amd",
  "script": false,
  "types": true,
  "typeAssertions": true,
  "typeAssertionModule": "assert",
  "annotations": true,
  // "sourceMaps": "file"
};

var buildFolderName = 'build';

var PATH = {
  BUILD: './' + buildFolderName + '/',
  DIST: './dist/',
  DIST_TEMP: './dist_temp/',
  SRC: './app/**/*.js',
  LEGACY: './app/_legacy/**/*.js',
  COPY: ['./assets/**/*'],
  HTML: './app/**/*.html',
  SASS: './scss/**/*.scss',
  SASS_INDEX: './scss/style.scss',
};


// TRANSPILE ATSCRIPT
gulp.task('build/src', function() {
  gulp.src([PATH.SRC, '!' + PATH.LEGACY], {base: '.'})
      // .pipe(gulpWatch([PATH.SRC, '!' + PATH.LEGACY]))
      .pipe(plumber())
      .pipe(changed(PATH.BUILD, {extension: '.js'}))
      .pipe(sourcemaps.init())
      .pipe(traceur(TRACEUR_OPTIONS))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(PATH.BUILD));
});

gulp.task('build/cylinder', function() {

  var CYLINDER_SRC = './bower_components/cylinder/**/*.js';
  var CYLINDER_HTML = './bower_components/cylinder/**/*.html';
  gulp.src(CYLINDER_SRC, {base: './bower_components'})
      .pipe(sourcemaps.init())
      .pipe(traceur(TRACEUR_OPTIONS))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(PATH.BUILD + '/app'));

  gulp.src(CYLINDER_HTML, {base: './bower_components'})
    .pipe(gulp.dest(PATH.BUILD + '/app'));
});

// COPY ES5
gulp.task('build/legacy', function() {
  gulp.src(PATH.LEGACY, {base: '.'})
      // .pipe(gulpWatch(PATH.LEGACY))
      .pipe(gulp.dest(PATH.BUILD));
});

gulp.task('build/copy', function(){
  gulp.src(PATH.COPY, {base: '.'})
    // .pipe(gulpWatch(PATH.COPY))
    .pipe(gulp.dest(PATH.BUILD));
});

gulp.task('build/html', function(){
  gulp.src(PATH.HTML, {base: '.'})
    // .pipe(gulpWatch(PATH.HTML))
    .pipe(changed(PATH.BUILD, {extension: '.html'}))
    .pipe(gulp.dest(PATH.BUILD));
});

gulp.task('build/sass', function(){
  if(PATH.SASS_INDEX){
    gulp.src(PATH.SASS_INDEX)
    // .pipe(gulpWatch(PATH.SASS))
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(PATH.BUILD))
    // .pipe(filter('**/*.css')) // Filtering stream to only css files
    .pipe(browserSync.reload({stream:true}));
  }
});

gulp.task('build', ['build/src', 'build/legacy', 'build/html', 'build/copy', 'build/sass']);

// WATCH FILES FOR CHANGES
gulp.task('watch', function() {
  var watchAndReloadNew = function(src, task, noReload){
    (PATH.SRC, function() {
      batch(function() {
        gulp.start(task);
        if(!noReload){
          browserSync.reload();
        }
      });
    });
  };
  var watchAndReload = function(src, task, noReload) {
    var stream = gulp.watch(src, [task]);
    if(!noReload){
      stream.on('change', browserSync.reload);
    }
  };
  watchAndReload(PATH.SASS, 'build/sass', true);
  watchAndReload(PATH.SRC, 'build/src');
  watchAndReload(PATH.COPY, 'build/copy', true);
  watchAndReload(PATH.HTML, 'build/html');
  watchAndReload(PATH.LEGACY, 'build/legacy');
});

gulp.task('watch-old', function() {
  gulp.watch(PATH.SASS, ['build/sass']);
  gulp.watch(PATH.SRC, ['build/src']).on('change', browserSync.reload);
  gulp.watch(PATH.COPY, ['build/copy']);
  gulp.watch(PATH.HTML, ['build/html']).on('change', browserSync.reload);
  gulp.watch(PATH.LEGACY, ['build/legacy']).on('change', browserSync.reload);
});


// WEB SERVER
gulp.task('serve', function() {
  browserSync({
      open: false,
      // logConnections: true,
      // startPath: '/index.html',
      // files: ['build/style.css'],
      server: {
          // baseDir: './',
          baseDir: BASE_PATH,
          // directory: true,
          index: 'index.html',
      }
  });
});

gulp.task('dist/merge', function(){

    if(!REQUIREJS_CONFIG){
      REQUIREJS_CONFIG = require(BASE_PATH + '/config.requirejs');
    }
    var mainFile = PATH.DIST_TEMP + 'build/app/main.js';
    var mainFileContent = fs.readFileSync(mainFile, {encoding: 'utf-8'});

    var mainFileContentNew = 'require.config(' + JSON.stringify(REQUIREJS_CONFIG) + ');\n\n' + mainFileContent;

    fs.writeFileSync(mainFile, mainFileContentNew);

    durandal({
      verbose: true,
      baseDir: PATH.DIST_TEMP + 'build/app',
      main: 'main.js',
      output: 'main-built.js',
      almond: true,
      minify: true,
      rjsConfigAdapter: function(rjsConfig){
        rjsConfig.generateSourceMaps = false;
        rjsConfig.map = REQUIREJS_CONFIG.map;
        rjsConfig.paths = REQUIREJS_CONFIG.paths;
        rjsConfig.shim = REQUIREJS_CONFIG.shim;
        return rjsConfig;
      },
    })
    .pipe(gulp.dest(PATH.DIST));
});

gulp.task('default', ['build', 'build/cylinder', 'watch', 'serve']);

gulp.task('dist/temp_copy', function(){
  gulp.src(PATH.BUILD + '**/*')
    .pipe(gulp.dest(PATH.DIST_TEMP + buildFolderName));
});

gulp.task('dist/temp_copy_deps', function(){
  if(!DEPS_CONFIG){
    DEPS_CONFIG = require(BASE_PATH + '/config.deps');
  }
  ['node_modules', 'bower_components'].forEach(function(depsPath){
  gulp.src(DEPS_CONFIG[depsPath], {base: './' + depsPath, cwd: depsPath})
    .pipe(gulp.dest(PATH.DIST_TEMP + depsPath + '/'));
  });
});

gulp.task('dist/copy', function(){
  gulp.src('./index-dist.html')
    .pipe(rename_({
      basename: 'index'
    }))
    .pipe(gulp.dest(PATH.DIST));

  gulp.src('./node_modules/traceur/bin/traceur-runtime.js')
    .pipe(gulp.dest(PATH.DIST));

  gulp.src([PATH.DIST_TEMP + '**',
            '!' + PATH.DIST_TEMP + '**/*.js',
            '!' + PATH.DIST_TEMP + '**/*.map',
            '!' + PATH.DIST_TEMP + '**/*.html',
           ])
            .pipe(gulp.dest(PATH.DIST));
});

gulp.task('dist_temp', ['dist/temp_copy', 'dist/temp_copy_deps']);
gulp.task('dist_output', ['dist/merge', 'dist/copy']);


gulp.task('dist', function(cb){
  var exec = require('child_process').exec;

  var tasks = ['clean', 'build', 'dist_temp', 'dist_output'];

  var deleteDistTemp = function(){
    del([PATH.DIST_TEMP + '**']);
  };

  var runChild = function(i){
    if(!tasks[i]){
      return deleteDistTemp();
    }
    exec('gulp ' + tasks[i], function(error, stdout, stderr){
      if (error !== null) {
        console.log(tasks[i] + ' error: ' + error);
        console.log(stderr);
      }
      else {
        console.log(stdout);
      }
      runChild(i+1);
    });
  };

  runChild(0);

});

gulp.task('clean', function(cb){
    del([
      PATH.BUILD + '**',
      PATH.DIST_TEMP + '**',
  ], cb);
});

exports.setDepsConfig = function(depsConfig){
  DEPS_CONFIG = depsConfig;
}

exports.setRequirejsConfig = function(requirejsConfig){
  REQUIREJS_CONFIG = requirejsConfig;
}

exports.setBasePath = function(basePath){
  BASE_PATH = basePath;
}