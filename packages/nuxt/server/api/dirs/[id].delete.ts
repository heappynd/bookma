import db from "../../db";

export default defineEventHandler(async (event) => {
  await db.read();
  const dirs = db.data.dirs;
  const idx = dirs.findIndex((item) => item.id === event.context.params?.id);
  dirs.splice(idx, 1);
  await db.write();
  return {
    code: 200,
    data: null,
  };
})