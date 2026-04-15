<template>
    <el-dialog v-model="visible" title="排序" width="550px" :close-on-click-modal="false" @close="handleDialogClose"
        class="user-dialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">

            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序号" type="number" clearable />
            </el-form-item>



        </el-form>
        <template #footer>
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" :loading="loading" @click="handleSubmit">
                确定
            </el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { shallowRef, reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import {  sortColumnContent } from "@/api"

const visible = shallowRef(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const editId = ref<number | undefined>()
const emit = defineEmits(['change'])
const form = reactive({
    sort: 1,
})
const rules = reactive<any>({

    sort: [
        { required: true, message: '请输入排序号', trigger: 'blur' },
    ],
})
function open(data: any) {
    visible.value = true
    editId.value = data.listId
    form.sort = data.sort;
}

 async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return
    loading.value = true
    sortColumnContent({ ...form, id: editId.value, }).then(() => {
        ElMessage.success('更新成功')
        emit('change')
    }).catch((error: { msg?: string }) => {
        ElMessage.error(error.msg || '更新失败');

    }).finally(() => {
        visible.value = false
        loading.value = false
    })
}

function handleDialogClose() {
    formRef.value?.resetFields()
    editId.value = undefined
}

defineExpose({ open })
</script>
