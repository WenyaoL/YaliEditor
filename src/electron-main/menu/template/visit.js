import { BrowserWindow } from 'electron'

export default function (app,shortKeymap) {
    const i18n = app.appI18n

    const ONLY =  shortKeymap.get("model.ONLY")
    const SV =  shortKeymap.get("model.SV")
    const IR =  shortKeymap.get("model.IR")

    return {
        label: i18n.t('VISIT_'),
        submenu: [
            {
                label: i18n.t('VISIT_show_or_hide_sidebar'), click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutSidebarDisplay')
                }
            },
            { type: 'separator' },
            { label: i18n.t('VISIT_zoom_in'), role: 'zoomIn' },
            { label: i18n.t('VISIT_zoom_out'), role: 'zoomOut' },
            { label: i18n.t('VISIT_resetZoom'), role: 'resetZoom' },
            { type: 'separator' },
            {
                label: i18n.t('Origin_Model'),accelerator:ONLY?ONLY:null, click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutEditModel', { editModel: 'ONLY' })
                }
            },
            {
                label: i18n.t('SV_Model'), accelerator:SV?SV:null, click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutEditModel', { editModel: 'SV' })
                }
            },
            {
                label: i18n.t('IR_Model'), accelerator:IR?IR:null, click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutEditModel', { editModel: 'IR' })
                }
            },
            { type: 'separator' },
            {
                label: i18n.t('VISIT_fullScreen'), type: 'checkbox', click: () => {
                    let isFull = BrowserWindow.getFocusedWindow().isFullScreen()
                    BrowserWindow.getFocusedWindow().setFullScreen(!isFull)
                }
            },

        ]
    }
}