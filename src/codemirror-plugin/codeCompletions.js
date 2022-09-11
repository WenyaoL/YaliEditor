import {CompletionContext} from "@codemirror/autocomplete"

/**
 * codemirror Completions plugin
 * @param {*} context 
 * @returns 
 */
export function codeCompletions(context) {
    let word = context.matchBefore(/./)
    if (word.from == word.to && !context.explicit)
      return null
    return {
      from: word.from,
      options: [
        {label: "h1", type: "text", apply: "# ", detail: "#"},
        {label: "h2", type: "text", apply: "## ", detail: "##"},
        {label: "h3", type: "text", apply: "### ", detail: "###"},
        {label: "h4", type: "text", apply: "#### ", detail: "####"},
        {label: "h5", type: "text", apply: "##### ", detail: "#####"},
        {label: "u", type: "text", apply: "<u></u>", detail: "<u></u>"},
        {label: "b", type: "text", apply: "****", detail: "****"},
        {label: "`java", type: "text", apply: "```java\n\n```", detail: "java code"},
        {label: "`js", type: "text", apply: "```javascript\n\n```", detail: "javascript code"},
        {label: "`python", type: "text", apply: "```python\n\n```", detail: "python code"},
        {label: "`html", type: "text", apply: "```html\n\n```", detail: "html code"},
      ]
    }
  }