import { createPopper, Instance, OptionsGeneric } from '@popperjs/core';
declare type SetAction<S> = S | ((prev: S) => S);

class BasePopper {
    floatInstance: Instance
    floatElement: HTMLElement

    defaultOptions = {
        placement: 'right',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [10, 20],
                },
            },
        ],
    }

    createPopper(reference, options) {

        if (this.floatInstance) {
            this.destroy()
        }

        const op = Object.assign({}, this.defaultOptions, options)

        this.floatInstance = createPopper(reference, this.floatElement, op)
    }

    public destroy() {
        if (!this.floatInstance) return
        this.floatInstance.destroy()

    }


    public update() {
        if (!this.floatInstance) return
        return this.floatInstance.update()

    }

    public forceUpdate() {
        if (!this.floatInstance) return
        this.floatInstance.forceUpdate()

    }

    public setOptions(setOptionsAction: SetAction<Partial<OptionsGeneric<any>>>) {
        if (!this.floatInstance) return
        this.floatInstance.setOptions(setOptionsAction)
    }
}

export default BasePopper