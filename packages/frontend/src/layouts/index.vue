<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside width="210px">
      <el-scrollbar>
        <el-menu
          class="x-menu"
          @select="select"
          background-color="#001529"
          text-color="#fff"
          active-text-color="#fff"
          style="min-height: 100vh"
        >
          <el-menu-item v-for="item in data?.data?.data" :index="item.id" :key="item.id">
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
                <el-icon
                  class="x-icon"
                  :size="16"
                  color="red"
                  @click.stop="delMutation.mutate(item.id)"
                >
                  <Delete />
                </el-icon>
              </div>
            </template>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="background: #fff; line-height: 60px">
        <el-button type="primary" @click="visible = true">新建文件夹</el-button>
      </el-header>

      <el-main style="background: #f0f2f5">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>

  <el-dialog v-model="visible" title="新建文件夹" @closed="close">
    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="文件名" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="add"> 确认 </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import * as dirs from '@/api/dirs'
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'
import { useDirStore } from '@/stores/dir'
import { reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue'

const visible = ref(false)
const { currentDirId, setCurrentDirId } = useDirStore()
// Access QueryClient instance
const queryClient = useQueryClient()

const name = ref('')
const formRef = ref<FormInstance>()
const form = reactive({
  name: ''
})
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
  ]
})

const { isLoading, isError, data, error } = useQuery({
  queryKey: ['dirs'],
  queryFn: () => dirs.getDirs({})
})

const mutation = useMutation({
  mutationFn: dirs.createDir,
  onSuccess(data, variables, context) {
    queryClient.invalidateQueries(['dirs'])
    visible.value = false
  }
})

const delMutation = useMutation({
  mutationFn: dirs.deleteDir,
  onSuccess(data, variables, context) {
    queryClient.invalidateQueries(['dirs'])
  }
})

function add() {
  if (!formRef.value) {
    return
  }
  formRef.value.validate().then(() => {
    mutation.mutate(form)
  })
}

function cancel() {
  visible.value = false
}

function close() {
  console.log('close')
  formRef.value?.resetFields()
}

function select(index: number) {
  console.log(index)
  setCurrentDirId(index)
}
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
