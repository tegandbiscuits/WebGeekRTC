var gulp           = require('gulp'), 
    sass           = require('gulp-ruby-sass') 
    notify         = require("gulp-notify") 
    uglify         = require("gulp-uglify")
    concat         = require('gulp-concat')
    mainBowerFiles = require('main-bower-files')
    bower          = require('gulp-bower');

var config = {
     sassPath: './stylesheets/sass',
    jsPath:   './javascripts/libs',
     bowerDir: './bower_components' 
}

gulp.task('bower', function() { 
    return bower()
         .pipe(gulp.dest(config.bowerDir)) 
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*') 
        .pipe(gulp.dest('./stylesheets/fonts')); 
});

gulp.task('javascripts', function() {
  // var bowerFiles = mainBowerFiles('**/*.js');
  // console.log('bower files: ', bowerFiles);
    return gulp.src( mainBowerFiles('**/*.js') )
        .pipe(gulp.dest('./javascripts/libs/'))
});

gulp.task('compile-css', function() { 
    return gulp.src(config.sassPath + '/site-theme.scss')
         .pipe(sass({
             style: 'compressed',
             loadPath: [
                 './stylesheets/sass',
                 config.bowerDir + '/bootstrap/scss',
                 config.bowerDir + '/font-awesome/scss',
             ]
         }) 
            .on("error", notify.onError(function (error) {
                 return "Error: " + error.message;
             }))) 
         .pipe(gulp.dest('./stylesheets')); 
});

gulp.task('minify-js', function () {
    return gulp.src('./javascripts/libs/*.js') // path to your files
        .pipe(uglify())
        .pipe(concat('plugins.min.js'))
        .pipe(gulp.dest('./javascripts/'));
});

// Rerun the task when a file changes
 gulp.task('watch', function() {
     gulp.watch(config.sassPath + '/**/*.scss', ['compile-css']); 
});

  gulp.task('default', ['bower', 'icons', 'javascripts', 'compile-css', 'minify-js']);