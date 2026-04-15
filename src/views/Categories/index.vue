<template>
    <div class="users-page">
        <!-- 数据表格卡片 -->
        <div class="table-card">
            <!-- 搜索栏 -->
            <div class="table-toolbar">
                <div class="search-wrapper">
                    <el-row :gutter="15">
                        <el-col :span="6">
                            <el-select v-model="state.channelId" placeholder="请选择频道">
                                <el-option v-for="item in state.channelList" :key="item.id" :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
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

                    <el-button type="primary" @click="open()">
                        <span>添加栏目</span>
                    </el-button>
                </div>
            </div>

            <div class="main">
                <!-- Element Plus 表格 -->
                <el-table :data="state.list" v-loading="loading" stripe class="custom-table"
                    :header-cell-style="{ background: '#fafbfc', color: '#64748b', fontWeight: '600' }">

                    <el-table-column prop="nameZH" label="栏目名称（中文）">
                    </el-table-column>
                    <el-table-column prop="nameEN" label="栏目名称（英文）">
                    </el-table-column>

                    <el-table-column prop="channelId" label="频道" width="80">
                        <template #default="{ row }">
                            {{ dealChannel(row.channelId) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="nameEN" label="栏目名称（英文）">
                    </el-table-column>
                    <el-table-column prop="display" label="是否显示" width="100">
                        <template #default="{ row }">
                            <el-tag :type="row.display ? 'primary' : 'danger'">{{ row.display ? '是' : '否' }}</el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" width="60"></el-table-column>
                    <el-table-column prop="lastModifiedTime" label="修改时间" width="180">
                        <template #default="{ row }">
                            {{ dayjs(row.lastModifiedTime).format('YYYY-MM-DD HH:mm:ss') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="layout" label="数据布局方式" width="180">
                    </el-table-column>
                    <el-table-column label="操作" width="240" fixed="right">
                        <template #default="{ row }">
                            <div class="action-btns">
                                <el-button @click="handleEdit(row)" type="primary" size="small">
                                    编辑
                                </el-button>
                                <el-popconfirm class="box-item" title="确认删除该栏目？" placement="top-start"
                                    @confirm="del(row)">
                                    <template #reference>
                                        <el-button type="danger" size="small">
                                            删除
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                                <el-button @click="distribution(row)" type="primary" size="small">
                                    分发
                                </el-button>


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
import { useRouter } from "vue-router"
import { getColumnList, deleteColumn, getChannelList } from "@/api/index";
import OperateDialog from './components/operate.vue'
import { ElMessage, dayjs } from 'element-plus';

// 定义频道数据类型
interface Channel {
    id: string | number;
    name: string;
    [key: string]: any;
}
const router = useRouter();
const state = reactive({
    page: 1,
    size: 10,
    list: [],
    total: 0,
    channelList: [] as Channel[],
    channelId: "" as string | number
})
const operateRef = shallowRef<InstanceType<typeof OperateDialog>>()
const loading = ref(true)
onMounted(() => {
    getChannel();

})
const getChannel = () => {
    getChannelList({
        page: 0,
        size: 1000,

    }).then((res: any) => {
        state.channelList = res.content;
        state.channelId = res.content[0].id;
        init();
    })
}
const dealChannel = (channelId: string | number) => {
    const channel = state.channelList.find((item: Channel) => item.id === channelId)
    return channel ? channel.name : ''
}
const init = async () => {
    loading.value = true
    getColumnList({
        page: state.page - 1,
        size: state.size,
        channel_id: state.channelId

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
    state.page = 1;
    state.channelId = '';
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
const open = () => {
    operateRef.value?.open('')
}
const del = (row: any) => {
    deleteColumn({
        id: row.id
    }).then(() => {
        ElMessage.success('删除成功')
        init()
    }).catch((error) => {
        ElMessage.error(error.msg)
    })
}
const distribution = (row: any) => {
    router.push(`/categories/${row.id}`)
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