<template>
  <div class="bg-gray-100 h-screen">
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
            <UButton variant="outline" @click="handlePreview">
              Preview
            </UButton>
            <UButton @click="handleSubmit"> Submit </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <div class="grid grid-cols-4 gap-4 p-4">
      <div
        class="border h-[180px] p-4 bg-white flex items-center justify-center cursor-pointer"
        @click="handleAdd"
      >
        Add
      </div>

      <div
        v-for="item in data"
        :key="item.id"
        class="border h-[180px] p-4 bg-white hover:border-blue-500 cursor-pointer"
        @click="linkTo(item.url)"
      >
        <div class="flex items-center gap-x-4">
          <div class="w-12 h-12 bg-blue-500 shrink-0"></div>
          <div class="font-bold text-black/85 line-clamp-1">
            {{ item.title }}
          </div>
        </div>
        <div class="text-sm text-black/65 mt-4">
          {{ item.description }}
        </div>
        <div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent, Form } from "#ui/types";

const { data, refresh } = useFetch("/api/list");

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

async function handlePreview() {
  if (formRef.value) {
    await formRef.value.validate();

    const results = await $fetch("/api/preview", {
      method: "post",
      body: { url: state.url },
    });
    console.log("results", results);
    state.title = results.title;
    state.description = results.description ?? "";
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
</script>
