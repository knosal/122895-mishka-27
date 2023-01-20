import gulp from 'gulp'; //// Gulp для автоматизации
import plumber from 'gulp-plumber'; // перехват ошибок, и после устранения ошибки сборка восстановит работоспособность
import sass from 'gulp-dart-sass'; // для использования препроцессора SASS
import postcss from 'gulp-postcss'; //
import autoprefixer from 'autoprefixer'; // Автопрефиксы
import csso from 'postcss-csso'; //минимизатор CSS
import rename from 'gulp-rename'; // // переименование файлов
import browser from 'browser-sync'; //

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
const html = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
}

// Scripts
const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(gulp.dest('build/js'));
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

// Watcher
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

export default gulp.series(
  styles, server, watcher
);
