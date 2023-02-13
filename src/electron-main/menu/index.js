/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import { Menu } from 'electron'
import file from './template/file'
import visit from './template/visit'
import about from './template/about'
import edit from './template/edit'
import format from './template/format'
import paragraph from './template/paragraph'
import theme from './template/theme'

export default class AppMenu {

    constructor(manager) {
        this.manager = manager
    }

    init() {
        Menu.setApplicationMenu(this.build(this.manager.getRecentDocuments()))
    }

    build(recentDocuments) {
        const template = [
            file(this.manager,recentDocuments),
            edit(),
            paragraph(),
            format(),
            theme(this.manager),
            visit(),
            about(this.manager)
        ]
        return Menu.buildFromTemplate(template)
    }

    updateMenu(){
        Menu.setApplicationMenu(this.build(this.manager.getRecentDocuments()))
    }

}






