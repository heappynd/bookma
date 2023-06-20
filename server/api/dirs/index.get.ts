export default defineEventHandler(async (event) => {
  const storage = useStorage('db')
  const dirs = await storage.getItem('dirs');
  return {
    code: 200,
    data: dirs,
  };
})