import db from "../../db";

export default defineEventHandler(async (event) => {
  await db.read();
  const marks = db.data.marks;
  const idx = marks.findIndex((item) => item.id == event.context.params?.id);
  console.log(idx);
  marks.splice(idx, 1);
  await db.write();
  return {
    code: 200,
    data: null,
  };
})