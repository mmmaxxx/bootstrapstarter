// ----- CHANGE THIS! ----- //
var localUrl = 'local.oscarmaxime.com';


// ----- run 'gulp' ----- //
var gulp = require('gulp'),
    promise = require('es6-promise').polyfill(),
    sass = require('gulp-sass'), // quicker than ruby-sass!
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    newer = require('gulp-newer'),
    browserSync = require('browser-sync').create(),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename');



// ----- Build SASS files ----- //
gulp.task('sass', function () {

    return gulp.src(['../assets/scss/*.scss', '../assets/scss/**/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', swallowError)
        .pipe(sourcemaps.write())
        .pipe(autoprefixer())
        .pipe(concat('main.min.css'))
        .pipe(gulp.dest('../assets/css'))
        .pipe(browserSync.stream());
});


// ----- Build JS files ----- //
gulp.task('js', function () {
    return gulp.src('../assets/js/src/*.js')
        .pipe(newer('../assets/js/build'))
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))

        .pipe(concat('script.js'))
        .pipe(gulp.dest('../assets/js/build'));

});



// ----- Watch function ----- //
gulp.task('default', function () {

    browserSync.init({
        proxy: localUrl,
        injectChanges: true,
        socket: {
            domain: 'localhost:3000'
        }
    });


    gulp.watch('../assets/scss/*.scss', ['sass']);
    gulp.watch('../assets/scss/**/*.scss', ['sass']);
    gulp.watch('../assets/js/src/*.js', ['js']);
    gulp.watch('../assets/js/build/*.js', ['reload']);


});


// ----- Reload after Javascript Change ----- //
gulp.task('reload', [], function () {
    browserSync.reload();
});

function swallowError(error) {

    // If you want details of the error in the console
    console.log(error.toString());

    this.emit('end');
}