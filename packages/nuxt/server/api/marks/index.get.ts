import db from "../../db";

export default defineEventHandler(async (event) => {
  await db.read();

  const { marks } = db.data
  await db.write()
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