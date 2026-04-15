<template>
    <el-dialog v-model="visible" title="排序" width="550px" :close-on-click-modal="false" @close="handleDialogClose"
        class="user-dialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="140px">

            <el-form-item label="频道" prop="channelId">
                <el-select v-model="form.channelId" placeholder="请选择频道" style="width: 100%">
                    <el-option v-for="item in channel" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <div v-show="form.channelId != ''">
                <el-form-item label="栏目" prop="columnId">
                    <el-select v-model="form.columnId" placeholder="请选择栏目" style="width: 100%">
                        <el-option v-for="item in column" :key="item.id" :label="item.nameZH" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </div>


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
import { shallowRef, reactive, ref, watch } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { distributeContent, getChannelList, getColumnList } from "@/api"
const visible = shallowRef(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const editId = ref<number | undefined>()
const emit = defineEmits(['change'])
const channel = ref<any[]>([])
const column = ref<any[]>([])
let actives: any[] = [];
const form = reactive({
    channelId: '',
    columnId: ''
})
const rules = reactive<any>({
    channelId: [
        { required: true, message: '请选择频道', trigger: 'blur' },
    ],
    columnId: [
        { required: true, message: '请选择栏目', trigger: 'blur' },
    ],
})

watch(() => visible.value, (val) => {
    if (val) {
        formRef.value?.resetFields()
        initChannel();
    }
})
watch(() => form.channelId, (val) => {
    if (val) {
        initColumn();
    }
})
const initChannel = () => {
    getChannelList({
        page: 0,
        size: 1000,
    }).then((res: any) => {
        channel.value = res.content;
    })
}
const initColumn = () => {
    getColumnList({
        page: 0,
        size: 1000,
        channel_id: form.channelId
    }).then((res: any) => {
        column.value = res.content;
    })
}
function open(data: any) {
    form.channelId = '';
    form.columnId = '';
    visible.value = true
    actives = data as any[];

}

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return
    loading.value = true
    distributeContent({ contentId: form.columnId, columns: JSON.stringify(actives) }).then(() => {
        ElMessage.success('分发成功')
        emit('change')
    }).catch((error: { msg?: string }) => {
        ElMessage.error(error.msg || '分发失败');

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
