const { glob } = require("glob")

describe('Checking generated html files', () => {
  it('should generated html files', (done) => {
    const files = glob.sync(JSON.stringify([
      './dist/index_*.js',
      './dist/index_*.css',
      './dist/search_*.js',
      './dist/search_*.css'
    ]))
    if(files.length > 0) {
      done()
    }else {
      throw new Error('no such files in dist folder')
    }
  })
})