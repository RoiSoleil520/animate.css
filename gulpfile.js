// Utilities
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fs = require('fs');

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

gulp.task('createCSS', function() {
  return gulp
    .src(activatedAnimations)
    .pipe(concat(opts.concatName))
    .pipe(postcss([autoprefixer(opts.autoprefixer)]))
    .pipe(gulp.dest(opts.destPath))
    .pipe(postcss([cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        reduceIdents: { keyframes: false },
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        normalizeUrl: false,
        discardUnused: false,
      }]
    })]))
    .pipe(rename(opts.minRename))
    .pipe(gulp.dest(opts.destPath));
});

gulp.task('addHeader', function() {
  return gulp
    .src('*.css')
    .pipe(header(opts.banner, pkg))
    .pipe(gulp.dest(opts.destPath));
});

// Create individual optimized animation files for tree-shaking
gulp.task('createModular', function() {
  return gulp
    .src(['source/**/*.css', '!source/_base.css'])
    .pipe(postcss([autoprefixer(opts.autoprefixer)]))
    .pipe(postcss([cssnano({
      preset: ['default', {
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        reduceIdents: { keyframes: false },
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
      }]
    })]))
    .pipe(gulp.dest('./lib/'));
});

gulp.task('default', gulp.series('createCSS', 'addHeader'));
gulp.task('modular', gulp.series('createModular'));

// ----------------------------
// Helpers/functions
// ----------------------------

// Read the config file and return an array of the animations to be activated
function activateAnimations() {
  const categories = JSON.parse(fs.readFileSync('animate-config.json'));
  const target = [];
  let count = 0;

  for (const category in categories) {
    if (categories.hasOwnProperty(category)) {
      const files = categories[category];

      for (const file in files) {
        if (files[file]) {
          // marked as true
          target.push(`source/${category}/${file}.css`);
          count += 1;
        }
      }
    }
  }
  // prepend base CSS
  target.unshift('source/_base.css');

  if (!count) {
    console.log('No animations activated.');
  } else {
    console.log(`${count} ${count > 1 ? 'animations' : 'animation'} activated.`);
  }

  return target;
}
