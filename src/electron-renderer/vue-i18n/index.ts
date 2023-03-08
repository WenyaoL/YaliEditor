import { createI18n } from 'vue-i18n'

const messages = {
    en: {
        KeybindingPanel:{
            key_heading:"shortKey",
            key_info:`Here is the place to set the YaliEditor shortcut key!!!<br />
            Yalier has set a default set of shortcut keys for you(* ^ _ ^ *).Of course, you can also define shortcut keys according to your own style.<br />
            <strong>Please make sure all lowercase keys are in the order of ctrl, shift, alt, such as ctrl+shift+alt+k<br />
            The direct configuration of keys is temporarily not supported. Please enter a string to configure
            </strong>`
        },
        SystemPanel:{
            system_heading:'System',
            system_heading_clear:'Clear',
            system_heading_i18n:'internationalization(i18n)',
            system_clear_info:'Cache clearing and other functions are provided here, such as: recent file data clearing, App data cache clearing',
            system_clear_button:'Clear cached data',
            system_clear_button_info:'(This will cause Yali to reset to the default state at the time of installation)',
            system_i18n_info:'Set regional language'
        }
    },
    zh: {
        KeybindingPanel:{
            key_heading:"快捷键",
            key_info:`这里是设置YaliEditor快捷键的地方!!!<br />
            Yalier已经为你们设置了一套默认的快捷键(*^_^*)。当然你们也可以根据自己的风格定义快捷键.<br />
            <strong>请确保全部小写,按键顺序为ctrl,shift,alt,如:ctrl+shift+alt+k<br />
                暂时不支持按键直接配置，请输入字符串进行配置
            </strong>`
        },
        SystemPanel:{
            system_heading:'系统',
            system_heading_clear:'清除',
            system_heading_i18n:'国际化(i18n)',
            system_clear_info:'这里提供缓存清除等功能,如:最近文件数据清除,App数据缓存清除',
            system_clear_button:'清除缓存数据',
            system_clear_button_info:'(这会导致Yali重置到安装时的默认状态)',
            system_i18n_info:'设置地区语言'
        }
    }
}


const i18n = createI18n({
    locale: global.yaliEditor.locale, // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
})

export default i18n