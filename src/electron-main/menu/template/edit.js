
export default function (app,shortKeymap) {
    const i18n = app.appI18n

    const undo = shortKeymap.get('edit.undo')
    const redo = shortKeymap.get('edit.redo')

    const editMenus = {
        label: i18n.t('EDIT_'),
        submenu: [
            { label: i18n.t('EDIT_copy'), role: 'copy', accelerator: 'ctrl+c' },
            { label: i18n.t('EDIT_paste'), role: 'paste', accelerator: 'ctrl+v' },
            { label: i18n.t('EDIT_cut'), role: 'cut', accelerator: 'ctrl+x' },
            { label: i18n.t('EDIT_delete'), role: 'delete', accelerator: 'ctrl+d' },
            { label: i18n.t('EDIT_selectall'), role: 'selectall', accelerator: 'ctrl+a' },
            { label: i18n.t('EDIT_undo'), role: 'undo', accelerator: undo?undo:'' },
            { label: i18n.t('EDIT_redo'), role: 'redo', accelerator: redo?redo:'' },
            
        ]
    }
    return editMenus
}