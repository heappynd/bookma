import db from "../../db";

export default defineEventHandler(async (event) => {
  await db.read();
  const dirs = db.data.dirs;
  return {
    code: 200,
    data: dirs,
  };
})