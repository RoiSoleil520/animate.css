module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR'],
      cascade: false,
      grid: true
    }),
    require('cssnano')({
      preset: ['default', {
        reduceIdents: {
          keyframes: false
        },
        discardComments: {
          removeAll: true
        },
        normalizeWhitespace: true,
        colormin: true,
        minifySelectors: true
      }]
    })
  ]
};