/**
 * @author liangwenyao
 * 
 */
import { v4 as uuidv4 } from 'uuid';

/**
 * 事件发布器
 */
class ApplicationEventPublisher {

    //监听器映射
    private listenerMap: {
        [eventName: string]: {
            uuid: string,
            listener: any,
            once: boolean
        }[]
    };

    constructor() {
        this.listenerMap = {}
    }

    /**
     * 
     * @param event 
     * @param listenerID 监听器ID
     */
    unsubscribe(event: string, listenerID: string) {
        const listenerList = this.listenerMap[event]
        if (Array.isArray(listenerList) && listenerList.find(l => l.uuid === listenerID)) {
            const index = listenerList.findIndex(l => l.uuid === listenerID)
            listenerList.splice(index, 1)
        }
    }

    /**
     * 订阅事件，订阅一次性事件和订阅永久事件
     * @param event 
     * @param listener 
     * @param once 
     * @return 监听器uuid
     */
    private _subscribe(event: string, listener: any, once = false) {
        const listenerList = this.listenerMap[event]
        const uuid = uuidv4()
        const handler = { uuid, listener, once }
        if (listenerList && Array.isArray(listenerList)) {
            listenerList.push(handler)
        } else {
            this.listenerMap[event] = [handler]
        }
        return uuid
    }

    /**
     * 订阅事件
     * @param event 
     * @param listener 
     */
    subscribe(event: string, listener: any) {
        return this._subscribe(event, listener)
    }

    /**
     * 发布事件
     * @param event 
     * @param data 
     */
    publish(event: string, ...data: any[]) {
        const listenerList = this.listenerMap[event]
        if (listenerList && Array.isArray(listenerList)) {
            listenerList.forEach(({ uuid, listener, once }) => {
                if (once) {
                    this.unsubscribe(event, uuid)
                }
                listener(...data)
            })
        }
    }

    /**
     * 获取事件列表
     */
    getEventList() {
        return Object.keys(this.listenerMap)
    }
}


export default ApplicationEventPublisher;