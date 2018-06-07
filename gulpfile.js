
/*
 build system to:
 - transform JSX into straight-up JS
 - serve it up for development on local machine

By using:
 - Babel, an ES6 to ES5 compiler with support for JSX
 - Browserify, a tool for bundling up JavaScript modules
 - Gulp, the streaming build system

Gulp roules:
 - Building and watching the JSX files
 - Copying HTML files into the build directory
 - Cleaning the build directory
 */

var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var envify = require("envify/custom");
var source = require("vinyl-source-stream");
var del = require("del");
var webserver = require("gulp-webserver");
var runSequence = require("run-sequence");

// compiles jsx to js, some transformations, creates a bundle and copies to
// build directory
gulp.task("scripts", function () {
    return browserify({
        entries: "./src/scripts/app.jsx",
        extensions: [".jsx"],
        debug: true
    })
    .transform(babelify, { presets: ["es2015", "react"] })
    .transform(envify({APP_ENV: process.env.APP_ENV}))
    .bundle()
    .pipe(source("scripts/bundle.js"))
    .pipe(gulp.dest("build"));
});

// copies html files to build directory
gulp.task("html", function() {
    return gulp.src(["./src/*.html", "./src/favicon.ico"])
        .pipe(gulp.dest("build"));
});

// copies css files to build directory
gulp.task("css", function() {
    return gulp.src("./src/styles/**/*")
        .pipe(gulp.dest("build/styles"));
});

// copies images files to build directory
gulp.task("images", function() {
    return gulp.src("./src/images/*")
        .pipe(gulp.dest("build/images"));
});

// copies json files to build directory
gulp.task("data", function() {
    return gulp.src("./src/data/**/*")
        .pipe(gulp.dest("build/data"));
});

gulp.task("clean", function() {
    del("build/*");
});

//gulp plugin to run a local webserver with LiveReload
gulp.task("webserver", function() {
    return gulp.src(["build"])
        .pipe(webserver({
            host: "0.0.0.0",
            port: process.env.PORT || 5050,
            livereload: true,
            open: true,
            fallback: "index.html"
        }));
});

// watches code changes and runs the 'scripts' task
gulp.task("serve", function() {
    runSequence("build", "webserver");
    gulp.watch("./src/*.html", ["html"]);
    gulp.watch("./src/styles/*.css", ["css"]);
    gulp.watch(["./src/scripts/*.jsx",
        "./src/scripts/components/**/*.jsx",
        "./src/scripts/components/core/**/*.*"], ["scripts"]);
});

gulp.task("copy", ["html", "css", "images", "data"]);
gulp.task("build", ["scripts", "copy"]);
