import { getMarksPromise } from '../../stores'

export default defineEventHandler(async (event) => {
  const marks = await getMarksPromise()
  const query = getQuery(event)
  const dir_id = query.dir_id
  if (dir_id) {
    return {
      code: 200,
      data: marks.filter((item) => item.dir_id === dir_id),
    }
  } else {
    return {
      code: 200,
      data: marks,
    }
  }
})
