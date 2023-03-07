import BaseConfig from './BaseConfig'
import {EditorConfig} from './'
import { defaultKeyMap } from '../config/IRConfig';

export class CommonConfig implements BaseConfig {

    editorConfig?: EditorConfig

    //是否为测试模式
    isTestModel?: boolean

    //keymap
    defaultKeyMap: Map<string,string> = defaultKeyMap;

    constructor() { }

    setTestModel(flag: boolean) {
        this.isTestModel = flag
        return this
    }

    setKeyMap(keyMap:Map<string,string>){
        this.defaultKeyMap = keyMap
    }

    end() {
        return this.editorConfig
    }
}

export default CommonConfig