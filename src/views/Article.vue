<script setup>
import { reactive, onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
import request from '@/utils/request';

const router = useRouter();

const data = reactive({
  pageSize: 10,
  currentPage: 1,
  total: 0,
  tableData: [], // 表格数据
  selectedIds: [], // 选中的行ID
});

const previewVisible = ref(false)
const previewContent = ref('')
const previewTitle = ref('')

// 1. 核心加载逻辑 (纯后端分页)
const load = async () => {
  try {
    const res = await request.get("/article/page", {
      params: {
        pageNum: data.currentPage,
        pageSize: data.pageSize
      },
    });
    if (res.code === '200' || res.code === 200) { // 兼容不同后端的code类型
      data.tableData = res.data.records;
      data.total = res.data.total;
    } else {
      ElMessage.error(res.msg || "获取数据失败");
    }
  } catch (error) {
    console.error(error);
    ElMessage.error("系统错误，获取数据失败");
  }
};

/**
 * 单个删除
 * @param {Number} id 文章ID
 */
const handleDelete = (id) => {
  ElMessageBox.confirm("确定要删除这篇文章吗？此操作不可逆", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      const res = await request.delete(`/article/${id}`);
      if (res.code === '200' || res.code === 200) {
        ElMessage.success("删除成功");
        refreshAfterChange();
      } else {
        ElMessage.error(res.msg || "删除失败");
      }
    } catch (error) {
      ElMessage.error("系统错误，删除失败");
    }
  }).catch(() => { });
};

/**
 * 批量删除
 */
const handleBatchDelete = () => {
  if (data.selectedIds.length === 0) return;

  ElMessageBox.confirm(`确定要批量删除选中的 ${data.selectedIds.length} 篇文章吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "danger",
  }).then(async () => {
    try {
      const res = await request.post("/article/delete/batch", data.selectedIds);
      if (res.code === '200' || res.code === 200) {
        ElMessage.success("批量删除成功");
        data.selectedIds = [];
        refreshAfterChange();
      } else {
        ElMessage.error(res.msg || "批量删除失败");
      }
    } catch (error) {
      ElMessage.error("系统错误，批量删除失败");
    }
  }).catch(() => { });
};

/**
 * 删除后的刷新逻辑
 * 处理页码倒退问题（例如：删除了最后一页的唯一一条数据，应该跳回上一页）
 */
const refreshAfterChange = () => {
  if (data.tableData.length === 1 && data.currentPage > 1) {
    data.currentPage--;
  }
  load();
};

// 跳转到新增页面 (假设路由为 /manager/article-form)
const handleAdd = () => {
  router.push('/manager/article-form');
};

// 跳转到编辑页面
const handleEdit = (row) => {
  router.push({
    path: '/manager/article-form',
    query: { id: row.id }
  });
};

// 表格多选监听
const handleSelectionChange = (selection) => {
  data.selectedIds = selection.map((item) => item.id);
};

const handlePreview = (row) => {
  previewTitle.value = row.title
  previewContent.value = row.content // 直接取当前行数据的 content
  previewVisible.value = true
}

// 页面挂载时加载数据
onMounted(() => {
  load();
});
</script>

<template>
  <div style="padding: 10px">
    <el-card style="margin-bottom: 10px">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 18px; font-weight: bold; color: #333;">文章管理</div>
        <div>
          <el-button type="danger" :disabled="data.selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
          <el-button type="primary" @click="handleAdd">新建文章</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-table :data="data.tableData" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="summary" label="摘要" show-overflow-tooltip />
        <el-table-column prop="publishTime" label="发布时间" width="180" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" type="success" link @click="handlePreview(scope.row)">预览</el-button>
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="data.currentPage" v-model:page-size="data.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
        @size-change="load" @current-change="load" style="margin-top: 15px" />
    </el-card>

    <el-dialog v-model="previewVisible" :title="previewTitle" width="60%">
      <div class="w-e-text-container" style="padding: 10px">
        <div v-html="previewContent" class="article-content"></div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="previewVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style>
/* 非常重要：防止富文本里的图片撑破弹窗 */
.article-content img {
  max-width: 100%;
  height: auto;
}
</style>