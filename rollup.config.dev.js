const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const inputPath = path.resolve(__dirname, './src/index.js')
const outputUMDPath = path.resolve(__dirname, './dist/datav.umd.js')
const outputESPath = path.resolve(__dirname, './dist/datav.es.js')

module.exports = {
  input: inputPath,
  output: [
    {
      name: 'datav', // //当 format 为 iife 和 umd 时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
      file: outputUMDPath, // 输出路径
      format: 'umd', // 五种输出格式：amd /  es6 / iife / umd / cjs
      // sourcemap: true  //生成 bundle.map.js 文件，方便调试
    },
    {
      name: 'datav',
      file: outputESPath,
      format: 'es'
    }
  ],
  plugins: [
    resolve(), // 将依赖混合打包
    commonjs() // 识别 common 模块
  ],
  external: [ // 将依赖依旧作为依赖，而不打包进来
    'sam-test-data'
  ]
}