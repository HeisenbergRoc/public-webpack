const path  = require('path');
process.chdir(path.join(__dirname, 'smoke/template'))

describe('chapter-build unit test', () => {
  require('./unit/webpack-base-test')
})