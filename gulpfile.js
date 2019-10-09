const gulp = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const uglifycss = require("gulp-uglifycss");
const image = require("gulp-image");
const del = require("del");
const browserSync = require("browser-sync").create();

const paths = {
  srcPath: "src",
  buildPath: "build",

  sassPath: "src/scss",
  sassBuildPath: "build/css",

  jsPath: "src/js",
  jsBuildPath: "build/js",

  fontsPath: "src/fonts",
  fontsBuildPath: "build/fonts",

  imagesPath: "src/images",
  imagesBuildPath: "build/images"
};

function pagesDEV() {
  return gulp
    .src(paths.srcPath + "/**/*.html")
    .pipe(gulp.dest(paths.buildPath))
    .pipe(browserSync.stream());
}

function stylesDEV() {
  return gulp
    .src(paths.sassPath + "/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(paths.sassBuildPath))
    .pipe(browserSync.stream());
}

function scriptsDEV() {
  return gulp
    .src(paths.jsPath + "/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(gulp.dest(paths.jsBuildPath))
    .pipe(browserSync.stream());
}

function pagesPROD() {
  return gulp
    .src(paths.srcPath + "/**/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.buildPath));
}

function stylesPROD() {
  return gulp
    .src(paths.sassPath + "/**/*.scss")
    .pipe(sass())
    .pipe(
      uglifycss({
        maxLineLen: 80,
        uglyComments: true
      })
    )
    .pipe(gulp.dest(paths.sassBuildPath));
}

function scriptsPROD() {
  return gulp
    .src(paths.jsPath + "/**/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(
      uglify({
        toplevel: true
      })
    )
    .pipe(gulp.dest(paths.jsBuildPath));
}

function clean() {
  return del([paths.buildPath + "/*"]);
}

function fonts() {
  return gulp
    .src(paths.fontsPath + "/*", {
      allowEmpty: true
    })
    .pipe(gulp.dest(paths.fontsBuildPath));
}

function imagesDEV() {
  return gulp
    .src(paths.imagesPath + "/*", {
      allowEmpty: true
    })
    .pipe(gulp.dest(paths.imagesBuildPath));
}

function imagesPROD() {
  return gulp
    .src(paths.imagesPath + "/*", {
      allowEmpty: true
    })
    .pipe(image())
    .pipe(gulp.dest(paths.imagesBuildPath));
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(paths.srcPath + "/**/*.html", pagesDEV);
  gulp.watch(paths.jsPath + "/**/*.js", scriptsDEV);
  gulp.watch(paths.sassPath + "/**/*.scss", stylesDEV);
  gulp.watch(paths.fontsPath, fonts);
  gulp.watch(paths.imagesPath, imagesDEV);
}

gulp.task(
  "dev",
  gulp.series(clean, pagesDEV, stylesDEV, scriptsDEV, fonts, imagesDEV, watch)
);
gulp.task(
  "build",
  gulp.series(clean, pagesPROD, stylesPROD, scriptsPROD, fonts, imagesPROD)
);
