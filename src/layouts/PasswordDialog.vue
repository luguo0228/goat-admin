<script setup lang="ts">
import { shallowRef, reactive, ref } from 'vue'
import { useRouter } from "vue-router"
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { changePassword } from '@/api'
const visible = shallowRef(false)
const loading = ref(false);
const formRef = shallowRef<FormInstance>()
const userStore = useUserStore()
const router = useRouter()
const form = reactive({
  oldPassword: 'admin123',
  newPassword: 'admin123',
  confirmPassword: 'admin123',
})

const rules = reactive<FormRules>({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

function open() {
  visible.value = true
}

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  loading.value = true
  changePassword({
    original: form.oldPassword,
    password: form.newPassword
  }).then(() => {
    router.push('/login')
    userStore.logout()
    ElMessage.success('密码修改成功，请重新登录');
  }).catch((error) => {

    ElMessage.error(error.msg)
  }).finally(() => {
    loading.value = false;
  })

}

function handleDialogClose() {
  formRef.value?.resetFields()
}

defineExpose({ open })
</script>

<template>
  <el-dialog v-model="visible" title="修改密码" width="400px" @close="handleDialogClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="请输入新密码" show-password />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input v-model="form.confirmPassword" type="password" placeholder="请确认新密码" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>