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
      //disableMainProcessTypescript: false,
      //mainProcessFile:'src/background.ts',
      contextIsolation: true,
      preload: 'src/electron-main/preload.js',
      builderOptions: {
        /*extraResources: {
          from: './public',
          to:'./'
        },*/
        nsis: { //nsis安装器配置
          oneClick: false, // 是否需要点击安装，自动更新需要关掉
          allowToChangeInstallationDirectory:true, //是否能够选择安装路径
          installerIcon:"./public/yali.ico",// 安装程序图标（最好用256 × 256以上的图标）
          uninstallerIcon:"./public/yali.ico",//卸载程序图标（最好用256 × 256以上的图标）
          perMachine: true, // 是否需要辅助安装页面
          createDesktopShortcut: true, // 创建桌面图标
          createStartMenuShortcut: true,// 创建开始菜单图标
          //license:"./src/license/license.html" //安装界面的软件许可证，如果不配置，不会出现软件许可证界面
        },
        win:{
          icon: './public/yali.png',
          target: [
            {
              target: "nsis", // 输出目录的方式
              arch: [ // 这个意思是打出来32 bit + 64 bit的包，但是要注意：这样打包出来的安装包体积比较大，所以建议直接打32的安装包。
              "x64",
              //"ia32"
              ]
            }
            ]
        },
        electronDownload: {
          customDir: `v13.0.0`,
        },
      }
      

    }
  }
})
