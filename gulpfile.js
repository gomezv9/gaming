var gulp = require('gulp');
var args = require('yargs').argv;
var config = require('./gulp.config')();
var browserSync = require('browser-sync');
var del = require('del');
var gulp_remove_logging = require("gulp-remove-logging");
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;


gulp.task('help',$.taskListing);
gulp.task('default',['help']);

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('styles',['clean-styles'],function(){
    log('Compiling SASS --> CSS');

    return gulp
    .src(config.sass+'*.scss')
    .pipe($.plumber())

    .pipe($.sass())
    .pipe($.autoprefixer({ browser: ['last 2 version', '> 5%']}))

    .pipe(gulp.dest(config.temp))
	.pipe(browserSync.stream());
});


gulp.task('images',['clean-images'],function(){
    log('Copying and compressing the images');
    return gulp.src(config.images)
    .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('clean',function(done){
    var delconfig = [].concat(config.temp , config.build);
    log('Cleaning:'+ $.util.colors.blue(delconfig));
    del(delconfig,done);
});

gulp.task('clean-styles',function(done){
    clean(files = config.temp + '**/*.css',done);
});

gulp.task('clean-images',function(done){
    clean(config.build + 'images/**/*.*',done);
});


gulp.task('clean-code',function(done){
    var files = [].concat(
        config.temp + '**/*.js' ,
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    );
    clean(files,done);
});

gulp.task('sass-watch',function(){
   gulp.watch([config.sass+'/*.scss'],['styles']);
});


gulp.task('templatecache',['clean-code'],function(){
    log('Creating AngularJS $templateCache'+config.htmltemplates);

    return gulp
        .src(config.htmltemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('wiredep', function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});


gulp.task('inject', [ 'styles','images','templatecache'], function() {
    log('Wire up the app css into the html, and call wiredep ');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});


gulp.task('build',['inject'],function(){
    log('Wire up the app css into the html, and call wiredep ');

    var assets = $.useref({searchPath: './'});
    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache, {read: false}), {
            starttag: '<!-- inject:templates:js -->'
        }))
        .pipe(assets)
        .pipe($.if('**/*.css',$.csso()))
        .pipe($.if('**/app.js',$.ngAnnotate()))
        .pipe($.if('**/app.js',gulp_remove_logging()))
        .pipe($.if('**/*.js',$.uglify()))
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

gulp.task('run',['wiredep','inject'],function(){
    startBrowserSync();
});
gulp.task('run-build',['build'], function(){
  browserSync.init({
        port: 5000,
        server: {
            baseDir: config.build,
        }
  });
})
////////////

function startBrowserSync(){
    if  (browserSync.active){
        return;
    }

    browserSync.init({
        port: 5000,
        server: {
            baseDir: config.client,
            routes: {
                "/bower_components": "bower_components",
                "/node_modules": "node_modules",
                "/src/": "src/",
                "/.tmp/": ".tmp/"
            }
        }
	});

    gulp.watch(config.sass+"*.scss", ['styles']);
	gulp.watch(config.html).on('change', browserSync.reload);
	gulp.watch(config.js).on('change',browserSync.reload);
}

function clean(path,done){
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path,done);
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
