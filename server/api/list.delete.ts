export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const storage = useStorage("db");

  const list = await storage.getItem<any[]>("list");

  if (list) {
    const index = list.findIndex((item) => item.id === query.id);

    list?.splice(index, 1);

    storage.setItem("list", list);
  }

  return "ok";
});
