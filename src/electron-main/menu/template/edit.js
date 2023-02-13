
export default function () {
    const editMenus = {
        label: '编辑(E)',
        submenu: [
            { label: '复制', role: 'copy', accelerator: 'ctrl+c' },
            { label: '粘贴', role: 'paste', accelerator: 'ctrl+v' },
            { label: '剪切', role: 'cut', accelerator: 'ctrl+x' },
            { label: '删除', role: 'delete', accelerator: 'ctrl+d' },
            { label: '全选', role: 'selectall', accelerator: 'ctrl+a' },
            { label: '撤销', role: 'undo', accelerator: 'ctrl+z' },
        ]
    }
    return editMenus
}