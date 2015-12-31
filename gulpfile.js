var gulp = require('gulp'),

    copy = require('gulp-copy'),
    rename = require('gulp-rename'),

    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),

    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),

    util = require('gulp-util'),
    notify = require('gulp-notify'),

    argv = require('minimist')(process.argv.slice(2)),
    path = require('path'),
    fs = require('fs');

//【内部调用函数】控制台错误处理
function handleErrors () {
    var args = Array.prototype.slice.call(arguments);

    notify.onError({
        title : 'compile error',
        message : '<%=error.message %>'
    }).apply(this, args);//替换为当前对象

    this.emit();//提交
}

gulp.task('js', function () {
    var stream = gulp.src('src/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += ".min";
        }))
        .pipe(gulp.dest('dist'));

    return stream;
});

gulp.task('copy', function () {
    var stream = gulp.src(['src/*', '!src/*.js'])
        .pipe(copy('dist', {
            prefix : 1
        }));

    return stream;
});

/*
 * 任务：dist 构建
 * */
gulp.task('dist', function () {
    gulp.start('js', 'copy');
});

gulp.task('watch:js', function () {
    gulp.watch(['src/*.js'], function(event){
        console.log('File ' + event.path + ' was ' + event.type + ', running watchDo:js tasks...');
        gulp.start('js');
    });
});

gulp.task('watch:copy', function () {
    gulp.watch(['src/*', '!src/*.js'], function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running watchDo:copy tasks...');
        gulp.start('copy');
    });
});

gulp.task('watch', function () {
    gulp.start('watch:js', 'watch:copy');
});

/*
 * 任务：自定义任务
 * 描述：可根据自己需要自定义常用任务
 * */
gulp.task('default', function () {
    gulp.start('dist');
});


