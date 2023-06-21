<template>
  <div>
    <div class="d-container">
      <div style="display: flex">
        <div
          v-for="dir in dirs"
          :key="dir.id"
          :class="['d-item', { 'd-item--active': dir.id === form2.dir_id }]"
          @click="form2.dir_id = dir.id"
          @drop="(event) => onDrop(event, dir.id)"
          @dragover="onDragover"
        >
          <ElSpace>
            <span>{{ dir.name }}</span>
            <ElIcon style="cursor: pointer" @click="delDir(dir.id)">
              <CloseBold />
            </ElIcon>
          </ElSpace>
        </div>
      </div>
      <ElIcon style="cursor: pointer" @click="visible = true">
        <Plus />
      </ElIcon>
    </div>

    <ElButton
      style="position: fixed; z-index: 999; bottom: 100px; right: 100px"
      type="primary"
      @click="visible2 = true"
    >
      添加网页...
    </ElButton>

    <!-- <ElScrollbar v-loading="loading" height="88vh"> -->
    <ul v-if="marks.length" class="m-container">
      <li
        class="m-item"
        v-for="mark in marks"
        :key="mark.id"
        :draggable="true"
        @dragstart="(event) => onDragstart(event, mark)"
      >
        <a :href="mark.href" target="_blank">{{ mark.text }}</a>
        <ElIcon @click="del2(mark.id)">
          <CloseBold />
        </ElIcon>
      </li>
    </ul>
    <ElEmpty v-else></ElEmpty>
    <!-- </ElScrollbar> -->

    <ClientOnly>
      <ElDialog v-model="visible" title="新建文件夹" :width="500">
        <ElForm ref="formRef" :model="form" label-width="80px">
          <ElFormItem
            label="名称"
            prop="name"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <ElInput v-model="form.name" />
          </ElFormItem>
        </ElForm>
        <template #footer>
          <ElButton @click="cancel"> 取消 </ElButton>
          <ElButton type="primary" @click="ok"> 保存 </ElButton>
        </template>
      </ElDialog>
    </ClientOnly>

    <ClientOnly>
      <ElDialog v-model="visible2" title="修改书签" :width="500">
        <ElForm ref="formRef2" :model="form2" label-width="80px">
          <ElFormItem
            label="网址"
            prop="href"
            :rules="[{ required: true, trigger: 'change' }]"
          >
            <ElInput v-model="form2.href" />
          </ElFormItem>
        </ElForm>

        <template #footer>
          <ElButton @click="cancel2"> 取消 </ElButton>
          <ElButton type="primary" @click="ok2"> 保存 </ElButton>
        </template>
      </ElDialog>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
import { Mark } from "~/server/stores";
import { CloseBold, Plus } from "@element-plus/icons-vue";
import type { FormInstance } from "element-plus";

const { data, refresh } = useFetch("/api/dirs");
const dirs = computed(() => data.value?.data ?? []);
const delDir = async (id: any) => {
  await $fetch(`/api/dirs/${id}`, {
    method: "DELETE",
  });
  refresh();
};

const marks = ref<Mark[]>([]);
const loading = ref(false);
const getData = async () => {
  loading.value = true;
  const { data } = await $fetch(`/api/marks`, {
    params: { dir_id: form2.dir_id },
  });
  marks.value = data;
  loading.value = false;
};

const form = reactive({ name: "" });
const visible = ref(false);
const formRef = ref<FormInstance | null>(null);
const ok = async () => {
  if (!formRef.value) return;
  try {
    await formRef.value.validate();
    await $fetch("/api/dirs", { method: "POST", body: form });
    visible.value = false;
    await refresh();
    ElMessage.success("新建文件夹成功");
  } catch (error) {}
};
const cancel = () => {
  visible.value = false;
};

// 2
const form2 = reactive({
  dir_id: "",
  href: "",
});
const visible2 = ref(false);
const formRef2 = ref<FormInstance | null>(null);
const ok2 = async () => {
  if (!formRef2.value) return;
  try {
    await formRef2.value.validate();
    await $fetch("/api/marks", { method: "POST", body: form2 });
    visible2.value = false;
    await getData();
    ElMessage.success("修改书签成功");
  } catch (error) {}
};
const cancel2 = () => {
  visible2.value = false;
};
const del2 = async (id: string) => {
  await $fetch(`/api/marks/${id}`, { method: "DELETE" });
  getData();
};
watch(
  () => form2.dir_id,
  () => getData()
);

// to
const onDrop = async (event: DragEvent, dir_id: string) => {
  console.log("drop");
  event.preventDefault();
  const dt = event.dataTransfer;
  if (dt) {
    console.log(dt);
    const data = dt.getData("text/plain");
    console.log("data", data);
    await $fetch("/api/marks/transfer", {
      method: "POST",
      body: {
        dir_id,
        href: data,
      },
    });
    ElMessage.success("修改成功");
    getData();
  }
};
const onDragover = (event: DragEvent) => {
  const dt = event.dataTransfer;
  if (dt) {
    dt.dropEffect = "copy";
    event.preventDefault();
  }
};

// from
const onDragstart = (event: DragEvent, mark: Mark) => {
  event.dataTransfer?.setData("text/plain", mark.href);
};
</script>

<style lang="scss" scoped>
.m-container {
  margin: 0;
  padding: 0;
  list-style: none;
  .m-item {
    background: ghostwhite;
    padding: 15px 20px;
    margin: 8px 0;
    border-radius: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-decoration: none;
    }

    .el-icon {
      cursor: pointer;
    }
  }
}

.d-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .d-item {
    line-height: 38px;
    padding: 0 20px;
    margin-right: 8px;
    border-radius: 20px;
    border: 1px solid saddlebrown;

    &--active {
      background: saddlebrown;
      color: #fff;
    }
  }
}
</style>
