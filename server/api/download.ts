// import fs from "node:fs";

export default defineEventHandler(async (event) => {
  const storage = useStorage("db");

  const list = await storage.getItem<any[]>("list");

  const data = list ?? [];

  setResponseHeaders(event, {
    "Content-Type": "application/json",
    "Content-Disposition": "attachment; filename=data.json",
  });

  return data;
});
