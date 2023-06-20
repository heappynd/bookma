import db from "../../db";
import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  await db.read();
  const dirs = db.data.dirs;
  const dir = {
    id: nanoid(),
    name: body.name,
  };
  dirs.push(dir);
  await db.write();
  return ({
    code: 200,
    data: dir,
  });
})