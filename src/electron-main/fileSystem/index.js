import fs from 'fs'
import fsPromises from 'fs/promises'
import path from 'path'
import { argv } from 'process';
import { BrowserWindow, dialog } from 'electron'
import { CAN_READ_EXTENSION } from '../config'


class AppFileSystem {
    constructor(app) {
        this.app = app
    }

    openFileDialog() {
        return dialog.showOpenDialog({
            filters: [{ name: 'markdown', extensions: ['md', 'txt'] }]
        })
    }

    openFileDialogSync() {
        return dialog.showOpenDialogSync({
            filters: [{ name: 'markdown', extensions: ['md', 'txt'] }]
        })
    }

    openFileDirDialog() {
        return dialog.showOpenDialog({
            properties: ['openDirectory']
        })
    }

    openFileDirDialogSync() {
        return dialog.showOpenDialogSync({
            properties: ['openDirectory']
        })
    }

    openFileSync(filePath) {
        //sync read file
        const data = fs.readFileSync(path.normalize(filePath), { encoding: 'utf8', flag: 'r' })
        return data
    }

    openFile(filePath) {
        if (this.isFile(filePath)) {
            return new Promise((resolve, reject) => {
                fs.readFile(path.normalize(filePath), { encoding: 'utf8', flag: 'r' }, (err, data) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(data)
                })
            })
        }
    }

    handleError(err) {
        BrowserWindow.getFocusedWindow().webContents.send('main-handleErrorMessage', err.message)
    }

    saveAsTemporaryFile(filePath, data) {
        return fsPromises
            .writeFile(path.join(path.dirname(filePath), "~" + path.basename(filePath)), data, 'utf-8')
            .catch(err => console.log(err))
    }

    /**
     * Check access rights
     * @param {*} filePath 
     * @param {*} mode 
     * @returns 
     */
    accessSync(filePath, mode) {
        try {
            fs.accessSync(filePath, mode)
            return true
        } catch (error) {
            return false
        }
    }

    saveFile(filePath, data) {
        //exists but can't write
        if(this.isExists(filePath) && !this.accessSync(filePath, fs.constants.W_OK)){
            this.handleError(new Error("No Write access"))
            //create ~tmp file
            this.saveAsTemporaryFile(filePath, data)
        }

        fs.writeFile(filePath, data, 'utf-8', err => {
            if (err) {
                this.handleError(err)
                this.saveAsTemporaryFile(filePath, data)
            }
        })
    }



    saveFilePromise(filePath, data) {
        //exists but can't write
        if (this.isExists(filePath) && !this.accessSync(filePath, fs.constants.W_OK)) {
            this.handleError(new Error("No Write access"))
            //create ~tmp file
            return this.saveAsTemporaryFile(filePath, data)
        }

        return fsPromises.writeFile(filePath, data, 'utf-8').catch(err=>{
            this.handleError(err)
            //create ~tmp file
            this.saveAsTemporaryFile(filePath, data)
        })
    }

    saveFileDialog(filter) {
        if (filter) {
            return dialog.showSaveDialog({
                filters: filter
            })
        }

        return dialog.showSaveDialog({
            filters: [{ name: 'markdown', extensions: ['md'] }]
        })
    }

    isFile(path) {
        return fs.lstatSync(path).isFile()
    }

    isExists(path){
        try {
            fs.accessSync(path,fs.constants.F_OK)
        } catch (error) {
            return false
        }
        return true
    }

    openFileDirSync(dirPath) {
        const data = fs.readdirSync(dirPath).map(fileName => {
            return path.join(dirPath, fileName)
        })
        return data;
    }

    openFileTreeSync(dirPath, deep) {

        if (deep == 0) return []

        return fs.readdirSync(dirPath).map(fileName => {
            const filePath = path.join(dirPath, fileName)
            if (this.isFile(filePath)) {
                return { name: fileName, path: filePath }
            } else {
                return { name: fileName, path: filePath, child: this.openFileTreeSync(filePath, deep - 1) }
            }
        })
    }

    filterFileTree(tree) {
        return tree.filter(item => {
            //文件夹向下递归
            if (item.child && item.child.length != 0) {
                item.child = this.filterFileTree(item.child)
                return true
            }
            //保留支持文件
            if (this.verifyFile(item.name)) {
                return true
            }
            //剩余过滤
            return false
        })
    }

    createFileTree(dirPath, tree) {
        fs.readdirSync(dirPath).forEach(fileName => {
            const filePath = path.join(dirPath, fileName)
            if (this.isFile(filePath)) {
                //是可打开文件才添加
                if (this.verifyFile(fileName)) tree.push({ name: fileName, path: filePath })
            } else {
                const children = []
                this.createFileTree(filePath, children)
                tree.unshift({ name: fileName, path: filePath, child: children })
            }
        })
    }



    verifyFile(fileName) {
        let flag = false
        CAN_READ_EXTENSION.forEach((value) => {
            flag = flag || fileName.endsWith(value)
        })
        return flag
    }



    async readFontFile() {
        const fontsPath = path.join(__static, "fonts/SourceHanSans-normal");
        const fontsPath2 = path.join(__static, "fonts/SourceHanSans-bold");

        const normal = await this.openFile(fontsPath)
        const bold = await this.openFile(fontsPath2)
        return {
            normal: normal,
            bold: bold
        }
    }


}


export default AppFileSystem