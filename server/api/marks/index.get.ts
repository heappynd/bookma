export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const marks = await storage.getItem('marks') || [];
  const query = getQuery(event)
  const dir_id = query.dir_id
  if (dir_id) {
    return {
      code: 200,
      data: marks.filter((item) => item.dir_id === dir_id),
    };
  } else {
    return {
      code: 200,
      data: marks,
    }
  }
})