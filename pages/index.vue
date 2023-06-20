<script setup lang="ts">
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

const current = useCurrent();
const { data, refresh } = useFetch(() => `/api/marks?dir_id=${current.value}`);
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  href: "",
  dir_id: current,
});
const rules = reactive<FormRules>({
  href: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { type: "url", message: "请输入URL", trigger: "blur" },
  ],
});

const submitForm = () => {
  ruleFormRef.value?.validate().then(() => {
    $fetch("/api/marks", { method: "POST", body: ruleForm }).then(() => {
      refresh();
      ElMessage.success("新增成功");
      ruleFormRef.value?.resetFields();
      dialogVisible.value = false;
    });
  });
};
const del = async (id: string) => {
  await $fetch(`/api/marks/${id}`, { method: "DELETE" });
  refresh();
  ElMessage.success("删除成功");
};

const cancel = () => {
  ruleFormRef.value?.resetFields();
  dialogVisible.value = false;
};

const open = () => {
  dialogVisible.value = true;
};
</script>

<template>
  <ElCard>
    <template #header>
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <span>Total {{ data?.data.length }}</span>

        <ElButton type="primary" :disabled="false" @click="open">
          新增
        </ElButton>
      </div>
    </template>

    <ElTable :data="data?.data" max-height="calc(100vh - 260px)">
      <ElTableColumn prop="icon" label="图标" width="60">
        <template #default="{ row }">
          <img v-if="row.icon" :src="row.icon" alt="" width="16" />
          <span v-else>-</span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="text" label="名称" show-overflow-tooltip>
        <template #default="{ row }">
          <ElLink :href="row.href" target="_blank">
            {{ row.text }}
          </ElLink>
        </template>
      </ElTableColumn>

      <ElTableColumn prop="add_date" label="修改日期" sortable width="200">
        <template #default="{ row }">
          {{ dayjs(row.add_date).format("YYYY-MM-DD HH:mm:ss") }}
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="120">
        <template #default="{ row }">
          <ElButton size="small" type="danger" @click="del(row.id)"
            >删除</ElButton
          >
        </template>
      </ElTableColumn>
    </ElTable>
  </ElCard>

  <ClientOnly>
    <ElDialog v-model="dialogVisible" title="Tips">
      <ElForm
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        status-icon
      >
        <ElFormItem label="Href" prop="href">
          <ElInput v-model="ruleForm.href" />
        </ElFormItem>
      </ElForm>

      <template #footer>
        <span>
          <ElButton @click="cancel">Cancel</ElButton>
          <ElButton type="primary" @click="submitForm"> Confirm </ElButton>
        </span>
      </template>
    </ElDialog>
  </ClientOnly>
</template>
