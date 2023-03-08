import { BrowserWindow } from 'electron'

export default function (app,shortKeymap) {
    const i18n = app.appI18n

    const heading1Key = shortKeymap.get("paragraph.heading-1")
    const heading2Key = shortKeymap.get("paragraph.heading-2")
    const heading3Key = shortKeymap.get("paragraph.heading-3")
    const heading4Key = shortKeymap.get("paragraph.heading-4")
    const heading5Key = shortKeymap.get("paragraph.heading-5")
    const heading6Key = shortKeymap.get("paragraph.heading-6")
    const orderListKey = shortKeymap.get('paragraph.order-list')
    const bulletListKey = shortKeymap.get('paragraph.bullet-list')
    const tocKey = shortKeymap.get('paragraph.toc')
    const htmlBlockKey = shortKeymap.get('paragraph.html-block')
    const mathBlockKey = shortKeymap.get('paragraph.math-block')
    const reduceIndentListKey = shortKeymap.get('paragraph.reduceIndent-list')
    const addIndentListKey = shortKeymap.get('paragraph.addIndent-list')
    const fenceKey = shortKeymap.get('paragraph.code-fence')
    const quoteBlockKey = shortKeymap.get('paragraph.quote-block')

    return {
        label: i18n.t('PARAGRAPH_'),
        submenu: [
            {
                label: i18n.t('PARAGRAPH_heading_1'), accelerator: heading1Key?heading1Key:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createLine', { type: "head", level: 1 })
                }
            },
            {
                label: i18n.t('PARAGRAPH_heading_2'), accelerator: heading2Key?heading2Key:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createLine', { type: "head", level: 2 })
                }
            },
            {
                label: i18n.t('PARAGRAPH_heading_3'), accelerator: heading3Key?heading3Key:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createLine', { type: "head", level: 3 })
                }
            },
            {
                label: i18n.t('PARAGRAPH_heading_4'), accelerator: heading4Key?heading4Key:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createLine', { type: "head", level: 4 })
                }
            },
            {
                label: i18n.t('PARAGRAPH_heading_5'), accelerator: heading5Key?heading5Key:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createLine', { type: "head", level: 5 })
                }
            },
            {
                label: i18n.t('PARAGRAPH_heading_6'), accelerator: heading6Key?heading6Key:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createLine', { type: "head", level: 6 })
                }
            },
            { type: 'separator' },
            {
                label: i18n.t('PARAGRAPH_codeBlock'), accelerator: fenceKey?fenceKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createBlock', { type: "codeblock" })
                }
            },
            {
                label: i18n.t('PARAGRAPH_mathBlock'), accelerator: mathBlockKey?mathBlockKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createBlock', { type: "mathblock" })
                }
            },
            {
                label: i18n.t('PARAGRAPH_htmlBlock'), accelerator: htmlBlockKey?htmlBlockKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createBlock', { type: "htmlblock" })
                }
            },
            { type: 'separator' },
            {
                label: i18n.t('PARAGRAPH_orderList'), accelerator: orderListKey?orderListKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createMulLine', { type: "list" })
                }
            },
            {
                label: i18n.t('PARAGRAPH_bulletList'), accelerator: bulletListKey?bulletListKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createMulLine', { type: "unlist" })
                }
            },
            { type: 'separator' },
            {
                label: i18n.t('PARAGRAPH_quoteBlock'), accelerator: quoteBlockKey?quoteBlockKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createMulLine', { type: "quote" })
                }
            },
            {
                label: i18n.t('PARAGRAPH_toc'), accelerator: tocKey?tocKey:'', click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createToc')
                }
            },
            {
                label: i18n.t('PARAGRAPH_createTable'), click: () => {
                    BrowserWindow.getFocusedWindow()
                        .webContents
                        .send('main-createTable')
                }
            }
        ]
    }
}
