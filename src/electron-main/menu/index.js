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

    constructor(app) {
        this.app = app
    }

    init() {
        Menu.setApplicationMenu(this.build(this.app.getRecentDocuments(),this.app.getCurrKeyMap()))
    }

    build(recentDocuments,shortKeymap) {
        const template = [
            file(this.app,recentDocuments),
            edit(this.app,shortKeymap),
            paragraph(this.app,shortKeymap),
            format(this.app,shortKeymap),
            theme(this.app),
            visit(this.app,shortKeymap),
            about(this.app)
        ]
        return Menu.buildFromTemplate(template)
    }

    updateMenu(){
        Menu.setApplicationMenu(this.build(this.app.getRecentDocuments(),this.app.getCurrKeyMap()))
    }

}






