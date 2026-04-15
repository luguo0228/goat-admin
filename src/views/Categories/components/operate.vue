<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="550px" :close-on-click-modal="false"
        @close="handleDialogClose" class="user-dialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">
            <el-form-item label="栏目名称（中文）" prop="nameZH">
                <el-input v-model="form.nameZH" placeholder="请输入栏目名称" clearable />
            </el-form-item>
            <el-form-item label="栏目名称（英文）" prop="nameZH">
                <el-input v-model="form.nameEN" placeholder="请输入栏目名称" clearable />
            </el-form-item>
            <el-form-item label="频道" prop="channelId">
                <el-select v-model="form.channelId" placeholder="请选择频道">
                    <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>

                </el-select>
            </el-form-item>
            <el-form-item label="栏目图标标识" prop="icon">
                <el-input v-model="form.icon" placeholder="请输入栏目图标标识" clearable />
            </el-form-item>
            <el-form-item label="是否显示" prop="display">
                <el-radio-group v-model="form.display">
                    <el-radio :value="true">显示</el-radio>
                    <el-radio :value="false">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序号" type="number" clearable />
            </el-form-item>
            <el-form-item label="数据布局方式" prop="layout">
                <el-input v-model="form.layout" placeholder="请输入数据布局方式" clearable />
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
import { shallowRef, reactive, ref, computed, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { addColumn, editColumn, getChannelList } from "@/api"
const visible = shallowRef(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const isEdit = ref(false)
const editId = ref<number | undefined>()
const emit = defineEmits(['change'])
const form = reactive({
    nameZH: '',
    nameEN: '',
    icon: '',
    layout: '',
    channelId: "",
    display: true,
    sort: 1,
})
const list = ref<any[]>([])
const dialogTitle = computed(() => isEdit.value ? '编辑频道' : '新增频道')
const rules = reactive<any>({
    nameZH: [
        { required: true, message: '请输入栏目名称', trigger: 'blur' },
    ],
    nameEN: [
        { required: true, message: '请输入栏目名称', trigger: 'blur' },
    ],
    icon: [
        { required: true, message: '请输入栏目图标标识', trigger: 'blur' },
    ],
    layout: [
        { required: true, message: '请输入数据布局方式', trigger: 'blur' },
    ],
    channelId: [
        { required: true, message: '请选择频道', trigger: 'blur' },
    ],
    sort: [
        { required: true, message: '请输入排序号', trigger: 'blur' },
    ],
})
watch(() => visible.value, (val) => {
    if (val) {
        init();
    }

})
function init() {
    getChannelList({
        page: 0,
        size: 1000
    }).then((res: any) => {
        list.value = res.content;
    })
}
function open(data: any) {
    visible.value = true
    if (data && data.id) {
        isEdit.value = true
        editId.value = data.id
        form.nameZH = data.nameZH;
        form.nameEN = data.nameEN;
        form.icon = data.icon;
        form.layout = data.layout;
        form.channelId = data.channelId;
        form.display = data.display;
        form.sort = data.sort || 1;
    } else {
        isEdit.value = false
        editId.value = undefined

        resetForm()
    }
}

function resetForm() {
    form.nameZH = '';
    form.nameEN = '';
    form.icon = '';
    form.layout = '';
    form.channelId = "";
    form.display = true;
    form.sort = 1
}

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    if (isEdit.value && editId.value) {
        // TODO: 使用 updateUser API 更新用户
        editColumn({ ...form, id: editId.value, }).then(() => {
            ElMessage.success('更新成功')
            emit('change')
        }).catch((error: { msg?: string }) => {
            ElMessage.error(error.msg || '更新失败');

        }).finally(() => {
            visible.value = false
            loading.value = false
        })
    } else {
        addColumn(form).then(() => {
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
