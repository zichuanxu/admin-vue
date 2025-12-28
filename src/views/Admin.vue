<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const data = reactive({
  pageSize: 10,
  currentPage: 1,
  total: 0,
  tableData: [],
  selectedIds: [],
});

// 加载数据：只查询管理员 (admin=true)
const load = async () => {
  try {
    const res = await axios.get("/api/user/all", {
      params: {
        pageNum: data.currentPage,
        pageSize: data.pageSize,
        admin: true
      },
    });
    if (res.data.code === 200) {
      data.tableData = res.data.data.records;
      data.total = res.data.data.total;
    }
  } catch (error) {
    ElMessage.error("获取管理员数据失败");
  }
};

const refreshAfterChange = () => {
  if (data.tableData.length === 1 && data.currentPage > 1) {
    data.currentPage--;
  }
  load();
};

const handleDelete = (id) => {
  ElMessageBox.confirm("确定要删除该管理员吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const res = await axios.delete(`/api/user/${id}`);
      if (res.data.code === 200) {
        ElMessage.success("删除成功");
        refreshAfterChange();
      }
    } catch (error) {
      ElMessage.error("系统错误");
    }
  }).catch(() => { });
};

const handleBatchDelete = () => {
  if (data.selectedIds.length === 0) return;
  ElMessageBox.confirm(`确定要批量删除选中的 ${data.selectedIds.length} 名管理员吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "danger",
  }).then(async () => {
    try {
      const res = await axios.post("/api/user/delete/batch", data.selectedIds);
      if (res.data.code === 200) {
        ElMessage.success("批量删除成功");
        data.selectedIds = [];
        refreshAfterChange();
      }
    } catch (error) {
      ElMessage.error("批量删除失败");
    }
  }).catch(() => { });
};

const handleEdit = (row) => {
  router.push({ path: '/manager/user-form', query: { id: row.id, type: 'admin' } });
};


const handleSelectionChange = (selection) => {
  data.selectedIds = selection.map((item) => item.id);
};

onMounted(() => {
  load();
});
</script>

<template>
  <div style="padding: 10px">

    <el-card>
      <el-table :data="data.tableData" style="width: 100%; margin-bottom: 10px"
        @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="username" label="管理员账号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'primary'">{{ scope.row.status === 1 ? '正常' : '禁用'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="data.currentPage" v-model:page-size="data.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
        @size-change="load" @current-change="load" />
    </el-card>
  </div>
</template>