<template>
  <ElContainer class="layout-container-demo" style="height: 100vh">
    <ElAside width="210px">
      <ElScrollbar>
        <ElMenu
          class="x-menu"
          @select="select"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#fff"
          style="min-height: 100vh"
        >
          <ElMenuItem
            v-for="item in dirs?.data"
            :index="item.id"
            :key="item.id"
          >
            <template #title>
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>{{ item.name }}</span>
                <ElIcon
                  class="x-icon"
                  :size="16"
                  color="red"
                  @click.stop="del(item.id)"
                >
                  <Delete />
                </ElIcon>
              </div>
            </template>
          </ElMenuItem>
        </ElMenu>
      </ElScrollbar>
    </ElAside>

    <ElContainer>
      <ElHeader style="background: #fff; line-height: 60px">
        <ElButton type="primary" @click="visible = true">新建文件夹</ElButton>
      </ElHeader>

      <ElMain style="background: #f0f2f5">
        <NuxtPage />
      </ElMain>
    </ElContainer>
  </ElContainer>

  <ClientOnly>
    <ElDialog v-model="visible" title="新建文件夹" @closed="close">
      <ElForm ref="formRef" :model="form" label-width="120px" :rules="rules">
        <ElFormItem label="文件名" prop="name">
          <ElInput v-model="form.name" />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="cancel">取消</ElButton>
        <ElButton type="primary" @click="add"> 确认 </ElButton>
      </template>
    </ElDialog>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { Delete } from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from "element-plus";
import "normalize.css/normalize.css";

const { data: dirs, refresh } = useFetch("/api/dirs");

const visible = ref(false);
const current = useCurrent();
const formRef = ref<FormInstance>();
const form = reactive({
  name: "",
});
const rules = reactive<FormRules>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});

const add = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value.validate().then(() => {
    $fetch("/api/dirs", { method: "POST", body: form }).then(() => {
      ElMessage.success("新增成功");
      visible.value = false;
      refresh();
    });
  });
};
const del = (id: string) => {
  $fetch(`/api/dirs/${id}`, { method: "DELETE" }).then(() => {
    ElMessage.success("删除成功");
    refresh();
  });
};

const cancel = () => {
  visible.value = false;
};

const close = () => {
  console.log("close");
  formRef.value?.resetFields();
};

const select = (index: string) => {
  console.log(index);
  current.value = index;
};
</script>

<style scoped>
.x-menu .el-menu-item.is-active > div {
  height: 44px;
  padding: 0 8px;
  background: #4096ff;
  border-radius: 4px;
  margin: 0 -8px;
}
.x-menu .el-menu-item .x-icon {
  visibility: hidden;
  color: #f56c6c;
}
.x-menu .el-menu-item:hover .x-icon {
  visibility: visible;
}
</style>
