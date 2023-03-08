import { BrowserWindow } from 'electron'

export default function (app,shortKeymap) {
    const i18n = app.appI18n

    const strong = shortKeymap.get('format.strong')
    const italic = shortKeymap.get('format.italic')
    const underline = shortKeymap.get('format.underline')
    const deleteline = shortKeymap.get('format.deleteline')
    const inlineCode = shortKeymap.get('format.inline-code')

    return {
        label: i18n.t('FORMAT_'),
        submenu: [
            {
                label: i18n.t('FORMAT_bold'), accelerator: strong?strong:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "blod" })
                }
            },
            {
                label: i18n.t('FORMAT_underline'), accelerator: underline?underline:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "underline" })
                }
            },
            {
                label: i18n.t('FORMAT_italic'), accelerator: italic?italic:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "italic" })
                }
            },
            {
                label: i18n.t('FORMAT_inlineCode'), accelerator: inlineCode?inlineCode:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "codeline" })
                }
            },
            {
                label: i18n.t('FORMAT_deleteline'), accelerator: deleteline?deleteline:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createType', { type: "deleteline" })
                }
            },
        ]
    }
}

