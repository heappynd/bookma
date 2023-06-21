import { getMarksPromise } from '../../stores'

export default defineEventHandler(async (event) => {
  const marks = await getMarksPromise()
  const storage = useStorage('db')
  const { dir_id, href } = await readBody(event)
  const has = marks.find(item => item.href === href)
  if (has) {
    has.dir_id = dir_id
    await storage.setItem('marks', marks)
  } else {
    // just add
    return await $fetch('/api/marks', {
      method: 'POST', body: {
        dir_id,
        href
      }
    })
  }
  return {
    code: 200,
    data: has,
  }
})
