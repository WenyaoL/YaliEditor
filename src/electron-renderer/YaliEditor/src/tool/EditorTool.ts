import YaLiEditor from "..";
import { createPopper, Instance } from '@popperjs/core';
import { langCanload } from './data/lang'
import IconTables from './file-icon'
import type Icon from './file-icon/type/icon'
import './file-icon/index.css'
import SuggestionPopper from "./flow-popper/SuggestionPopper";
import emoji_data from './data/full.json'

const emojiData = Object.entries(emoji_data)


class EditorTool {
    editor: YaLiEditor;
    rootElement: HTMLElement;
    suggestionPopper: SuggestionPopper


    constructor(editor: YaLiEditor) {
        this.editor = editor

        this.rootElement = document.createElement("div")
        this.rootElement.id = "yali-toolTip"
        //this.editor.rootElement.appendChild(this.rootElement)
        document.body.appendChild(this.rootElement)


        this.suggestionPopper = new SuggestionPopper(this)

    }

    showSuggestionPopper(suggestions: any[], isHtmlStr: boolean) {
        this.suggestionPopper.showSuggestionPopper(suggestions, isHtmlStr)
    }

    hidenSuggestionPopper() {
        this.suggestionPopper.hidenSuggestionPopper()
    }


    showLangSuggestions(lang: string) {
        const _this = this

        function createFilter(queryString: string) {
            return (langInfo: any) => {
                return langInfo.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
            }
        }
        function querySearch(queryString: string) {
            let results: any = queryString
                ? langCanload.filter(createFilter(queryString))
                : langCanload

            results = results.map((langInfo: any) => {
                const iconClass = IconTables.matchLanguage(langInfo.value) as unknown as Icon

                if (!iconClass) {
                    langInfo.html = `<i class="icon icon-file-text medium-blue"></i><span>${langInfo.value}</span>`
                } else {
                    if (Array.isArray(iconClass.colour) && iconClass.colour.length) {
                        langInfo.html = `<i class="icon ${iconClass.icon} ${iconClass.colour[0]}"></i><span>${langInfo.value}</span>`
                    } else {
                        langInfo.html = `<i class="icon ${iconClass.icon}"></i><span>${langInfo.value}</span>`
                    }
                }

                langInfo.eventListener = {
                    click: function (event: MouseEvent) {
                        const element = this as HTMLElement
                        if (element && element.hasAttribute("key")) {
                            const lang = element.textContent
                            const block = _this.editor.ir.focueProcessor.getSelectedBlockMdElement(false)
                            _this.editor.ir.state.likeFencetransform(block, lang)
                        }
                    }
                }
                return langInfo
            })

            return results
        }

        const results = querySearch.call(this, lang)
        this.showSuggestionPopper(results, true)
    }

    hidenLangSuggestions() {
        this.hidenSuggestionPopper()
    }

    showEmojiSuggestions(emojiName: string) {
        
        const _this = this
        let results:any = emojiData
            ? emojiData.filter((data) => data[0].toLowerCase().indexOf(emojiName.toLowerCase()) === 0)
            : emojiData

        results = results.map(([name,content])=>{
            return {
                html:`<span class="emoji-content">${content}</span><span class="emoji-markup">${name}</span>`,
                eventListener:{
                    click:function(event: MouseEvent){
                        const element = this as HTMLElement
                        if (element && element.hasAttribute("key")) {
                            const emojiName = element.querySelector(".emoji-markup").textContent
                            const inline = _this.editor.ir.focueProcessor.getSelectedInlineMdElement(false)
                            _this.editor.ir.state.likeEmojiTransform(inline, emojiName)
                            _this.hidenEmojiSuggestions()
                        }
                    }
                }
            }
        })

        
        this.showSuggestionPopper(results, true)

    }

    hidenEmojiSuggestions(){
        this.hidenSuggestionPopper()
    }
}

export default EditorTool