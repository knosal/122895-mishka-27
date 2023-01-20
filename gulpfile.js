import gulp from 'gulp'; // Gulp для автоматизации
import plumber from 'gulp-plumber'; // перехват ошибок, и после устранения ошибки сборка восстановит работоспособность
import sass from 'gulp-dart-sass';  // для использования препроцессора SASS
import postcss from 'gulp-postcss'; //
import autoprefixer from 'autoprefixer'; // Автопрефиксы
import csso from 'postcss-csso';    // минимизатор CSS
import htmlmin from 'gulp-htmlmin'; // минимизатор HTML
import terser from 'gulp-terser';   // минификация и оптимизация javascript
import rename from 'gulp-rename';   // переименование файлов
import browser from 'browser-sync'; //
import squoosh from 'gulp-libsquoosh'; // Минимизируйте изображения
// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Html
export const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts
export const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'));
}

// Images
export const optimizeImages = () => {
  return gulp.src('source/img//*.{png,jpg}')
      .pipe(squoosh())
      .pipe(gulp.dest('build/img'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
      .pipe(gulp.dest('build/img'))
}

// Copy
export const copy = (done) => {
  gulp.src([
          'source/fonts/*.{woff2}',
          'source/*.ico',
          'source/manifest.webmanifest',
      ], {
          base: 'source'
      })
      .pipe(gulp.dest('build'))
  done();
}

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'source'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload
const reload = (done) => {
  browser.reload();
  done();
}
// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

export default gulp.series(
  styles, server, watcher
);
