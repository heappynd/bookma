import { nanoid } from "nanoid";

export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const body = await readBody(event)
  const dirs = await storage.getItem('dirs') ?? [];
  console.log('dirs', dirs)
  const dir = {
    id: nanoid(),
    name: body.name,
  };
  const _dirs = [...dirs, dir]
  await storage.setItem('dirs', _dirs)
  return ({
    code: 200,
    data: dir,
  });
})