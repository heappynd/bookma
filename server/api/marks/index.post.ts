import { getMarksPromise } from '../../stores'
import { getWebsiteTitle } from '../../utils'
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const marks = await getMarksPromise()
  const body = await readBody(event)
  const href = body.href
  const dir_id = body.dir_id
  const { title } = await getWebsiteTitle(href)
  const mark = {
    id: nanoid(),
    href,
    add_date: Date.now(),
    icon: '',
    text: title ? title : href,
    dir_id,
  }
  const has = marks.find((item) => item.href === href)
  if (has) {
    throw createError({
      statusCode: 500,
      statusMessage: '已存在',
    })
  }
  marks.push(mark)
  await storage.setItem('marks', marks)
  return {
    code: 200,
    data: mark,
  }
})
