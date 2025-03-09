import gulp from 'gulp';
import { deleteAsync } from 'del'; // Используем del для очистки папки dist
import browserSync from 'browser-sync';
import pug from 'gulp-pug';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import fileinclude from 'gulp-file-include';
import groupMedia from 'gulp-group-css-media-queries';
import autoprefixer from 'gulp-autoprefixer';
import ttf2woff2 from 'gulp-ttf2woff2';
import ttf2woff from 'gulp-ttf2woff';
import fonter from 'gulp-fonter';

const project_folder = './dist';
const source_folder = './src'; // Изменил на src, так как это более стандартное название
const { src, dest, series, parallel, watch } = gulp;
const sass = gulpSass(dartSass);
const bs = browserSync.create();

/* Paths */
const paths = {
  build: {
    html: `${project_folder}/`,
    css: `${project_folder}/css/`,
    js: `${project_folder}/js/`,
    img: `${project_folder}/img/`,
    fonts: `${project_folder}/fonts/`,
    libs: `${project_folder}/libs/`,
  },
  src: {
    html: `${source_folder}/*.html`,
    pug: `${source_folder}/pug/*.pug`,
    scss: `${source_folder}/scss/*.scss`,
    css: `${source_folder}/css/**/*.css`,
    js: `${source_folder}/js/*.js`,
    jsCopy: `${source_folder}/jsCopy/*.js`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
    fonts: `${source_folder}/fonts/*.ttf`,
    libs: `${source_folder}/libs/**/*`,
  },
  watch: {
    html: `${source_folder}/html/**/*.html`,
    pug: `${source_folder}/pug/**/*.pug`,
    scss: `${source_folder}/scss/**/*.scss`,
    js: `${source_folder}/js/**/*.js`,
    img: `${source_folder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
  },
  clean: project_folder,
};

/* Funcs */
function browserSyncStart() {
  bs.init({
    server: {
      baseDir: project_folder,
    },
    port: 3000,
    notify: false,
  });
}

function clearDist() {
  return deleteAsync(paths.clean);
}

function pugF() {
  return src(paths.src.pug)
    .pipe(pug({ pretty: true }))
    .pipe(dest(paths.build.html))
    .pipe(bs.stream());
}

function scssF() {
  return src(paths.src.scss)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(groupMedia())
    .pipe(
      autoprefixer({ overrideBrowserslist: ['last 3 versions'], cascade: true })
    )
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.build.css))
    .pipe(bs.stream());
}

function js() {
  return src(paths.src.js)
    .pipe(fileinclude())
    .pipe(dest(paths.build.js))
    .pipe(bs.stream());
}

function copyCSS() {
  return src(paths.src.css).pipe(dest(paths.build.css));
}

function copyJS() {
  return src(paths.src.jsCopy).pipe(dest(paths.build.js));
}

function img() {
  return src(paths.src.img).pipe(dest(paths.build.img)).pipe(bs.stream());
}

function fonts() {
  src(paths.src.fonts).pipe(ttf2woff()).pipe(dest(paths.build.fonts));
  return src(paths.src.fonts).pipe(ttf2woff2()).pipe(dest(paths.build.fonts));
}

function otf2ttf() {
  return src([`${source_folder}/fonts/*.otf`])
    .pipe(fonter({ formats: ['ttf'] }))
    .pipe(dest(`${source_folder}/fonts/`));
}

function watchFiles() {
  watch(paths.watch.pug, pugF);
  watch(paths.watch.scss, scssF);
  watch(paths.watch.js, js);
  watch(paths.watch.img, img);
}

const build = series(
  clearDist,
  parallel(pugF, scssF, js, img, copyCSS, copyJS)
);

const dev = series(build, parallel(browserSyncStart, watchFiles));

export { dev as default, build, img, copyCSS, copyJS, fonts };
