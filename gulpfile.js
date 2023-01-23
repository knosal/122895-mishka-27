import gulp from 'gulp'; // Gulp для автоматизации
import plumber from 'gulp-plumber'; // перехват ошибок, и после устранения ошибки сборка восстановит работоспособность
import sass from 'gulp-dart-sass';  // для использования препроцессора SASS
import postcss from 'gulp-postcss'; // библиотека для работы других плагинов
import autoprefixer from 'autoprefixer'; // Автопрефиксы
import csso from 'postcss-csso';    // минимизатор CSS
import htmlmin from 'gulp-htmlmin'; // минимизатор HTML
import terser from 'gulp-terser';   // минификация и оптимизация javascript
import rename from 'gulp-rename';   // переименование файлов
import squoosh from 'gulp-libsquoosh'; // Минимизируйте изображения
import svgo from 'gulp-svgmin';       // минимизации файлов SVG
import svgstore from 'gulp-svgstore';  // объединяет svg
import { deleteAsync as del } from 'del'; // для чистки сборки
import browser from 'browser-sync'; // обнвляет браузер при сохранении
import fileInclude from "gulp-file-include" // Сборка файлов через @include

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
    .pipe(fileInclude())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

// Scripts
const scripts = () => {
  return gulp.src('source/js/*.js')
    .pipe(terser())
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Images
const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(gulp.dest('build/img'))
}

// WebP
const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

// SVG
const svg = async () => {
  gulp.src([
    'source/img/**/*.svg',
    '!source/img/icon/*.svg'
  ])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));
}

const sprites = () => {
  return gulp.src('source/img/icon/*.svg')
    .pipe(svgo())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img/icon'));
}

// Copy
const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
    'source/manifest.webmanifest',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Delete
const clean = () => {
  return del('build');
};

// Server
const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload (перезагружает браузер)
const reload = (done) => {
  browser.reload();
  done();
}

// Watcher (отслеживает файлы и запускает задачи)
const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build
export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp,
    svg,
    sprites
  ),
);

// Default
export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    createWebp,
    svg,
    sprites
  ),
  gulp.series(
    server,
    watcher
  )
);
