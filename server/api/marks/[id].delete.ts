export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const marks = await storage.getItem('marks') || [];
  const idx = marks.findIndex((item) => item.id == event.context.params?.id);
  marks.splice(idx, 1);
  await storage.setItem('marks', marks)
  return {
    code: 200,
    data: null,
  };
})