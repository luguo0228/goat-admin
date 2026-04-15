<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="450px" :close-on-click-modal="false"
        @close="handleDialogClose" class="user-dialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="账号" prop="account">
                <el-input v-model="form.account" placeholder="请输入账号" maxlength="20" clearable :disabled="isEdit" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入密码" maxlength="20" show-password
                    clearable />
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname" placeholder="请输入昵称" maxlength="20" clearable />
            </el-form-item>
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型">
                    <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
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
import { addUser, editUser } from "@/api"

interface EditUser {
    id?: number
    account?: string
    nickname?: string
    type?: string
}

const visible = shallowRef(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const isEdit = ref(false)
const editId = ref<number | undefined>()
const emit = defineEmits(['change'])
const form = reactive({
    account: '',
    password: '',
    nickname: '',
    type: 'manager',
})

const typeOptions = [
    { label: '管理员', value: 'manager' },
    { label: '供应商', value: 'supplier' },
]

const dialogTitle = computed(() => isEdit.value ? '编辑账户' : '新增账户')

const rules = reactive<any>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 3, max: 20, message: '账号长度为3-20个字符', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
    ],
    nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 2, max: 20, message: '昵称长度为2-20个字符', trigger: 'blur' },
    ],
})

function open(user?: EditUser) {
    visible.value = true
    if (user && user.id) {
        isEdit.value = true
        editId.value = user.id
        form.account = user.account || ''
        form.password = ''
        form.nickname = user.nickname || ''
        form.type = user.type || 'manager';
        (rules.password[0] as any).required = false
    } else {
        isEdit.value = false
        editId.value = undefined
        resetForm()
    }
}

function resetForm() {
    form.account = ''
    form.password = ''
    form.nickname = ''
    form.type = 'manager'
}

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    if (isEdit.value && editId.value) {
        // TODO: 使用 updateUser API 更新用户
        editUser({ ...form, id: editId.value, }).then(() => {
            ElMessage.success('更新成功')
            emit('change')
        }).catch((error: { msg?: string }) => {
            ElMessage.error(error.msg || '更新失败');

        }).finally(() => {
            visible.value = false
            loading.value = false
        })
    } else {
        addUser(form).then(() => {
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