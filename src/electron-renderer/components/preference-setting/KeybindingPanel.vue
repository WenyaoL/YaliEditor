<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import bus from '../../bus'
const store = useStore()
const tableData = ref([])
const dialogFormVisible = ref(false)
const form = ref({ key: '' })
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
    form.value.key = row.key
    currRow = row
    dialogFormVisible.value = true

}

const handleDelete = (index: number, row: any) => {
    row.key = ''
}

const handleChangeKey = () => {
    currRow.key = form.value.key
    dialogFormVisible.value = false
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

bus.on('preference::saveSetting',async () => {
    await saveSetting()
})

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

        <el-dialog v-model="dialogFormVisible" title="Shipping address">
            <el-form :model="form">
                <el-form-item label="KeyBinding" :label-width="200">
                    <el-input v-model="form.key" autocomplete="off" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="handleChangeKey">
                        Confirm
                    </el-button>
                </span>
            </template>
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
</style>