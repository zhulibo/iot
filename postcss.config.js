const postcssImport = require('postcss-import')
const postcssPresetEnv = require('postcss-preset-env')
const postcssMixins = require('postcss-mixins')

module.exports = {
  plugins: [
    postcssImport({
      addModulesDirectories: ['node_modules']
    }),
    postcssPresetEnv({
      stage: 0,
      features: {
        'cascade-layers': false // 禁用layer属性转换
      }
    }),
    postcssMixins({
      mixinsFiles: './src/assets/css/mixins.pcss',
    })
  ],
}
