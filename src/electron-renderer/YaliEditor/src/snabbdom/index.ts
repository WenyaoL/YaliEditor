import {
    init,
    classModule,
    styleModule,
    propsModule,
    attributesModule,
    eventListenersModule,
    toVNode as tovnode,
    h as H,
} from 'snabbdom'

export const patch = init([
    classModule,
    styleModule,
    propsModule,
    attributesModule,
    eventListenersModule,
]);
export const toVNode = tovnode
export const h = H
