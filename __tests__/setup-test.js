const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const compiler = webpack(require('../config/webpack.dev'))

function normalizeArray (arr) {
  return Array.isArray(arr) ? arr : [arr]
}

function getAllJsPaths (webpackJson) {
  const { assetsByChunkName } = webpackJson
  return Object.values(assetsByChunkName).reduce((paths, assets) => {
    for (const asset of normalizeArray(assets)) {
      if (asset != null && asset.endsWith('.js')) {
        paths.push(asset)
      }
    }
    return paths
  }, [])
}

const index = Math.max(
  process.argv.indexOf('--port'),
  process.argv.indexOf('-p')
)
const port = index !== -1 ? +process.argv[index + 1] : 4444

const app = express()
  .use(middleware(compiler, { serverSideRender: true }))
  .use((req, res) => {
    const webpackJson = res.locals.webpackStats.toJson()
    const paths = getAllJsPaths(webpackJson)
    const index = fs
      .readFileSync(path.join(__dirname, '../src/index.html'))
      .toString()
    res.send(
      index.replace(
        '</body>',
        `${paths
          .map(path => `<script src="${path}"></script>`)
          .join('')}\n</body>`
      )
    )
  })

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}/`)
})
