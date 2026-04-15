<template>
    <div class="users-page">
        <!-- 数据表格卡片 -->
        <div class="table-card">
            <!-- 搜索栏 -->
            <div class="table-toolbar">
                <div class="search-wrapper">
                    <el-row :gutter="15">
                        <el-col :span="6">
                            <el-input v-model="state.name" placeholder="请输入名称" />
                        </el-col>
                        <el-col :span="6">
                            <el-select v-model="state.type" placeholder="请选择类型">
                                <el-option v-for="item in type" :key="item.value" :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="8">

                            <el-button type="primary" @click="search()">
                                搜索
                            </el-button>
                            <el-button @click="reset()">
                                重置
                            </el-button>
                        </el-col>
                    </el-row>

                </div>
                <div class="toolbar-right">
                    <el-button type="primary" @click="dispense">
                        <span>分发</span>
                    </el-button>
                    <el-button type="primary" @click="operateRef?.open('')">
                        <span>添加内容</span>
                    </el-button>
                </div>
            </div>

            <div class="main">
                <!-- Element Plus 表格 -->
                <el-table :data="state.list" v-loading="loading" stripe class="custom-table" row-key="id"
                    @selection-change="handleSelectionChange"
                    :header-cell-style="{ background: '#fafbfc', color: '#64748b', fontWeight: '600' }">
                    <el-table-column type="selection" width="55" fixed="left" />
                    <el-table-column prop="name" label="名称">
                    </el-table-column>
                    <el-table-column prop="type" label="类型">
                        <template #default="{ row }">
                            {{ dealType(row.type) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="icon" label="图标" width="80">
                        <template #default="{ row }">
                            <el-avatar shape="square" :size="50" :src="row.icon" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="cover" label="封面图">
                        <template #default="{ row }">
                            <el-avatar shape="square" :size="50" :src="row.cover" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="url" label="链接" width="200">
                    </el-table-column>
                    <el-table-column prop="feature" label="特点" width="120">
                    </el-table-column>
                    <el-table-column prop="introduce" label="介绍说明">
                    </el-table-column>
                    <el-table-column prop="views" label="观看人数">
                    </el-table-column>
                    <el-table-column prop="click" label="点击数">
                    </el-table-column>
                    <el-table-column prop="download" label="下载数">
                    </el-table-column>
                    <el-table-column prop="display" label="是否显示">
                        <template #default="{ row }">
                            <el-tag :type="row.display ? 'primary' : 'danger'">{{ row.display ? '是' : '否' }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序"></el-table-column>
                    <el-table-column prop="createdTime" label="创建时间" width="180">
                        <template #default="{ row }">
                            {{ dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140" fixed="right">
                        <template #default="{ row }">
                            <div class="action-btns">
                                <el-button @click="handleEdit(row)" type="primary" size="small">
                                    编辑
                                </el-button>
                                <el-popconfirm class="box-item" title="确认删除该内容？" placement="top-start"
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
                <div class="pagination-wrapper">
                    <el-pagination v-model:current-page="state.page" v-model:page-size="state.size"
                        :page-sizes="[10, 20, 50, 100]" :total="state.total"
                        layout="total, sizes, prev, pager, next, jumper" background @size-change="handleSizeChange"
                        @current-change="handlePageChange" />
                </div>
            </div>
        </div>
  
        <OperateDialog ref="operateRef" @change="init" :users="users"/>
        <DispenseDialog ref="dispenseRef" @change="reset" />
    </div>
</template>
<script setup lang="ts">
import { shallowRef, onMounted, ref, reactive } from 'vue'
import { getContentList, deleteContent,getUserList } from "@/api/index";
import { ElMessage, dayjs } from 'element-plus';
import { type } from "@/utils/constant"
import OperateDialog from './components/operate.vue'
import DispenseDialog from './components/dispense.vue';
const users = ref<any[]>([])
const state = reactive({
    name: "",
    type: '',
    page: 1,
    size: 10,
    list: [],
    total: 0,
    actives: [] as any[]
})
const operateRef = shallowRef<InstanceType<typeof OperateDialog>>()
const dispenseRef = shallowRef<InstanceType<typeof DispenseDialog>>()
const loading = ref(true)
onMounted(() => {
    init();
    initUser();
})
const handleSelectionChange = (value: any[]) => {
    state.actives = [];
    value.forEach((item: any) => {
        state.actives.push({
            contentId: item.id,
            sort: item.sort
        });
    })
}
const init = async () => {
    loading.value = true
    getContentList({
        name: state.name,
        type: state.type,
        page: state.page - 1,
        size: state.size,
    }).then((res: any) => {
        state.list = res.content;
        state.total = res.total;
    }).finally(() => {
        setTimeout(() => loading.value = false, 500)
    })
}
const dealType = (value: string) => {
    return type.find(item => item.value === value)?.label || ''
}
const search = () => {
    state.page = 1
    init()
}
const reset = () => {
    state.actives = [];
    state.name = ''
    state.type = ''
    init()
}
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
const dispense = () => {
    if (state.actives.length === 0) {
        return ElMessage.warning('请选择要分发的数据');
    }
    dispenseRef.value?.open(state.actives);
}
const del = (row: any) => {
    deleteContent({
        id: row.id
    }).then(() => {
        ElMessage.success('删除成功')
        init()
    }).catch((error) => {
        ElMessage.error(error.msg)
    })
}
const initUser = () => {
    getUserList({
        page: 0,
        size: 1000
    }).then((res: any) => {
        users.value = res.content;
        console.log(users.value);
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
    gap: 10px;
}



.main {
    padding: 10px;
}
</style>