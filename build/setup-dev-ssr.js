/**
 * dev-server
 * @author  Yee
 * @date    2021/4/15
 * @desc    本地开发用
 */
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
// const chokidar = require('chokidar')
// const MFS = require('memory-fs')
// const webpackDevServer = require('webpack-dev-server')

const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(path.resolve(__dirname, '../dist'), file), 'utf-8')
  } catch (e) {
  }
}

const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost',
  publicPath: '/dist/',
  serverSideRender: true,
  writeToDisk: true,
};

module.exports = function setupDevServer (templatePath, cb) {

  let clientManifest
  let bundle
  let template = fs.readFileSync(templatePath, 'utf-8')


  let ready
  const readyPromise = new Promise(r => {
    ready = r
  })

  const update = () => {
    if (bundle && clientManifest) {
      cb(bundle, {
        template,
        clientManifest
      })
      ready()
    }
  }

  // chokidar.watch(path.resolve(__dirname, 'src')).on('change', () => {
  //   template = fs.readFileSync(templatePath, 'utf-8')
  //   console.log('src updated.')
  //   update()
  // })

  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
  clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin())

  // webpackDevServer.addDevServerEntrypoints(clientConfig, options)
  // webpackDevServer.addDevServerEntrypoints(serverConfig, options)

  const compiler = webpack([clientConfig, serverConfig], (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings);
    }
    console.log('compiler done')
  })

  // const mfs = new MFS()
  // compiler.outputFileSystem = mfs

  // const server = new webpackDevServer(compiler, options)

  // server.listen(5000, 'localhost', () => {
  //   console.log('dev server listening on port 5000');
  // })

  /*
  const clientCompiler = webpack(clientConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      // [在这里处理错误](#error-handling)
      console.log(err)
    }
    console.log('clientCompiler cb')
    clientManifest = JSON.parse(readFile(
      fs,
      'vue-ssr-client-manifest.json'
    ))
    update()
  });
  clientCompiler.hooks.done.tap('setup-dev-ssr', (stats) => {
    console.log('clientCompiler done')
  })
  const serverCompiler = webpack(serverConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
      // [在这里处理错误](#error-handling)
      console.log(err)
    }
    console.log('serverCompiler cb')
    bundle = JSON.parse(readFile(fs, 'vue-ssr-server-bundle.json'))
    update()
  });
  serverCompiler.hooks.done.tap('setup-dev-ssr', (stats) => {
    console.log('serverCompiler done')
  })
   */
  return readyPromise
}
