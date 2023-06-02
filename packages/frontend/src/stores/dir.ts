import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useDirStore = defineStore('dir', () => {
  const currentDirId = ref(-1)

  function setCurrentDirId(id: number) {
    currentDirId.value = id
  }

  return { currentDirId, setCurrentDirId }
})
