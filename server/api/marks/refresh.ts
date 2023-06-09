import { getMarksPromise } from '../../stores'

export default defineEventHandler(async (event) => {
  const marks = await getMarksPromise()
  const storage = useStorage('db')
  const m = []
  for (const mark of marks) {
    const { title, icon } = await getWebsiteTitle(mark.href)
    m.push({ ...mark, text: title, icon })
  }
  await storage.setItem('marks', m)

  return {
    code: 200,
    data: m,
  }
})
