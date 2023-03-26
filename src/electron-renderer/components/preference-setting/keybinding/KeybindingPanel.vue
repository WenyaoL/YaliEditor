<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { getAcceleratorFromKeyboardEvent, isValidElectronAccelerator,isCompositionEvent } from './electron-localshortcut/index.js'

const store = useStore()
const tableData = ref([])
const showKeyInputDialog = ref(false)
const isKeybindingValid = ref(true)
const keybindingInputValue = ref('')
const placeholderText = ref('Press a key combination')
//current edit row
let currRow = null

store.dispatch('getShortKeyMap').then(keyMap => {
    const data = []
    for (const [k, v] of keyMap) {
        data.push({
            description: k,
            key: v
        })
    }
    tableData.value = data
})

const handleEdit = (index: number, row: any) => {
    currRow = row
    keybindingInputValue.value = row.key
    isKeybindingValid.value = true
    showKeyInputDialog.value = true
}

const handleDelete = (index: number, row: any) => {
    row.key = ''
}


const saveSetting = async () => {
    const data = []
    tableData.value.forEach(({ description, key }) => {
        data.push([description, key])
    })
    store.dispatch('setShortKeyMap', new Map(data))
}

onUnmounted(async () => {
    saveSetting()
})


const handleDialogClose = () => {
    isKeybindingValid.value = true
    keybindingInputValue.value = ''
    showKeyInputDialog.value = false
}

const isRawKeyCode = (event, keyCode) => {
    const { code, ctrlKey, altKey, shiftKey, metaKey } = event
    return event && code === keyCode && !ctrlKey && !altKey && !shiftKey && !metaKey
}



const saveKeybinding = () => {
    if (!keybindingInputValue.value || !isKeybindingValid.value) {
        handleDialogClose()
        return
    }
    currRow.key = keybindingInputValue.value
    handleDialogClose()
}


const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    if (isCompositionEvent(event)) {
        // FIXME: You can still write in the textbox while composition.
        return
    } else if (isRawKeyCode(event, 'Escape')) {
        handleDialogClose()
        return
    } else if (isRawKeyCode(event, 'Enter')) {
        saveKeybinding()
        return
    }
    const keybinding = getAcceleratorFromKeyboardEvent(event)
    // Verify whether the given key binding is valid for Electron.
    isKeybindingValid.value = keybinding.isValid && isValidElectronAccelerator(keybinding.accelerator)
    keybindingInputValue.value = keybinding.accelerator
}

const handleKeyUp = (event) => {
    event.preventDefault()
    event.stopPropagation()
}




</script>

<template>
    <div>
        <h3 class="key-heading">{{ $t('KeybindingPanel.key_heading') }}</h3>
        <p v-html="$t('KeybindingPanel.key_info')"></p>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="description" label="Description" width="250" />
            <el-table-column prop="key" label="Key" width="240" />
            <el-table-column label="Options">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="showKeyInputDialog" :show-close="false" @close="handleDialogClose" custom-class="ag-dialog-table"
            width="500px">
            <div slot="title" class="key-input-wrapper">
                <div class="input-wrapper">
                    <input spellcheck="false" tabindex="0" type="text" ref="intputTextbox" v-model="keybindingInputValue" class="input-textbox"
                        @keydown="handleKeyDown" @keyup="handleKeyUp" :placeholder="placeholderText">
                </div>
                <div class="footer">
                    <div class="descriptions">Press Enter to continue or ESC to exit.</div>
                    <div v-show="!isKeybindingValid" class="invalid-keybinding">
                        Current key is Valid!!!
                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<style scoped>
.key-heading {
    color: gray;
}

p {
    font-size: 11px;
}



.footer {
    text-align: center;
}

.invalid-keybinding {
    font-weight: bold;
}

.key-input-wrapper {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: auto;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px;
    margin: 0 auto;
    margin-top: 8px;
    box-sizing: border-box;
    border-radius: 4px;
    z-index: 10000;
}

.input-wrapper {
    display: block;
    width: 100%;
    border: 1px solid rgb(205, 205, 205);
    background: rgb(240, 240, 240);
    border-radius: 3px;
}

input.input-textbox {
    width: 95%;
    display: block;
    height: 30px;
    color: rgb(36, 36, 36);
    margin: 0 auto;
    font-size: 14px;
    background: transparent;
    outline: none;
    border: none;
}
</style>