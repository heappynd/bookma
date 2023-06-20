import { getDirsPromise } from '../../stores'

export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const dirs = await getDirsPromise()
  const idx = dirs.findIndex((item) => item.id === event.context.params?.id)
  dirs.splice(idx, 1)

  await storage.setItem('dirs', dirs)
  return {
    code: 200,
    data: null,
  }
})
