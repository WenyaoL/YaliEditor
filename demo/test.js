var MarkdownIt = require('markdown-it')

const md = new MarkdownIt();




let tokens = md.parse('# 123')
console.log(tokens);

let res = md.renderer.render(tokens)
console.log(res);

const coreR = md.core.ruler
const blockR = md.block.ruler
const inlineR = md.inline.ruler
const inlineR2 = md.inline.ruler2
const renderR = md.renderer.rules

console.log("解析器规则==",coreR);
console.log("解析器规则==",blockR);
console.log("解析器规则==",inlineR);
console.log("解析器规则==",inlineR2);
console.log("渲染器规则==",renderR);








//const hljs = require('highlight.js');
//const res = hljs.highlight('\n        outputStreamWriter.write("123456789");\n   outputStreamWriter.flush();\noutputStreamWriter.close();', {language: 'java'}).value
//console.log(res);
//console.log(res.split(/\n/))


/*require("./lute.min.js")
const lute = Lute.New()
console.log(lute);


const res = lute.SpinVditorIRDOM('# 123\n```java\n123\n```')

console.log(res);*/

