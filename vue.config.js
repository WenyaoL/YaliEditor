const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack:{
    entry: {
      app: './src/main.ts' //main.js顺手改成ts就好，出的错处理一下
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx','js','json'],
    }
  },
  pluginOptions:{
    electronBuilder: {
      //nodeIntegration: true,
      contextIsolation: true,
      preload: 'src/electron-main/preload.js',
      builderOptions: {
        /*extraResources: {
          from: './public',
          to:'./'
        },*/
        win:{
          icon: './public/yali.png'
        }
      }
      

    }
  }
})
