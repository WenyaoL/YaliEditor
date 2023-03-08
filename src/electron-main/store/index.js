import Store from 'electron-store'
import {defaultKeyMap} from '../config'
const store = new Store({
    clearInvalidConfig:true,
    schema:{
        theme:{
            type:'string',
            default:'light',
            description:'主题类型'
        },
        recentDocuments:{
            type:'array',
            default:[],
            description:'最近打开文件列表,{fileName:"文件名",dirName:"目录名",description:"文章前几行的文本信息"}'
        },
        currKeyMap:{
            type:'object',
            default:Object.fromEntries(defaultKeyMap.entries()),
            description:'快捷键映射'
        },
        currLocale:{
            type:'string',
            default:'zh',
            description:'current locale'
        }
    }
})

export default store