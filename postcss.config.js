module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
      cascade: false,
      remove: true, // Remove outdated prefixes
    }),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        reduceIdents: {
          keyframes: false, // Keep keyframe names
        },
        mergeLonghand: true,
        mergeRules: true,
        minifySelectors: true,
        normalizeUrl: false,
        discardUnused: false,
      }]
    })
  ]
};