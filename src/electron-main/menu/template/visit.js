import { BrowserWindow } from 'electron'

export default function (shortKeymap) {

    const ONLY =  shortKeymap.get("model.ONLY")
    const SV =  shortKeymap.get("model.SV")
    const IR =  shortKeymap.get("model.IR")

    return {
        label: '视图(V)',
        submenu: [
            {
                label: '显示/隐藏侧边栏', click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutSidebarDisplay')
                }
            },
            { type: 'separator' },
            { label: '放大', role: 'zoomIn' },
            { label: '缩小', role: 'zoomOut' },
            { label: '重置缩放', role: 'resetZoom' },
            { type: 'separator' },
            {
                label: '源码模式',accelerator:ONLY?ONLY:null, click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutEditModel', { editModel: 'ONLY' })
                }
            },
            {
                label: 'SV模式', accelerator:SV?SV:null, click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutEditModel', { editModel: 'SV' })
                }
            },
            {
                label: 'IR模式', accelerator:IR?IR:null, click: () => {
                    BrowserWindow
                        .getFocusedWindow()
                        .webContents
                        .send('main-checkoutEditModel', { editModel: 'IR' })
                }
            },
            { type: 'separator' },
            {
                label: '全屏', type: 'checkbox', click: () => {
                    let isFull = BrowserWindow.getFocusedWindow().isFullScreen()
                    BrowserWindow.getFocusedWindow().setFullScreen(!isFull)
                }
            },

        ]
    }
}