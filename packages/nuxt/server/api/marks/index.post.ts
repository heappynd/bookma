import db, { Mark } from "../../db";
import { scrapeWebsite } from "../../utils";

export default defineEventHandler(async (event) => {
  await db.read()
  const body = await readBody(event)
  const href = body.href;
  const dir_id = body.dir_id;
  const { marks } = db.data;
  // console.log(marks);
  const { icon, title } = await scrapeWebsite(href);
  console.log("marks.length", marks.length);
  const mark: Mark = {
    id: marks.length + 1 + '',
    href,
    add_date: Date.now(),
    icon,
    text: title ? title : href,
    dir_id,
  };
  marks.push(mark);
  await db.write();
  return {
    code: 200,
    data: mark,
  };
})