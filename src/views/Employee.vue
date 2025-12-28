<script setup>
import { reactive, onMounted, computed } from "vue";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

const data = reactive({
  searchName: "", // 搜索关键词
  isSearching: false, // 标记当前是否处于搜索模式
  pageSize: 10,
  currentPage: 1,
  total: 0,
  tableData: [], // 当前表格展示的数据（分页后）
  allTableData: [], // 缓存的全部原始数据
  selectedIds: [],
});

// 1. 计算属性：处理过滤后的数据
// 根据搜索关键词，从 allTableData 中过滤出匹配的项
const filteredData = computed(() => {
  if (!data.searchName) return data.allTableData;

  const query = data.searchName.toLowerCase();
  return data.allTableData.filter((item) => {
    // 多列模糊查询：检查 姓名、工号、部门名称、个人简介 是否包含关键词
    return (
      (item.name && item.name.toLowerCase().includes(query)) ||
      (item.no && item.no.toLowerCase().includes(query)) ||
      (item.gender && item.gender.toLowerCase().includes(query)) ||
      (item.departmentName &&
        item.departmentName.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  });
});

// 2. 核心加载逻辑
const load = async () => {
  // 如果当前处于搜索模式，执行前端逻辑分页
  if (data.isSearching) {
    localPaging();
    return;
  }

  // 正常分页请求（初次进入页面或重置后）
  try {
    const res = await axios.get("/api/employee/page", {
      params: { pageNum: data.currentPage, pageSize: data.pageSize },
    });
    if (res.data.code === 200) {
      data.tableData = res.data.data.records;
      data.total = res.data.data.total;
    }
  } catch (error) {
    ElMessage.error("获取数据失败");
  }
};

// 3. 点击查询按钮触发
const handleSearch = async () => {
  // 如果搜索框为空，直接视为重置或正常加载
  if (!data.searchName) {
    data.isSearching = false;
    load();
    return;
  }

  // 第一次点击搜索：如果缓存为空，则请求全量接口
  if (data.allTableData.length === 0) {
    try {
      const res = await axios.get("/api/employee/all");
      if (res.data.code === 200) {
        data.allTableData = res.data.data;
      }
    } catch (error) {
      ElMessage.error("获取全量数据失败");
      return;
    }
  }

  // 进入前端搜索模式
  data.isSearching = true;
  data.currentPage = 1; // 搜索后回到第一页
  localPaging();
};

// 4. 前端本地分页逻辑
const localPaging = () => {
  const filtered = filteredData.value;
  data.total = filtered.length;
  // 手动对过滤后的数组进行切片分页
  const start = (data.currentPage - 1) * data.pageSize;
  const end = data.currentPage * data.pageSize;
  data.tableData = filtered.slice(start, end);
};

// 5. 重置搜索
const reset = () => {
  data.searchName = "";
  data.isSearching = false;
  data.currentPage = 1;
  // 注意：这里不需要清空 data.allTableData，实现“直到刷新前都缓存”的需求
  load();
};

/**
 * 公共刷新逻辑：删除操作后必须清空缓存
 */
const refreshAfterChange = () => {
  data.allTableData = []; // 关键：清空全量缓存，保证下次查询获取最新数据
  data.isSearching = false; // 建议：重置搜索状态，返回普通分页模式
  data.searchName = "";     // 清空搜索框

  // 处理页码越界问题：如果当前页删光了，自动跳回上一页
  if (data.tableData.length === 1 && data.currentPage > 1) {
    data.currentPage--;
  }

  load(); // 重新拉取第一页数据
};



/**
 * 单个删除
 * @param {Number} id 员工ID
 */
const handleDelete = (id) => {
  ElMessageBox.confirm("确定要删除该员工吗？此操作不可逆", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(async () => {
    try {
      // 对齐后端接口：DELETE /employee/{id}
      const res = await axios.delete(`/api/employee/${id}`);
      if (res.data.code === 200) {
        ElMessage.success("删除成功");
        refreshAfterChange();
      } else {
        ElMessage.error(res.data.msg || "删除失败");
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

  ElMessageBox.confirm(`确定要批量删除选中的 ${data.selectedIds.length} 名员工吗？`, "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "danger",
  }).then(async () => {
    try {
      // 对齐后端接口：POST /employee/delete/batch
      // 注意：axios.post 的第二个参数是请求体(Body)
      const res = await axios.post("/api/employee/delete/batch", data.selectedIds);
      if (res.data.code === 200) {
        ElMessage.success("批量删除成功");
        data.selectedIds = []; // 清空选中列表
        refreshAfterChange();
      } else {
        ElMessage.error(res.data.msg || "批量删除失败");
      }
    } catch (error) {
      ElMessage.error("系统错误，批量删除失败");
    }
  }).catch(() => { });
};

// 修改新增按钮逻辑
const handleAdd = () => {
  router.push('/manager/employee-form');
};

// 修改编辑按钮逻辑
const handleEdit = (row) => {
  router.push({
    path: '/manager/employee-form',
    query: { id: row.id }
  });
};

// 表格多选
const handleSelectionChange = (selection) => {
  data.selectedIds = selection.map((item) => item.id);
};

// 页面加载
onMounted(() => {
  load();
});
</script>

<template>
  <div style="padding: 10px">
    <el-card style="margin-bottom: 10px">
      <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        ">
        <div>
          <el-input v-model="data.searchName" style="width: 240px; margin-right: 10px" placeholder="请输入查询内容"
            prefix-icon="Search" clearable @clear="reset" @keyup.enter="handleSearch" />
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button type="warning" @click="reset">重置</el-button>
        </div>
        <div>
          <el-button type="danger" :disabled="data.selectedIds.length === 0" @click="handleBatchDelete">批量删除</el-button>
          <el-button type="success" @click="handleAdd">新增员工</el-button>
        </div>
      </div>
    </el-card>

    <el-card>
      <el-table :data="data.tableData" style="width: 100%; margin-bottom: 10px"
        @selection-change="handleSelectionChange" stripe>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="no" label="工号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="gender" label="性别" width="80" />
        <el-table-column prop="departmentName" label="所属部门" width="150" />
        <el-table-column prop="description" label="个人简介" show-overflow-tooltip />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination v-model:current-page="data.currentPage" v-model:page-size="data.pageSize"
        :page-sizes="[10, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper" :total="data.total"
        @size-change="load" @current-change="load" />
    </el-card>
  </div>
</template>