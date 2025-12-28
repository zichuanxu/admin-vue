<template>
  <div>
    <div
      style="
        height: 60px;
        background-color: #3573f3;
        align-items: center;
        display: flex;
      "
    >
      <div
        style="
          width: 200px;
          display: flex;
          align-items: center;
          margin-left: 20px;
        "
      >
        <img
          src="/admin-panel.png"
          style="width: 32px; height: 32px; margin-right: 10px"
        />
        <span style="font-size: 25px; color: white">后台管理系统</span>
      </div>
      <div style="flex: 1"></div>
      <div style="width: fit-content; display: flex; align-items: center">
        <el-avatar
          src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif"
        />
        <span style="color: white; margin-left: 8px; margin-right: 10px"
          >管理员</span
        >
      </div>
    </div>

    <!-- 下方主要内容 -->
    <div style="display: flex">
      <!-- 左侧菜单栏 START -->
      <div
        style="
          width: 200px;
          border-right: 1px solid #ddd;
          min-height: calc(100vh - 60px);
        "
      >
        <el-menu
          router
          :default-active="router.currentRoute.value.path"
          style="border: 0"
          :default-openeds="['1']"
        >
          <el-menu-item index="/manager/home"
            ><el-icon>
              <House />
            </el-icon>
            <span>系统首页</span></el-menu-item
          >
          <el-menu-item index="/manager/data"
            ><el-icon>
              <DataBoard />
            </el-icon>
            <span>数据统计</span></el-menu-item
          >
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/manager/admin">管理员信息</el-menu-item>
            <el-menu-item index="/manager/employee">员工信息</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="/manager/info"
            ><el-icon>
              <UserFilled />
            </el-icon>
            <span>个人信息</span></el-menu-item
          >
          <el-menu-item index="/manager/exit"
            ><el-icon>
              <SwitchButton />
            </el-icon>
            <span>退出登录</span></el-menu-item
          >
        </el-menu>
      </div>
      <!-- 左侧菜单栏 END -->

      <!-- 右侧内容区 START-->
      <div style="flex: 1; width: 0; background-color: #f8f8ff; padding: 10px">
        <RouterView />
      </div>
      <!-- 右侧内容区 END-->
    </div>
  </div>
</template>

<script setup>
import router from "@/router";
import { RouterView } from "vue-router";
</script>