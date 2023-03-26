const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath:'./',
  configureWebpack:{
    entry: {
      app: './src/electron-renderer/main.ts'
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
      fallback:{path:require.resolve("path-browserify")}
    }
  },
  pluginOptions:{
    electronBuilder: {
      //nodeIntegration: true,
      //disableMainProcessTypescript: false,
      mainProcessFile:'src/electron-main/background.js',
      contextIsolation: true,
      customFileProtocol: './',
      preload: 'src/electron-main/preload.js',
      builderOptions: {
        fileAssociations: {
              ext: ["md","markdown","mmd","mdown","mdtxt","mdtext"],
              name: "Markdown",
              description: "Markdown document",
              icon: "./resource/icons/md.png"
        },
        nsis: { //nsis安装器配置
          oneClick: false, // 是否需要点击安装，自动更新需要关掉
          allowToChangeInstallationDirectory:true, //是否能够选择安装路径
          //installerIcon:"./resource/icons/yali.ico",// 安装程序图标（最好用256 × 256以上的图标）
          //uninstallerIcon:"./resource/icons/yali.ico",//卸载程序图标（最好用256 × 256以上的图标）
          perMachine: false, 
          createDesktopShortcut: true, // 创建桌面图标
          //createStartMenuShortcut: true,// 创建开始菜单图标
          //license:"./src/license/license.html" //安装界面的软件许可证，如果不配置，不会出现软件许可证界面
        },
        win:{
          artifactName: "yali-${arch}-win.${ext}",
          icon: './resource/icons/yali.png',
          target: [
            {
              target: "nsis", // 输出目录的方式
              arch: ["x64","ia32"], //机型
            },
            {
              target: "zip",
              arch: ["x64","ia32"]
            }
            ],
          //requestedExecutionLevel: "asInvoker"
        },
        /*electronDownload: {
          customDir: `v13.0.0`,
        },*/
      }
      

    }
  }
})
