<script setup>
import { reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();
import request from '@/utils/request'

const data = reactive({
  searchName: "",      // 搜索关键词
  isSearching: false,  // 标记当前是否处于搜索模式
  pageSize: 10,
  currentPage: 1,
  total: 0,
  tableData: [],       // 当前展示的数据
  allTableData: [],    // 全量缓存数据
  selectedIds: [],
});

// 1. 计算属性：处理过滤后的数据
const filteredData = computed(() => {
  if (!data.searchName) return data.allTableData;
  const query = data.searchName.toLowerCase();
  return data.allTableData.filter((item) => {
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });
});

// 2. 核心加载逻辑 (分页)
const load = async () => {
  if (data.isSearching) {
    localPaging();
    return;
  }
  try {
    const res = await request.get("/department/page", {
      params: { pageNum: data.currentPage, pageSize: data.pageSize },
    });
    if (res.code === 200) {
      data.tableData = res.data.records;
      data.total = res.data.total;
    }
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 3. 点击查询按钮：拉取全量并进入本地搜索模式
const handleSearch = async () => {
  if (!data.searchName) {
    data.isSearching = false;
    load();
    return;
  }

  if (data.allTableData.length === 0) {
    try {
      const res = await request.get("/department/all");
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

// 4. 前端本地分页
const localPaging = () => {
  const filtered = filteredData.value;
  data.total = filtered.length;
  const start = (data.currentPage - 1) * data.pageSize;
  const end = data.currentPage * data.pageSize;
  data.tableData = filtered.slice(start, end);
};

// 5. 重置
const reset = () => {
  data.searchName = "";
  data.isSearching = false;
  data.currentPage = 1;
  load();
};

const refreshAfterChange = () => {
  data.allTableData = [];
  reset();
};

const handleDelete = (id) => {
  ElMessageBox.confirm("确定要删除该部门吗？", "提示", { type: "warning" }).then(async () => {
    const res = await request.delete(`/department/${id}`);
    if (res.code === 200) {
      ElMessage.success("删除成功");
      refreshAfterChange();
    }
  }).catch(() => { });
};

const handleBatchDelete = () => {
  if (data.selectedIds.length === 0) return;
  ElMessageBox.confirm(`确定删除选中的 ${data.selectedIds.length} 个部门吗？`, "警告", { type: "danger" }).then(async () => {
    const res = await request.post("/department/delete/batch", data.selectedIds);
    if (res.code === 200) {
      ElMessage.success("批量删除成功");
      data.selectedIds = [];
      refreshAfterChange();
    }
  }).catch(() => { });
};

const handleAdd = () => router.push('/manager/department-form');
const handleEdit = (row) => router.push({ path: '/manager/department-form', query: { id: row.id } });
const handleSelectionChange = (selection) => data.selectedIds = selection.map(item => item.id);

onMounted(load);
</script>

<template>
  <div style="padding: 10px">
    <el-card style="margin-bottom: 10px">
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div>
          <el-input v-model="data.searchName" style="width: 240px; margin-right: 10px" placeholder="搜索部门名称或描述"
            prefix-icon="Search" clearable @clear="reset" @keyup.enter="handleSearch" />
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="warning" @click="reset">重置</el-button>
        </div>
        <div>
          <el-button type="danger" :disabled="data.selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
          <el-button type="success" @click="handleAdd">新增部门</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-table :data="data.tableData" style="width: 100%; margin-bottom: 10px"
        @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="部门名称" width="200" />
        <el-table-column prop="description" label="部门描述" show-overflow-tooltip />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="data.currentPage" v-model:page-size="data.pageSize"
        :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
        @size-change="load" @current-change="load" />
    </el-card>
  </div>
</template>