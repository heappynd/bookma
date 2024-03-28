import axios from "axios";
import * as cheerio from "cheerio";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const storage = useStorage("db");

  const originList = await storage.getItem<any[]>("list");

  await useStorage("db").setItem("list", [
    ...originList ?? [],
    { id: Date.now(), ...body },
  ]);

  console.log("body", body);

  return "ok";
});
