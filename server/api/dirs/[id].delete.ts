import db from "../../db";

export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const dirs = await storage.getItem('dirs') || [];
  const idx = dirs.findIndex((item) => item.id === event.context.params?.id);
  dirs.splice(idx, 1);

  await storage.setItem('dirs', dirs)
  return {
    code: 200,
    data: null,
  };
})