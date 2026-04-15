<template>
    <div class="users-page">
        <!-- 数据表格卡片 -->
        <div class="table-card">
            <!-- 搜索栏 -->
            <div class="table-toolbar">
                <div class="search-wrapper">
                    <el-row :gutter="15">
                        <el-col :span="6">
                            <el-input v-model="state.account" placeholder="请输入账户" clearable>

                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-select v-model="state.type" placeholder="请选择类型" clearable>
                                <el-option label="管理员" value="manager"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-button type="primary" @click="search">
                                搜索
                            </el-button>
                            <el-button  @click="reset">
                                重置
                            </el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="toolbar-right">

                    <el-button type="primary" @click="operateRef?.open()">
                        <span>添加用户</span>
                    </el-button>
                </div>
            </div>

            <div class="main">
                <!-- Element Plus 表格 -->
                <el-table :data="state.list" v-loading="loading" stripe class="custom-table"
                    :header-cell-style="{ background: '#fafbfc', color: '#64748b', fontWeight: '600' }">

                    <el-table-column prop="account" label="账户">
                    </el-table-column>
                    <el-table-column prop="nickname" label="名称">
                    </el-table-column>

                    <el-table-column prop="type" label="类型">
                        <template #default="{ row }">
                            <el-tag v-if="row.type === 'manager'" type="success">管理员</el-tag>
                            <el-tag v-else>普通用户</el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="200" align="center">
                        <template #default="{ row }">
                            <div class="action-btns">
                                <el-button @click="handleEdit(row)" type="primary" size="small">
                                    编辑
                                </el-button>
                                <el-popconfirm class="box-item" title="确认删除该账户？" placement="top-start"
                                    @confirm="del(row)">
                                    <template #reference>
                                        <el-button type="danger" size="small">
                                            删除
                                        </el-button>
                                    </template>
                                </el-popconfirm>


                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <!-- 分页 -->
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="state.page" v-model:page-size="state.size"
                        :page-sizes="[10, 20, 50, 100]" :total="state.total"
                        layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
                        @current-change="handlePageChange" />
                </div>
            </div>
        </div>

        <OperateDialog ref="operateRef" @change="init" />
    </div>
</template>
<script setup lang="ts">
import { shallowRef, onMounted, ref, reactive } from 'vue'
import { getUserList, deleteUser } from "@/api/index";
import OperateDialog from './components/operate.vue'
import { ElMessage } from 'element-plus';
const state = reactive({
    page: 1,
    size: 10,
    list: [],
    total: 0,
    account: '',
    type: ''
})
const operateRef = shallowRef<InstanceType<typeof OperateDialog>>()
const loading = ref(true)
onMounted(() => {
    init();
})
const init = async () => {
    loading.value = true
    getUserList({
        page: state.page - 1,
        size: state.size,
        account: state.account,
        type: state.type
    }).then((res: any) => {
        state.list = res.content;
        state.total = res.total;
    }).finally(() => {
        setTimeout(() => loading.value = false, 500)
    })
}
const search = () => {
    state.page = 1;
    init()
}
const reset = () => {
    state.account = '';
    state.type = '';
    state.page = 1;
    init()
}
// 分页变化
const handlePageChange = (page: number) => {
    state.page = page
    init()
}

const handleSizeChange = (size: number) => {
    state.size = size
    state.page = 1
    init()
}

const handleEdit = (row: any) => {
    operateRef.value?.open(row)
}
const del = (row: any) => {
    deleteUser({
        id: row.id
    }).then(() => {
        ElMessage.success('删除成功')
        init()
    }).catch((error) => {
        ElMessage.error(error.msg)
    })
}

</script>
<style scoped>
.users-page {

    font-family: 'PingFang SC', 'Hiragino Sans GB', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

    margin: 0 auto;
    /* padding: 2rem; */
    min-height: 100vh;

}

.table-card {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    animation: fadeInUp 0.6s ease-out;
}


.table-toolbar {
    display: flex;

    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #e2e8f0;
}

.search-wrapper {
    flex: 1;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}



.main {
    padding: 10px;
}
</style>