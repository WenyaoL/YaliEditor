// @ts-nocheck
/**
 * @author liangwenyao
 * @github https://github.com/WenyaoL/YaliEditor
 */
import YaLiEditor from '@/YaliEditor/src';
import TurndownService from 'turndown';
import tableRule from './table'
import beautify from 'js-beautify'

class TurndownParser {
  turndownService: TurndownService;
  editor: YaLiEditor;

  constructor(editor: YaLiEditor) {
    this.editor = editor
    //移除默认逃逸规则，不进行规则逃逸
    TurndownService.prototype.escape = str => str
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      borderModel: true
    })
    this.initCodeRule()
    this.initImgRule()
    this.initMathjaxRule()
    this.initTocRule()
    this.initCodemirrorRule(this.editor)
    this.initLinkRule()
    this.initFontRule()
    this.initListRule()
    this.initParagraphRule()
    this.initHrRule()
    this.initBlockMetaRule()
    this.initHtmlBlockRule(this.editor)
    this.turndownService.use(tableRule)

  }

  /**
   * 初始化高亮代码解析规则
   */
  initCodeRule() {
    this.turndownService.addRule('md-codeing', {
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'PRE' &&
          node.classList.contains("hljs")
        )
        return flag
      },
      replacement: function (content, node, options) {
        const language = (node.lastElementChild.className.match(/language-(\S+)/) || [null, ''])[1]
        return (
          '\n```' + language + '\n' +
          node.lastElementChild.textContent.replace(/\n/g, '\n') +
          '```\n\n'
        )
      }
    })
  }

  initCodemirrorRule(editor: YaLiEditor) {
    this.turndownService.addRule('md-codemirror', {
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'PRE' &&
          node.classList.contains("markdown-it-code-beautiful")
        )
        return flag
      },
      replacement: function (content, node, options) {
        let language: string;
        node = node as HTMLElement
        const uuid = node.id
        const text = editor.ir.renderer.codemirrorManager.getTextValue(uuid)
        if (!text) return ''
        const input = node.lastElementChild.getElementsByTagName("input").item(0)
        if (input) language = input.value.trim()
        else language = node.getAttribute("lang")

        if (text.endsWith("\n")) {
          return '\n```' + language + '\n' + text + '```\n\n'
        } else {
          return '\n```' + language + '\n' + text + '\n```\n\n'
        }

      }
    })
  }

  initImgRule() {
    this.turndownService.addRule('md-img', {
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'SPAN' &&
          node.getAttribute("md-inline") === "img"
        )
        return flag;
      },
      replacement: (content, node, options) => {

        node.firstElementChild.textContent
        return node.firstElementChild.textContent
      }
    })
  }

  initTocRule() {
    this.turndownService.addRule('md-toc', {
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'DIV' &&
          node.classList.contains('markdown-it-toc-beautiful')
        )
        return flag;
      },
      replacement: function (content, node, options) {
        return '[toc]';
      }
    })
  }

  initMathjaxRule() {
    this.turndownService.addRule('md-mathjax', {
      filter: function (node, options) {
        return (node.classList.contains("markdown-it-mathjax-beautiful") &&
          node.nodeName === "DIV")
      },
      replacement: function (content, node, options) {
        if (node.children.length > 1) {
          let e = node as HTMLElement
          const value = e.getElementsByClassName("md-mathblock-input").item(0).textContent
          return '\n$$\n' +
            value +
            '\n$$\n'
        }

        return '';
      }
    })
  }

  initLinkRule() {
    this.turndownService.addRule('md-link', {
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'SPAN' &&
          node.getAttribute("md-inline") === "link"
        )
        return flag;
      },
      replacement: (content, node, options) => {
        node = node as HTMLElement
        return node.textContent
      }
    })
  }

  initFontRule() {
    //删除线
    this.turndownService.addRule('md-font-del', {
      filter: ['del', 's', 'strike'],
      replacement: (content, node, options) => {
        if (options.borderModel) return content
        else return '~~' + content + '~~'
      }
    })

    //下划线
    this.turndownService.addRule('md-font-underline', {
      filter: 'u',
      replacement: (content, node, options) => {
        if (options.borderModel) return content
        return '<u>' + content + '</u>'
      }
    })

    //粗体字
    this.turndownService.addRule('md-font-strong', {
      filter: 'strong',
      replacement: (content, node, options) => {
        if (options.borderModel) return content
        return options.strongDelimiter + content + options.strongDelimiter
      }
    })

    //斜体
    this.turndownService.addRule('md-font-strong', {
      filter: 'em',
      replacement: (content, node, options) => {
        if (options.borderModel) return content
        return options.emDelimiter + content + options.emDelimiter
      }
    })

    //行内代码字体
    this.turndownService.addRule('md-inline-codeing', {
      filter: function (node, options) {
        let flag = (
          node.nodeName === 'CODE' &&
          node.getAttribute('md-inline') === "code"
        )
        return flag
      },
      replacement: function (content, node, options) {
        if (options.borderModel) return content
        return '`' + content + '`';
      }
    })

  }

  initParagraphRule() {
    this.turndownService.addRule('md-paragraph', {
      filter: 'p',
      replacement: function (content, node) {
        //content = content.replaceAll("\u00a0","&nbsp;")
        if ((node as HTMLElement).hasAttribute("tight")) return '\n' + content
        return '\n\n' + content + '\n\n'
      }
    })
  }

  initListRule() {
    this.turndownService.addRule('md-list', {
      filter: ['ul', 'ol'],
      replacement: function (content, node) {
        var parent = node.parentNode
        if (parent.nodeName === 'LI' && parent.lastElementChild === node) {
          return '\n' + content
        } else {
          return '\n\n' + content + '\n\n'
        }
      }
    })

    this.turndownService.addRule('md-list-item', {
      filter: 'li',
      replacement: function (content, node, options) {
        content = content
          .replace(/^\n+/, '') // remove leading newlines
          .replace(/\n+$/, '\n') // replace trailing newlines with just a single one
          .replace(/\n/gm, '\n    ') // indent
        var prefix = options.bulletListMarker + '   '
        var parent = node.parentNode
        if (parent.nodeName === 'OL') {
          var start = parent.getAttribute('start')
          var index = Array.prototype.indexOf.call(parent.children, node)
          prefix = (start ? Number(start) + index : index + 1) + '.  '
        }
        if (parent.nodeName === 'UL') {
          const markup = (parent as HTMLElement).getAttribute("markup")
          prefix = markup + ' '
        }

        return (
          prefix + content + (node.nextSibling && !/\n$/.test(content) ? '\n' : '')
        )
      }
    })
  }

  initHrRule() {
    this.turndownService.addRule('md-hr', {
      filter: 'hr',
      replacement: function (content, node, options) {
        const markup = (node as HTMLElement).getAttribute("markup")
        if (markup) return '\n\n' + markup + '\n\n'
        return '\n\n' + options.hr + '\n\n'
      }
    })

  }

  initBlockMetaRule() {
    this.turndownService.addRule('md-block-meta', {
      filter: function (node, options) {
        return (
          node.nodeName === 'PRE' && (node as HTMLElement).getAttribute("md-block") == "meta"
        )
      },
      replacement: function (content, node, options) {
        if (content.endsWith("\n")) return '---\n' + content + '---\n\n'
        return '---\n' + content + '\n---\n\n'
      }
    })

  }

  initHtmlBlockRule(editor: YaLiEditor) {
    this.turndownService.addRule('md-block-html', {
      filter: function (node, options) {
        return (
          node.nodeName === 'DIV' && (node as HTMLElement).getAttribute("md-block") == "html"
        )
      },
      replacement: function (content, node, options) {
        let id = node.querySelector(".markdown-it-code-beautiful").id
        const text = editor.ir.renderer.codemirrorManager.getTextValue(id)
        if (!text) return ''
        return `\n${text}\n`
      }
    })
  }

  turndown(src: string | TurndownService.Node) {
    return this.turndownService.turndown(src)
  }

}


function cleanAttribute(attribute: string) {
  return attribute ? attribute.replace(/(\n+\s*)+/g, '\n') : ''
}


export default TurndownParser;