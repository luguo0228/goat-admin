<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="450px" :close-on-click-modal="false"
        @close="handleDialogClose" class="user-dialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="频道名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称" maxlength="20" clearable />
            </el-form-item>
            <el-form-item label="是否显示" prop="display">
                <el-radio-group v-model="form.display">
                    <el-radio :value="true">显示</el-radio>
                    <el-radio :value="false">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序号" type="number" maxlength="20" clearable />
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
import { shallowRef, reactive, ref, computed } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { addChannel, editChannel } from "@/api"


const visible = shallowRef(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const isEdit = ref(false)
const editId = ref<number | undefined>()
const emit = defineEmits(['change'])
const form = reactive({
    name: '',
    display: true,
    sort: 1,
})


const dialogTitle = computed(() => isEdit.value ? '编辑频道' : '新增频道')

const rules = reactive<any>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ],
    sort: [
        { required: true, message: '请输入排序号', trigger: 'blur' },
    ],
})

function open(user: any) {
    visible.value = true
    if (user && user.id) {
        isEdit.value = true
        editId.value = user.id
        form.name = user.name || '';
        form.display = user.display
        form.sort = user.sort || 1


    } else {
        isEdit.value = false
        editId.value = undefined
        resetForm()
    }
}

function resetForm() {
    form.name = ''
    form.display = true
    form.sort = 1
}

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    if (isEdit.value && editId.value) {
        // TODO: 使用 updateUser API 更新用户
        editChannel({ ...form, id: editId.value, }).then(() => {
            ElMessage.success('更新成功')
            emit('change')
        }).catch((error: { msg?: string }) => {
            ElMessage.error(error.msg || '更新失败');

        }).finally(() => {
            visible.value = false
            loading.value = false
        })
    } else {
        addChannel(form).then(() => {
            ElMessage.success('添加成功')
            emit('change')
        }).catch((error: { msg?: string }) => {
            ElMessage.error(error.msg || '添加失败')
        }).finally(() => {
            visible.value = false
            loading.value = false
        })
    }
}

function handleDialogClose() {
    formRef.value?.resetFields()
    isEdit.value = false
    editId.value = undefined
}

defineExpose({ open })
</script>
