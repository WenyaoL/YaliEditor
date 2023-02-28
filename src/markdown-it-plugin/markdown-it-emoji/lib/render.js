'use strict';

const { getUniqueKey } = require("@/markdown-it-plugin/markdown-it-key-generator");

module.exports = function emoji_html(tokens, idx /*, options, env */) {
  const token = tokens[idx]
  if(token.markup){
    if(token.markup == "empty"){
      return /*html*/`<span class="emoji" md-inline="emoji" md-like="emoji"><span class="emoji-content">${token.content}</span><span class="emoji-markup">::</span></span>`
    }
    return /*html*/`<span class="emoji" md-inline="emoji"><span class="emoji-content">${token.content}</span><span class="emoji-markup">:${token.markup}:</span></span>`
  }

  return tokens[idx].content;
};
