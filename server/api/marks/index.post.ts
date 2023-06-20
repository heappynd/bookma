import { scrapeWebsite } from "../../utils";
import { nanoid } from 'nanoid'

export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const marks = await storage.getItem('marks') || [];
  const body = await readBody(event)
  const href = body.href;
  const dir_id = body.dir_id;
  const { icon, title } = await scrapeWebsite(href);
  const mark = {
    id: nanoid(),
    href,
    add_date: Date.now(),
    icon,
    text: title ? title : href,
    dir_id,
  };
  marks.push(mark);
  await storage.setItem('marks', marks)
  return {
    code: 200,
    data: mark,
  };
})