import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import vue from 'rollup-plugin-vue'
import postcss from 'rollup-plugin-postcss'

const inputPath = path.resolve(__dirname, './src/index.js')
const outputUMDPath = path.resolve(__dirname, './dist/datav.umd.js')
const outputESPath = path.resolve(__dirname, './dist/datav.es.js')

export default {
  input: inputPath,
  output: [
    {
      name: 'datav', // //当 format 为 iife 和 umd 时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
      file: outputUMDPath, // 输出路径
      format: 'umd', // 五种输出格式：amd /  es6 / iife / umd / cjs
      globals: {
        vue: 'vue'
      }
      // sourcemap: true  //生成 bundle.map.js 文件，方便调试
    },
    {
      name: 'datav',
      file: outputESPath,
      format: 'es',
      globals: {
        vue: 'vue'
      }
    }
  ],
  plugins: [
    vue(), // 对 vue 的支持(位置要放前面)
    resolve(), // 将依赖混合打包
    commonjs(), // 识别 common 模块
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**' // only transpile our source code
    }),
    json(), // 编译后识别 json
    postcss({
      plugins: []
    }) // 增加对 scss 的支持
  ],
  external: [ // 将依赖依旧作为依赖，而不打包进来
    'vue'
  ]
}