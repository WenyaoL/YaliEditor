import {createApp} from 'vue/dist/vue.esm-bundler.js'
import InputComponent from './InputComponent.vue'


export let component = InputComponent

export function mount(root:string | Element,rootProps?:Object){
  createApp(component,rootProps).mount(root)
}

export function createComponent(rootProps?:Object){
  return createApp(component,rootProps)
}