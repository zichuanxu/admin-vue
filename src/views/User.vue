<script setup>
import { reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
import request from '@/utils/request'

const data = reactive({
  searchName: "",
  isSearching: false,
  pageSize: 10,
  currentPage: 1,
  total: 0,
  tableData: [],
  allTableData: [], // 存储全量 List<UserDTO>
  selectedIds: [],
});

// 1. 计算属性：前端模糊查询
const filteredData = computed(() => {
  if (!data.searchName) return data.allTableData;
  const query = data.searchName.toLowerCase();
  return data.allTableData.filter(item =>
    (item.username && item.username.toLowerCase().includes(query)) ||
    (item.email && item.email.toLowerCase().includes(query))
  );
});

// 2. 加载逻辑：对接 /user/all
const load = async () => {
  if (data.isSearching) {
    localPaging();
    return;
  }
  try {
    const res = await request.get("/user/all", {
      params: { pageNum: data.currentPage, pageSize: data.pageSize, admin: false }
    });
    if (res.code === 200) {
      data.tableData = res.data.records;
      data.total = res.data.total;
    }
  } catch (error) {
    ElMessage.error("加载失败");
  }
};

// 3. 搜索逻辑：对接 /user/all-users
const handleSearch = async () => {
  if (!data.searchName) {
    data.isSearching = false;
    load();
    return;
  }

  // 如果没有缓存过全量数据，则请求接口
  if (data.allTableData.length === 0) {
    try {
      const res = await request.get("/user/all-users", { params: { admin: false } });
      if (res.code === 200) {
        data.allTableData = res.data;
      }
    } catch (error) {
      ElMessage.error("获取全量数据失败");
      return;
    }
  }

  data.isSearching = true;
  data.currentPage = 1;
  localPaging();
};

const localPaging = () => {
  const filtered = filteredData.value;
  data.total = filtered.length;
  const start = (data.currentPage - 1) * data.pageSize;
  const end = data.currentPage * data.pageSize;
  data.tableData = filtered.slice(start, end);
};

const reset = () => {
  data.searchName = "";
  data.isSearching = false;
  data.currentPage = 1;
  load();
};

const refreshAfterChange = () => {
  data.allTableData = []; // 清空缓存
  reset();
};

const handleDelete = (id) => {
  ElMessageBox.confirm("确定删除吗？", "提示", { type: "warning" }).then(async () => {
    const res = await request.delete(`/user/${id}`);
    if (res.code === 200) {
      ElMessage.success("已删除");
      refreshAfterChange();
    }
  }).catch(() => { });
};

const handleBatchDelete = () => {
  if (data.selectedIds.length === 0) return;
  ElMessageBox.confirm(`确定删除选中的 ${data.selectedIds.length} 项吗？`, "警告", { type: "danger" }).then(async () => {
    const res = await request.post("/user/delete/batch", data.selectedIds);
    if (res.code === 200) {
      ElMessage.success("批量删除成功");
      data.selectedIds = [];
      refreshAfterChange();
    }
  }).catch(() => { });
};

const handleEdit = (row) => router.push({ path: '/manager/user-form', query: { id: row.id, type: 'user' } });
const handleSelectionChange = (selection) => data.selectedIds = selection.map(item => item.id);

onMounted(load);
</script>

<template>
  <div style="padding: 15px">
    <el-card shadow="never" style="margin-bottom: 12px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>
          <el-input v-model="data.searchName" placeholder="搜索用户名或邮箱" style="width: 260px; margin-right: 12px" clearable
            @clear="reset" @keyup.enter="handleSearch" prefix-icon="Search" />
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="reset">重置</el-button>
        </div>
        <div>
          <el-button type="danger" :disabled="data.selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
        </div>
      </div>
    </el-card>

    <el-card shadow="never">
      <el-table :data="data.tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '正常' : '禁用'
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px">
        <el-pagination v-model:current-page="data.currentPage" v-model:page-size="data.pageSize"
          :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next" :total="data.total" @size-change="load"
          @current-change="load" />
      </div>
    </el-card>
  </div>
</template>