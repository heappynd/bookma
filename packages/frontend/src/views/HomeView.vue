<script setup lang="ts">
import { useQueryClient, useQuery, useMutation } from '@tanstack/vue-query'
import * as marks from '@/api/marks'
import dayjs from 'dayjs'
import { useDirStore } from '@/stores/dir'
import { storeToRefs } from 'pinia'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  href: ''
})
const rules = reactive<FormRules>({
  href: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { type: 'url', message: '请输入URL', trigger: 'blur' }
  ]
})

const store = useDirStore()
const { currentDirId } = storeToRefs(store)
const { setCurrentDirId } = store
// Access QueryClient instance
const queryClient = useQueryClient()

const { isLoading, isError, data, error, isFetching } = useQuery({
  queryKey: ['marks', currentDirId],
  queryFn: () => marks.getMarks({ dir_id: currentDirId.value })
})

// Mutation
const mutation = useMutation({
  mutationFn: marks.createMark,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['marks', currentDirId] })
  }
})

const delMutation = useMutation({
  mutationFn: marks.deleteMark,
  onSuccess: () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['marks', currentDirId] })
  }
})

const submitForm = () => {
  ruleFormRef.value?.validate().then(() => {
    mutation.mutate({
      href: ruleForm.href,
      dir_id: currentDirId.value
    })
    ElMessage.success('新增成功')
    ruleFormRef.value?.resetFields()
    dialogVisible.value = false
  })
}

const dialogVisible = ref(false)

function cancel() {
  ruleFormRef.value?.resetFields()
  dialogVisible.value = false
}
</script>

<template>
  <el-card>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center">
        <span>Total {{ data?.data?.data?.length }}</span>

        <ElButton type="primary" :disabled="currentDirId === -1" @click="dialogVisible = true">
          新增
        </ElButton>
      </div>
    </template>

    <el-table :data="data?.data?.data" v-loading="isLoading" max-height="calc(100vh - 260px)">
      <el-table-column prop="icon" label="图标" width="60">
        <template #default="{ row }">
          <img v-if="row.icon" :src="row.icon" alt="" width="16" />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="text" label="名称" show-overflow-tooltip>
        <template #default="{ row }">
          <el-link :href="row.href" target="_blank">
            {{ row.text }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="add_date" label="修改日期" sortable width="200">
        <template #default="{ row }">
          {{ dayjs(row.add_date).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button size="small" type="danger" @click="delMutation.mutate(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog v-model="dialogVisible" title="Tips">
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="Href" prop="href">
        <el-input v-model="ruleForm.href" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancel">Cancel</el-button>
        <el-button type="primary" @click="submitForm"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
