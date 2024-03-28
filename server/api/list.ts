export default defineEventHandler(async () => {
  const storage = useStorage("db");

  const list = await storage.getItem<any[]>("list");

  return list ?? [];
});
