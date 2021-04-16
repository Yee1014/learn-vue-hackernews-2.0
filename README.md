# learn-vue-hackernews-2.0

> 记录使用 Webpack 的一次体验

## 起因

1. [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) 项目中使用webpack版本太旧
2. 需要学习 *SSR* 的搭建

## 知识点

### 1. `new Webpack()` [Webpack Node 接口](https://webpack.docschina.org/api/node/)

- 使用 _webpack()_ , 读取 _webpack.config.js_ （传入配置可以多份），完成编辑/打包
- _run()_ 可以快速执行，但是使用完要 _close()_
- _watch()_ 监听文件变更
- *Stats对象* 可以获取更多编译信息
- 默认写入到磁盘，可以使用 *memory-fs* 替换 *outputFileSystem* 写入到内存

### 2. `webpack-dev-server`

- 可以结合 _webpack.config.js_ 快速开启本地服务，并且支持模块热替换，自动刷新

### 3. `webpack-dev-middleware` 和 `webpack-hot-middleware`

- 可以让自建 *server端* 接口 *webpack* 打包后的文件
- 需要配置 `'webpack-hot-middleware/client'` 到 `entry` 入口的第一个
- `webpack-dev-server` 内置集成了这两个插件

