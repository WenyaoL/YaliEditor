import BaseConfig from './BaseConfig'
import {EditorConfig} from './'

export class CommonConfig implements BaseConfig {

    editorConfig?: EditorConfig

    //是否为测试模式
    isTestModel?: boolean

    constructor() { }

    setTestModel(flag: boolean) {
        this.isTestModel = flag
        return this
    }

    end() {
        return this.editorConfig
    }
}

export default CommonConfig