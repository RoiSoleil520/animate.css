// Utilities
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');

// Gulp
const gulp = require('gulp');

// Gulp plugins
const concat = require('gulp-concat');
const header = require('gulp-header');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');

// Misc/global vars
const pkg = JSON.parse(fs.readFileSync('package.json'));
const activatedAnimations = activateAnimations();

// Task options
const opts = {
  destPath: './',
  concatName: 'animate.css',

  autoprefixer: {
    overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    cascade: false,
  },

  minRename: {
    suffix: '.min',
  },

  banner: [
    '@charset "UTF-8";\n',
    '/*!',
    ' * <%= name %> -<%= homepage %>',
    ' * Version - <%= version %>',
    ' * Licensed under the MIT license - http://opensource.org/licenses/MIT',
    ' *',
    ' * Copyright (c) <%= new Date().getFullYear() %> <%= author.name %>',
    ' */\n\n',
  ].join('\n'),
};

// ----------------------------
// Gulp task definitions
// ----------------------------

// Create CSS with modern async/await syntax
async function createCSS() {
  return gulp
    .src(activatedAnimations)
    .pipe(concat(opts.concatName))
    .pipe(postcss([autoprefixer(opts.autoprefixer)]))
    .pipe(gulp.dest(opts.destPath))
    .pipe(postcss([cssnano({
      reduceIdents: { keyframes: false },
      discardComments: { removeAll: true },
      normalizeWhitespace: true,
      colormin: true,
      minifyFontValues: true,
      minifyGradients: true,
      minifyParams: true,
      minifySelectors: true
    })]))
    .pipe(rename(opts.minRename))
    .pipe(gulp.dest(opts.destPath));
}

// Add header to CSS files
async function addHeader() {
  return gulp
    .src('*.css')
    .pipe(header(opts.banner, pkg))
    .pipe(gulp.dest(opts.destPath));
}

// Watch for changes during development
async function watchFiles() {
  gulp.watch('source/**/*.css', gulp.series('createCSS', 'addHeader'));
  gulp.watch('animate-config.json', gulp.series('createCSS', 'addHeader'));
}

// Export tasks
exports.createCSS = createCSS;
exports.addHeader = addHeader;
exports.watch = watchFiles;
exports.default = gulp.series(createCSS, addHeader);

// ----------------------------
// Helpers/functions
// ----------------------------

// Read the config file and return an array of the animations to be activated
function activateAnimations() {
  const categories = JSON.parse(fs.readFileSync('animate-config.json'));
  const target = [];
  let count = 0;

  // Use modern Object.entries for better iteration
  for (const [category, files] of Object.entries(categories)) {
    for (const [file, isActive] of Object.entries(files)) {
      if (isActive) {
        target.push(path.join('source', category, `${file}.css`));
        count += 1;
      }
    }
  }
  
  // Prepend base CSS, variables, and performance optimizations
  target.unshift('source/_variables.css');
  target.unshift('source/_base.css');
  target.unshift('source/_performance.css');

  // Use console.log instead of deprecated gutil.log
  if (!count) {
    console.log('No animations activated.');
  } else {
    console.log(`${count} ${count > 1 ? 'animations' : 'animation'} activated.`);
  }

  return target;
}
