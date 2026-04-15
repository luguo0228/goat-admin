<template>
    <el-dialog v-model="visible" :title="dialogTitle" width="700px" :close-on-click-modal="false"
        @close="handleDialogClose" class="user-dialog">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型">
                    <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- 姓名/名称（type=live，friend时，该属性生效） -->
            <el-form-item label="名称" prop="name" v-if="['live', 'friend'].includes(form.type)">
                <el-input v-model="form.name" placeholder="请输入名称" clearable />
            </el-form-item>
            <el-form-item label="图标" prop="icon">
                <el-input v-model="form.icon" placeholder="请输入图标" clearable />
                <!-- <el-upload class="avatar-uploader"  :show-file-list="false" :auto-upload="false"
                   :on-change="(e:any)=>handleFileChange(e,'icon')" >
                    <img v-if="form.icon" :src="form.icon" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload> -->
            </el-form-item>
            <el-form-item label="封面图" prop="cover">
                <el-input v-model="form.cover" placeholder="请输入封面图" clearable />
                <!-- <el-upload class="avatar-uploader" action="#" :show-file-list="false"
                    :before-upload="(e: any) => beforeAvatarUpload(e, 'cover')">
                    <img v-if="form.icon" :src="form.cover" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload> -->
            </el-form-item>
            <el-form-item label="链接" prop="url">
                <el-input v-model="form.url" placeholder="请输入链接" clearable />
            </el-form-item>
            <!-- 特点type=friend时，该属性生效） -->
            <el-form-item label="特点" prop="feature" v-if="['friend'].includes(form.type)">
                <el-input v-model="form.feature" placeholder="请输入名称" clearable />
            </el-form-item>
            <!-- 职业画像（type=friend时，该属性生效） -->
            <el-form-item label="职业画像" prop="profile" v-if="['friend'].includes(form.type)">
                <el-input v-model="form.profile" placeholder="请输入职业画像" clearable />
                <!-- <el-upload class="avatar-uploader" action="#" :show-file-list="false"
                    :before-upload="(e: any) => beforeAvatarUpload(e, 'profile')">
                    <img v-if="form.icon" :src="form.profile" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload> -->
            </el-form-item>
            <!-- 介绍说明（type=live，friend时，该属性生效） -->
            <el-form-item label="介绍说明" prop="introduce" v-if="['live', 'friend'].includes(form.type)">
                <el-input v-model="form.introduce" placeholder="请输入介绍说明" type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4 }" clearable />
            </el-form-item>
            <!-- 预览（图片/视频）（type=live，friend时，该属性生效） -->
            <el-form-item label="预览" prop="preview" v-if="['live', 'friend'].includes(form.type)">
                <el-input v-model="form.preview" placeholder="请输入预览" clearable />
                <!-- <el-upload class="avatar-uploader" v-model:file-list="form.preview" action="#">
                    <el-icon class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload> -->
            </el-form-item>
            <!-- 观看人数（type=live时，该属性生效） -->
            <el-form-item label="观看人数" prop="views" v-if="['live'].includes(form.type)">
                <el-input v-model="form.views" placeholder="请输入观看人数" type="number" clearable />
            </el-form-item>
            <el-form-item label="图标" prop="display">
                <el-radio-group v-model="form.display">
                    <el-radio :value="true">显示</el-radio>
                    <el-radio :value="false">隐藏</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" placeholder="请输入排序号" type="number" clearable />
            </el-form-item>
            <el-form-item label="授权" prop="authorized">

                <el-select v-model="form.authorized" placeholder="请选择授权" multiple>
                    <el-option v-for="item in users" :key="item.id" :label="item.nickname" :value="item.id">
                    </el-option>
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
import { addContent, editContent } from "@/api"
import { type } from "@/utils/constant"

// 定义用户类型接口
interface User {
    id: number | string;
    nickname: string;
}

const props = defineProps({
    users: {
        type: Array as () => User[],
        default: () => []
    }
})
const visible = shallowRef(false)
const loading = ref(false)
const formRef = shallowRef<FormInstance>()
const isEdit = ref(false)
const editId = ref<number | undefined>()
const emit = defineEmits(['change'])

const form = reactive({
    type: '',
    icon: "",
    cover: "",
    url: "",
    name: "",
    feature: "",
    profile: "",
    introduce: "",
    preview: [],
    views: "",
    display: true,
    sort: 1,
    authorized: []
})
const dialogTitle = computed(() => isEdit.value ? '编辑内容' : '新增内容')

const rules = reactive<any>({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ],
    icon: [
        { required: true, message: '请输入图标', trigger: 'blur' },
    ],
    cover: [
        { required: true, message: '请输入封面图', trigger: 'blur' },
    ],
    url: [
        { required: true, message: '请输入链接', trigger: 'blur' },
    ],
    type: [
        { required: true, message: '请选择类型', trigger: 'blur' },
    ],
    sort: [
        { required: true, message: '请输入排序号', trigger: 'blur' },
    ],
    authorized: [
        { required: true, message: '请选择授权', trigger: 'blur' },
    ]
})

function open(data: any) {
    visible.value = true
    if (data && data.id) {
        isEdit.value = true
        editId.value = data.id

        form.type = data?.type;
        form.icon = data?.icon;
        form.cover = data?.cover;
        form.url = data?.url||'';
        form.name = data?.name||'';
        form.feature = data.feature||'';
        form.profile = data?.profile || '';
        form.introduce = data?.introduce;
        form.preview = data?.preview != ''&&data?.preview ? data.preview.split(",") : [];
        form.views = data?.views||'';
        form.display = data?.display;
        form.sort = data?.sort;
        form.authorized = data.authorized != ''&&data.authorized ? data.authorized.split(",") : [];
   

    } else {
        isEdit.value = false
        editId.value = undefined
        resetForm()
    }
}

function resetForm() {
    formRef.value?.clearValidate();
    formRef.value?.resetFields();
    form.display = true
    form.sort = 1
}

async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return

    loading.value = true

    if (isEdit.value && editId.value) {
        // TODO: 使用 updateUser API 更新用户
        editContent({

            id: editId.value,
            authorized: form.authorized.join(','),
            preview: form.preview.join(','),
            type: form.type,
            icon: form.icon,
            cover: form.cover,
            url: form.url,
            name: form.name,
            feature: form.feature,
            profile: form.profile,
            introduce: form.introduce,
            views: form.views,
            display: form.display,
            sort: form.sort,
        }).then(() => {
            ElMessage.success('更新成功')
            emit('change')
        }).catch((error: { msg?: string }) => {
            ElMessage.error(error.msg || '更新失败');

        }).finally(() => {
            visible.value = false
            loading.value = false
        })
    } else {
        addContent({ ...form, authorized: form.authorized.join(','), preview: form.preview.join(',') }).then(() => {
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
// const handleFileChange = (data: any, key: string) => {
//     console.log(key)
// }
defineExpose({ open })
</script>

<style>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}
</style>