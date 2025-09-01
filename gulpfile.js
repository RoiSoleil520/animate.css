// Utilities
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');
const path = require('path');

// Gulp
const { src, dest, series, parallel } = require('gulp');

// Gulp plugins
const concat = require('gulp-concat');
const header = require('gulp-header');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');

// Misc/global vars
const pkg = JSON.parse(fs.readFileSync('package.json'));
let activatedAnimations;

// Task options
const opts = {
  destPath: './',
  concatName: 'animate.css',

  autoprefixer: {
    overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
    cascade: false,
    grid: true,
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

function createCSS() {
  activatedAnimations = activateAnimations();
  return src(activatedAnimations)
    .pipe(sourcemaps.init())
    .pipe(concat(opts.concatName))
    .pipe(postcss([autoprefixer(opts.autoprefixer)]))
    .pipe(dest(opts.destPath))
    .pipe(postcss([
      cssnano({
        preset: ['default', {
          reduceIdents: {
            keyframes: false
          },
          discardComments: {
            removeAll: true
          }
        }]
      })
    ]))
    .pipe(rename(opts.minRename))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(opts.destPath));
}

function addHeader() {
  return src(['*.css', '!*.min.css'])
    .pipe(header(opts.banner, pkg))
    .pipe(dest(opts.destPath))
    .pipe(src('*.min.css'))
    .pipe(header(opts.banner, pkg))
    .pipe(dest(opts.destPath));
}

// Export tasks
exports.createCSS = createCSS;
exports.addHeader = addHeader;
exports.default = series(createCSS, addHeader);
exports.build = exports.default;

// ----------------------------
// Helpers/functions
// ----------------------------

// Read the config file and return an array of the animations to be activated
function activateAnimations() {
  const categories = JSON.parse(fs.readFileSync('animate-config.json'));
  const target = ['source/_base.css']; // prepend base CSS first
  let count = 0;

  Object.entries(categories).forEach(([category, files]) => {
    Object.entries(files).forEach(([file, isActive]) => {
      if (isActive) {
        target.push(path.join('source', category, `${file}.css`));
        count++;
      }
    });
  });

  if (!count) {
    console.log('⚠️  No animations activated.');
  } else {
    console.log(`✅ ${count} animation${count > 1 ? 's' : ''} activated.`);
  }

  return target;
}
