<template>
  <div class="bg-gray-100 min-h-screen">
    <UModal v-model="isOpen">
      <UCard>
        <template #header>
          <div class="text-black/85 font-bold">新增书签</div>
        </template>
        <template #default>
          <div class="p-4">
            <UForm
              ref="formRef"
              :schema="schema"
              :state="state"
              class="space-y-4"
            >
              <UFormGroup label="Url" name="url">
                <UInput v-model="state.url" :autocomplete="false" />
              </UFormGroup>

              <UFormGroup label="Title" name="title">
                <UInput v-model="state.title" />
              </UFormGroup>

              <UFormGroup label="Description" name="description">
                <UInput v-model="state.description" />
              </UFormGroup>
            </UForm>
          </div>
        </template>

        <template #footer>
          <div class="flex justify-end gap-x-4">
            <UButton
              variant="outline"
              :loading="previewLoading"
              @click="handlePreview"
            >
              Preview
            </UButton>
            <UButton @click="handleSubmit"> Submit </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <div class="p-6">
      <div class="mb-2">
        <UButton @click="handleExport">导出</UButton>
      </div>

      <div class="flex justify-between items-center">
        <div class="flex flex-col">
          <div class="text-black/85">书签数量</div>
          <div class="text-black/65 font-bold text-3xl">
            {{ filteredData.length }}
          </div>
        </div>

        <UInput v-model="search" placeholder="Search..." class="mb-4 w-96" />
      </div>

      <div class="grid grid-cols-4 gap-4">
        <div
          class="border h-[180px] p-4 bg-white flex items-center justify-center cursor-pointer"
          @click="handleAdd"
        >
          Add
        </div>

        <div
          v-for="item in filteredData"
          :key="item.id"
          class="border h-[180px] p-4 bg-white hover:border-blue-500 cursor-pointer"
          @click="linkTo(item.url)"
        >
          <div class="flex items-center gap-x-4">
            <div class="w-12 h-12 bg-blue-500 shrink-0"></div>
            <div class="font-bold text-black/85 line-clamp-1">
              {{ item.title }}
            </div>
            <UButton
              class="ml-auto"
              size="2xs"
              @click.stop="handleDelete(item.id)"
            >
              Delete
            </UButton>
          </div>
          <div class="text-sm text-black/65 mt-4 line-clamp-2">
            {{ item.description || "-" }}
          </div>
          <div class="text-black/45 mt-4 text-right">
            {{ item.createTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";

const search = ref("");

const { data, refresh } = useFetch("/api/list");

const filteredData = computed(() => {
  if (!data.value) return [];
  return data.value.filter((item) =>
    item.title.toLowerCase().includes(search.value.toLowerCase())
  );
});

const schema = z.object({
  url: z.string().url("Invalid url"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  url: "",
  description: "",
  title: "",
});

const formRef = ref<Form<typeof state>>();

const previewLoading = ref(false);

async function handlePreview() {
  if (formRef.value) {
    await formRef.value.validate();

    previewLoading.value = true;

    try {
      const results = await $fetch("/api/preview", {
        method: "post",
        body: { url: state.url },
        timeout: 6000,
      });
      console.log("results", results);
      state.title = results.title;
      state.description = results.description ?? "";
      previewLoading.value = false;
    } catch (error) {
      previewLoading.value = false;
    }
  }
}

async function handleSubmit() {
  if (formRef.value) {
    await formRef.value.validate();

    const results = await $fetch("/api/submit", {
      method: "post",
      body: state,
    });

    isOpen.value = false;

    refresh();
  }
}

const isOpen = ref(false);

async function submit() {
  const results = await $fetch("/api/submit", {
    method: "post",
    body: { test: 123 },
  });
  console.log("results", results);
}

function linkTo(url: string) {
  window.open(url, "_blank");
}

function handleAdd() {
  state.url = "";
  state.title = "";
  state.description = "";
  isOpen.value = true;
}

async function handleDelete(id: string) {
  await $fetch("/api/list", { method: "DELETE", query: { id } });
  refresh();
}

async function handleExport() {
  window.open("/api/download", "_blank");
}
</script>
