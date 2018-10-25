require('require-dir')('./tasks')

const env = require('dotenv').config().parsed

const gulp = require('gulp')
const connect = require('gulp-connect')
const fs = require('fs')
const codegen = require('./tasks/codegen')

gulp.task('connect', () => {
  return connect.server({
    host: env.HOST,
    root: 'build/',
    port: env.PORT,
    livereload: true
  })
})

gulp.task('prepare-build-directory', () => {
  if (fs.existsSync('build')) {
    return gulp.src('build/**/*', {read: false})
      .pipe(require('gulp-rimraf')({force: true}))
  } else {
    fs.mkdirSync('build/')
  }
})

gulp.task('prepare-intermidiate-directory', ['prepare-build-directory'],  () => {
  if (fs.existsSync('intermidiate')) {
    return gulp.src('intermidiate/', {read: false})
      .pipe(require('gulp-rimraf')({force: true}))
  } else {
    fs.mkdirSync('intermidiate/')
  }
})

gulp.task('transpile', ['prepare-intermidiate-directory'], () => {
  fs.mkdirSync('intermidiate/')
  const sourcemaps = require('gulp-sourcemaps')
  const ts = require('gulp-typescript').createProject('./tsconfig.json')
  return gulp.src('src/ts/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(ts())
    .pipe(sourcemaps.write('.', { sourceRoot: '../src/ts', includeContent: false }))
    .pipe(gulp.dest('intermidiate'))
})

gulp.task('webpack', ['transpile'], () => {
  const stream = require('webpack-stream')
  const webpack2 = require('webpack')

  const config = {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ["source-map-loader"],
          enforce: "pre"
        }
      ]
    },
    output: {filename: 'bundle.js'},
    devtool: 'source-map',
    mode: env.MODE
  }

  return gulp.src('intermidiate/index.js')
    .pipe(stream(config, webpack2))
    .pipe(gulp.dest('build/'))
})

gulp.task('deploy-static', ['webpack'], () => {
  fs.copyFileSync('src/index.html', 'build/index.html')
})

gulp.task('reload', ['deploy-static'], () => {
  return gulp.src(['src/**/*']).pipe(connect.reload())
})

let mainWatcher = null
gulp.task('start-watch', () => {
  mainWatcher = gulp.watch(['src/**/*'], ['reload'])
})

gulp.task('stop-watch', () => {
  if (mainWatcher) {
    mainWatcher.end()
    mainWatcher = null
  }
})

gulp.task('codegen', ['stop-watch'], () => {
  if (mainWatcher) {
    mainWatcher.end()
    mainWatcher = null
    codegen().then(() => gulp.start(['reload', 'start-watch']))
  } else {
    codegen().then()
  }
})

gulp.task('watch-codegen', () => {
  return gulp.watch(['gameData/gameData.cdb'], ['codegen'])
})

gulp.task('default', ['watch-codegen', 'connect', 'deploy-static', 'start-watch'])