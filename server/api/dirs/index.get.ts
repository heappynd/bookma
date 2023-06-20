import { getDirsPromise } from '../../stores'

export default defineEventHandler(async (event) => {
  const dirs = await getDirsPromise()
  return {
    code: 200,
    data: dirs,
  }
})
